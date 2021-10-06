import { Command } from "../interfaces/Command";
import HistoryHandler from '../handlers/HistoryHandler';
import { CommandOptionType } from "../interfaces/CommandOption";

const DescribeCommand: Command = {
    name: 'history',
    description: 'Replies with the history of a discord user',
    handler: HistoryHandler,
    options: [
        {
            name: 'discord_name',
            description: 'the name of the discord user',
            isRequired: true,
            commandOptionType: CommandOptionType.STRING
        }
    ]
}

export default DescribeCommand;
