import { CommandInteraction } from "discord.js";
import { CommandHandler } from "../interfaces/CommandHandler";

class PurchaseHandler implements CommandHandler {
    // Brendan's userId
    private static AUTHORIZED_ID = '254438140087894036';

    async execute(interaction: CommandInteraction) {
        console.log(`Received purchase command with interaction ${JSON.stringify(interaction)}`);
        if (interaction.user.id !== PurchaseHandler.AUTHORIZED_ID) {
            console.log('Purchase command attempted without being authorized user');
        }
        console.log(`EtherScan Link is: ${interaction.options.getString('link')}`);
        await interaction.reply('Purchase command!');
    }
}

export default new PurchaseHandler();
