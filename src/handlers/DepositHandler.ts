import { CommandInteraction } from "discord.js";
import { CommandHandler } from "../interfaces/CommandHandler";

class DepositHandler implements CommandHandler {
    // Brendan's userId
    private static AUTHORIZED_ID = '254438140087894036';

    async execute(interaction: CommandInteraction) {
        console.log(`Received deposit command with interaction ${JSON.stringify(interaction)}`);
        if (interaction.user.id !== DepositHandler.AUTHORIZED_ID) {
            console.log('Deposit command attempted without being authorized user');
        }
        console.log(`User Link is: ${JSON.stringify(interaction.options.getUser('user'))}`);
        /*
        User Link is: {"id":"787888819000573962","bot":false,"system":false,"flags":0,"username":"Spence","discriminator":"0932","avatar":null,"createdTimestamp":1607917732716,"defaultAvatarURL":"https://cdn.discordapp.com/embed/avatars/2.png","tag":"Spence#0932","avatarURL":null,"displayAvatarURL":"https://cdn.discordapp.com/embed/avatars/2.png"}
        */
        await interaction.reply('Deposit command!');
    }
}

export default new DepositHandler();
