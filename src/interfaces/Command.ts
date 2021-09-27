import { CommandHandler } from "./CommandHandler";

export type Command = {
    name: string;
    description: string;
    handler: CommandHandler;
}
