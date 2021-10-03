import { CommandInteraction } from "discord.js";
import { db } from "../app";
import { CommandHandler } from "../interfaces/CommandHandler";
import { collection, getDocs, query, where } from "firebase/firestore";

class DescribeHandler implements CommandHandler {
    // Brendan's userId
    private static AUTHORIZED_ID = '254438140087894036';

    async execute(interaction: CommandInteraction) {
        console.log(`Received describe command with interaction ${JSON.stringify(interaction)}`);
        if (interaction.user.id !== DescribeHandler.AUTHORIZED_ID) {
            console.log('Describe command attempted without being authorized user');
        }
        console.log(`OpenSea Link is: ${interaction.options.getString('opensea_link')}`);
        
        const transactionCollection = collection(db, 'opensea-transactions');
        const transactionQuery = query(transactionCollection, where('assetLink', '==', interaction.options.getString('opensea_link')))
        const transactionQueryResult = await getDocs(transactionQuery);
        const numberMatchingRecords = transactionQueryResult.size;

        if (numberMatchingRecords === 0) {
            await interaction.reply(`No matching transactions found for: ${interaction.options.getString('opensea_link')}\nYou either have a typo or this has not been recorded yet`);
            return;
        }

        if (numberMatchingRecords === 1) {
            const transactionRecord = transactionQueryResult.docs[0];

            const purchasePrice = transactionRecord.get('purchasePrice');
            const purchaseFee = transactionRecord.get('purchaseFees');
            const totalCost = purchasePrice + purchaseFee;

            // TODO: Need to handle conditional logic if the asset hasn't sold yet
            const salePrice = transactionRecord.get('salePrice');
            const saleFee = transactionRecord.get('saleFees');
            const netSale = salePrice - saleFee;

            const equityCollection = collection(db, 'equity-stakes');
            const equityQuery = query(equityCollection, where('assetLink', '==', interaction.options.getString('opensea_link')));
            const equityQueryResult = await getDocs(equityQuery);

            let equityReplyString = '    Equity Breakdown\n';

            if (equityQueryResult.size === 0) {
                equityReplyString += '        No equity owners found';
            } else {
                equityQueryResult.forEach(equityStake => {
                    const amountEthPaid = equityStake.get('amountEthPaid');
                    const portionOfAsset = amountEthPaid / totalCost;
                    const amountEthOwed = portionOfAsset * netSale;

                    equityReplyString += `        Breakdown for ${equityStake.get('discordDisplayName')}:\n`;
                    equityReplyString += `            Paid ${amountEthPaid} ETH on ${equityStake.get('stakeDate').toDate()}\n`;
                    equityReplyString += `            Results in ${amountEthPaid} / ${totalCost} ownership which is: ${portionOfAsset * 100} %\n`;
                    equityReplyString += `            ETH owed after sale: ${amountEthOwed}\n`;
                    equityReplyString += `            Profited ${amountEthOwed - amountEthPaid} ETH (${(amountEthOwed / amountEthPaid) * 100 } % return)\n`;
                });
            }


            await interaction.reply(
                `Describing: ${interaction.options.getString('opensea_link')}\n` +
                '    Purchase Breakdown\n' +
                `        Purchased for: ${purchasePrice} ETH on ${transactionRecord.get('purchaseDate').toDate()}\n` +
                `        Purchase link: ${transactionRecord.get('etherScanPurchaseLink')}\n` +
                `        Purchase fees: ${purchaseFee} ETH (${transactionRecord.get('purchaseFeeDescription')})\n` +
                '    Sale Breakdown\n' +
                `        Sold for: ${salePrice} ETH on ${transactionRecord.get('saleDate').toDate()}\n` +
                `        Sale link: ${transactionRecord.get('etherScanSaleLink')}\n` +
                `        Sale fees: ${saleFee} ETH (${transactionRecord.get('saleFeeDescription')})\n` +
                '    Return Breakdown\n' +
                `        Net Sale: ${netSale} ETH\n` +
                `        Total Cost: ${totalCost} ETH\n` +
                `        Profit: ${netSale - totalCost} ETH\n` +
                `        % Return: ${(netSale / totalCost) * 100}\n` + equityReplyString
            );
            return;
        }

        // Assuming the same WoW is not bought and sold multiple times
        await interaction.reply('Multiple transactions found for this asset! Not supported yet!')
    }
}

export default new DescribeHandler();
