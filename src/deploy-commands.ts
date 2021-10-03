const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

import { SlashCommandBuilder } from '@discordjs/builders';
import dotenv from 'dotenv';
import { Command } from './interfaces/Command';
import { CommandOptionType } from './interfaces/CommandOption';

// Use dotenv to load DISCORD_TOKEN from a .env file
dotenv.config();
const discordToken = process.env.DISCORD_TOKEN;
const discordClientId = process.env.DISCORD_CLIENT_ID;
const discordGuildId = process.env.DICORD_GUIILD_ID;

const getCommandsJson = async () => {
    const commands = [];
    const commandFileNames = fs.readdirSync('./src/commands').filter((fileName: string) => fileName.endsWith('.ts'));
    console.log(`Found ${commandFileNames.length} of command files`);

    for (const fileName of commandFileNames) {
        const commandModule = await import(`./commands/${fileName}`);
        const command: Command = commandModule.default;
        console.log(`Registering Command Name: ${command.name}`);

        // All commands have a name and description
        const slashCommandBuilder = new SlashCommandBuilder().setName(command.name).setDescription(command.description)

        if (command.options) {
            for (const commandOption of command.options) {
                if (commandOption.commandOptionType === CommandOptionType.STRING) {
                    slashCommandBuilder.addStringOption(option =>
                        option
                            .setName(commandOption.name)
                            .setDescription(commandOption.description)
                            .setRequired(commandOption.isRequired)
                    );
                }
                if (commandOption.commandOptionType === CommandOptionType.USER) {
                    slashCommandBuilder.addUserOption(option =>
                        option
                            .setName(commandOption.name)
                            .setDescription(commandOption.description)
                            .setRequired(commandOption.isRequired)
                    );
                }
                if (commandOption.commandOptionType === CommandOptionType.NUMBER) {
                    slashCommandBuilder.addNumberOption(option =>
                        option
                            .setName(commandOption.name)
                            .setDescription(commandOption.description)
                            .setRequired(commandOption.isRequired)
                    );
                }
                if (commandOption.commandOptionType === CommandOptionType.BOOLEAN) {
                    slashCommandBuilder.addBooleanOption(option =>
                        option
                            .setName(commandOption.name)
                            .setDescription(commandOption.description)
                            .setRequired(commandOption.isRequired)
                    );
                }
            }
        }
        commands.push(slashCommandBuilder.toJSON());
    }
    console.log(`Command JSON body: ${JSON.stringify(commands)}`);
    return commands;
}

const rest = new REST({ version: '9' }).setToken(discordToken);

getCommandsJson().then((commandsJson) => {
    rest.put(Routes.applicationGuildCommands(discordClientId, discordGuildId), { body: commandsJson })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
});
