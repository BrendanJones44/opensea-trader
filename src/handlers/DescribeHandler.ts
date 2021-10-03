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
        
        const openseaTransactionsRef = collection(db, 'opensea-transactions');
        const transactionQuery = query(openseaTransactionsRef, where('assetLink', '==', interaction.options.getString('opensea_link')))
        const queryResult = await getDocs(transactionQuery);
        const numberMatchingRecords = queryResult.size;

        if (numberMatchingRecords === 0) {
            await interaction.reply(`No matching transactions found for: ${interaction.options.getString('opensea_link')}\nYou either have a typo or this has not been recorded yet`);
            return;
        }

        if (numberMatchingRecords === 1) {
            const transactionRecord = queryResult.docs[0];
            
            const purchasePrice = transactionRecord.get('purchasePrice');
            const purchaseFee = transactionRecord.get('purchaseFees');
            const totalCost = purchasePrice + purchaseFee;

            // TODO: Need to handle conditional logic if the asset hasn't sold yet
            const salePrice = transactionRecord.get('salePrice');
            const saleFee = transactionRecord.get('saleFees');
            const netSale = salePrice - saleFee;


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
                `        % Return: ${netSale/totalCost * 100}`
            );
            return;
        }

        // Assuming the same WoW is not bought and sold multiple times
        await interaction.reply('Multiple transactions found for this asset! Not supported yet!')
    }
}

export default new DescribeHandler();
