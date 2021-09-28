import { CommandHandler } from "./CommandHandler";
import { CommandOption } from "./CommandOption";

export type Command = {
    name: string;
    description: string;
    handler: CommandHandler;
    options?: CommandOption[];
}
