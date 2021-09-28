import { Command } from "../interfaces/Command";
import PurchaseHandler from '../handlers/PurchaseHandler';
import { CommandOptionType } from "../interfaces/CommandOption";

const PurchaseCommand: Command = {
    name: 'purchase',
    description: 'Records a purchase from OpenSea',
    handler: PurchaseHandler,
    options: [
        {
            name: 'link',
            description: 'the link to an etherscan purchase',
            isRequired: true,
            commandOptionType: CommandOptionType.STRING
        }
    ]
}

export default PurchaseCommand;
