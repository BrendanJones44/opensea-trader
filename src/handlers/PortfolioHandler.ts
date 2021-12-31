import { CommandInteraction } from "discord.js";
// import { db } from "../app";
import { CommandHandler } from "../interfaces/CommandHandler";
// import { collection, getDocs, query, where } from "firebase/firestore";

class PortfolioHandler implements CommandHandler {
    // Brendan's userId
    private static AUTHORIZED_ID = '254438140087894036';

    async execute(interaction: CommandInteraction) {
        console.log(`Received portfolio command with interaction ${JSON.stringify(interaction)}`);
        if (interaction.user.id !== PortfolioHandler.AUTHORIZED_ID) {
            console.log('Portfolio command attempted without being authorized user');
        }
        const discordName = interaction.options.getString('discord_name');
        console.log(`Discord Name is: ${discordName}`);

        await interaction.reply(`Portfolio command logged for ${discordName}`);
    }
}

export default new PortfolioHandler();
