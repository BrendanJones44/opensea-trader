import { CommandInteraction } from "discord.js";
import { CommandHandler } from "../interfaces/CommandHandler";

class ServerCommand implements CommandHandler {
    async execute(interaction: CommandInteraction) {
        console.log(`Received server command with interaction ${JSON.stringify(interaction)}`);
        await interaction.reply('Server info!');
    }
}

export default new ServerCommand();
