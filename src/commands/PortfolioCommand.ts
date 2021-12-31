import { Command } from "../interfaces/Command";
import PortfolioHandler from '../handlers/PortfolioHandler';
import { CommandOptionType } from "../interfaces/CommandOption";

const PortfolioCommand: Command = {
    name: 'portfolio',
    description: 'Replies with the portfolio of a discord user',
    handler: PortfolioHandler,
    options: [
        {
            name: 'discord_name',
            description: 'the name of the discord user',
            isRequired: true,
            commandOptionType: CommandOptionType.STRING
        }
    ]
}

export default PortfolioCommand;
