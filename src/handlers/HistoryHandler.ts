import { CommandInteraction } from "discord.js";
import { db } from "../app";
import { CommandHandler } from "../interfaces/CommandHandler";
import { collection, getDocs, query, where } from "firebase/firestore";

class HistoryHandler implements CommandHandler {
    // Brendan's userId
    private static AUTHORIZED_ID = '254438140087894036';

    async execute(interaction: CommandInteraction) {
        console.log(`Received history command with interaction ${JSON.stringify(interaction)}`);
        if (interaction.user.id !== HistoryHandler.AUTHORIZED_ID) {
            console.log('Describe command attempted without being authorized user');
        }
        const discordName = interaction.options.getString('discord_name');
        console.log(`Discord Name is: ${discordName}`);

        // transform everything into amounts, build string at end after sorting amounts by time
        // amounts = [{ date: , eth: , description: }]
        // Get all deposits
        // Get all stakes
        // From each stake, get all transactions that have a sale
        // From each transaction
        
        const amounts: { date: Date, eth: number, description: string }[] = [];

        // Get all deposits
        const depositCollection = collection(db, 'deposits');
        const depositQuery = query(depositCollection, where('discordDisplayName', '==', discordName));
        const depositQueryResult = await getDocs(depositQuery);
        if (depositQueryResult.size === 0) {
            await interaction.reply(`No history found for ${discordName}`);
            return;
        }
        depositQueryResult.docs.forEach(deposit => {
            amounts.push({
                date: deposit.get('depositDate').toDate(),
                eth: deposit.get('ethAmount'),
                description: 'Deposit into the fund'
            });
        })


        // Get all stakes
        const equityStakeCollection = collection(db, 'equity-stakes');
        const equityStakeQuery = query(equityStakeCollection, where('discordDisplayName', '==', discordName));
        const equityStakeQueryResult = await getDocs(equityStakeQuery);
        if (equityStakeQueryResult.size === 0) {
            await interaction.reply(`No history found for ${discordName}`);
            return;
        }

        // From each stake, find the corresponding asset transaction if it has been sold
        for await (const equityStake of equityStakeQueryResult.docs) {
            // Keep track of amounts deposited
            amounts.push({
                date: equityStake.get('stakeDate').toDate(),
                eth: equityStake.get('amountEthPaid') * -1, // withdrawing from fund to stake
                description: `Equity stake in ${equityStake.get('assetLink')}`
            });

            const assetLink = equityStake.get('assetLink');

            const transactionCollection = collection(db, 'opensea-transactions');
            const transactionQuery = query(transactionCollection, where('assetLink', '==', assetLink));
            const transactionQueryResult = await getDocs(transactionQuery);

            if (transactionQueryResult.size === 1) {
                const transactionMatchingEquityStake = transactionQueryResult.docs[0];

                const purchasePrice = transactionMatchingEquityStake.get('purchasePrice');
                const purchaseFee = transactionMatchingEquityStake.get('purchaseFees');
                const totalCost = purchasePrice + purchaseFee;

                // TODO: Need to handle conditional logic if the asset hasn't sold yet
                const salePrice = transactionMatchingEquityStake.get('salePrice');
                const saleFee = transactionMatchingEquityStake.get('saleFees');
                const netSale = salePrice - saleFee;

                const amountEthPaid = equityStake.get('amountEthPaid');
                const portionOfAsset = amountEthPaid / totalCost;
                const amountEthOwed = portionOfAsset * netSale;

                amounts.push({
                    date: transactionMatchingEquityStake.get('saleDate').toDate(),
                    eth: amountEthOwed,
                    description: `Payout for owning ${(portionOfAsset * 100).toPrecision(5)}% of ${assetLink}`
                });
            } else {
                console.log(`No transaction found for assetLink: ${assetLink}`);
            }
        }

        let replyString = '';
        let balance = 0;
        amounts.sort((amountA, amountB) => amountA.date.getTime() - amountB.date.getTime()).forEach(amount => {
            balance += amount.eth;
            replyString += `${amount.date.toLocaleString()}: ${amount.eth.toPrecision(5)} ETH for ${amount.description}\n`
            // Don't display very small values
            if (balance < 0.001 && balance > -0.001) {
                balance = 0;
            }
            replyString += `Balance: ${balance.toPrecision(5)} ETH\n===\n`
        });

        console.log(replyString);

        await interaction.reply("History logged for Ethan")
        // Assuming the same WoW is not bought and sold multiple times
        // await interaction.reply('Multiple transactions found for this asset! Not supported yet!')
    }
}

export default new HistoryHandler();
