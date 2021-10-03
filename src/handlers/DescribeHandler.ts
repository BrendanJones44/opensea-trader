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

        await interaction.reply(`Describing ${interaction.options.getString('opensea_link')}\n Found ${queryResult.size} matching transactions`);
    }
}

export default new DescribeHandler();
