import { SlashCommandBuilder } from "@discordjs/builders";

export enum CommandOptionType {
    STRING
}

export type CommandOption = {
    name: string;
    description: string;
    isRequired: boolean;
    commandOptionType: CommandOptionType;
}

