import { Command } from "../interfaces/Command";
import { CommandOptionType } from "../interfaces/CommandOption";
import DepositHandler from "../handlers/DepositHandler";

const DepositCommand: Command = {
    name: 'deposit',
    description: 'Records a deposit to the fund',
    handler: DepositHandler,
    options: [
        {
            name: 'user',
            description: 'the discord user making a deposit',
            isRequired: true,
            commandOptionType: CommandOptionType.USER
        },
        {
            name: 'date',
            description: 'mm/dd/yyyy of when this deposit happened',
            isRequired: true,
            commandOptionType: CommandOptionType.STRING
        },
        {
            name: 'is_paid',
            description: 'Whether the amount deposited has been paid yet',
            isRequired: true,
            commandOptionType: CommandOptionType.BOOLEAN
        },
        {
            name: 'eth_amount',
            description: 'The amount of ETH deposited',
            isRequired: true,
            commandOptionType: CommandOptionType.NUMBER
        }
    ]
}

export default DepositCommand;
