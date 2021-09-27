import { CommandInteraction } from "discord.js";

export interface CommandHandler {
    execute: (interaction: CommandInteraction) => Promise<void>;
}
