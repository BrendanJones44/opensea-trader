import { CommandInteraction } from "discord.js";
import { CommandHandler } from "../interfaces/CommandHandler";

class DescribeHandler implements CommandHandler {
    // Brendan's userId
    private static AUTHORIZED_ID = '254438140087894036';

    async execute(interaction: CommandInteraction) {
        console.log(`Received describe command with interaction ${JSON.stringify(interaction)}`);
        if (interaction.user.id !== DescribeHandler.AUTHORIZED_ID) {
            console.log('Describe command attempted without being authorized user');
        }
        console.log(`OpenSea Link is: ${interaction.options.getString('opensea_link')}`);
        await interaction.reply(`Describing ${interaction.options.getString('opensea_link')}`);
    }
}

export default new DescribeHandler();
