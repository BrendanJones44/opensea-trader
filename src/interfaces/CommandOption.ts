import { SlashCommandBuilder } from "@discordjs/builders";

export enum CommandOptionType {
    STRING,
    USER,
    BOOLEAN,
    NUMBER
}

export type CommandOption = {
    name: string;
    description: string;
    isRequired: boolean;
    commandOptionType: CommandOptionType;
}

