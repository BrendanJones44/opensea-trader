import { Command } from "../interfaces/Command";
import DescribeHandler from '../handlers/DescribeHandler';
import { CommandOptionType } from "../interfaces/CommandOption";

const DescribeCommand: Command = {
    name: 'describe',
    description: 'Replies with the breakdown of an opensea asset',
    handler: DescribeHandler,
    options: [
        {
            name: 'opensea_link',
            description: 'the link to an opensea asset to describe',
            isRequired: true,
            commandOptionType: CommandOptionType.STRING
        }
    ]
}

export default DescribeCommand;
