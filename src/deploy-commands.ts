const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

import { SlashCommandBuilder } from '@discordjs/builders';
import dotenv from 'dotenv';

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
        const command = commandModule.default;
        console.log(JSON.stringify(command));
        console.log(`Command Name: ${command.name}`);
        commands.push(
            new SlashCommandBuilder().setName(command.name).setDescription(command.description).toJSON()
        );
    }
    return commands;
}

const rest = new REST({ version: '9' }).setToken(discordToken);

getCommandsJson().then((commandsJson) => {
    rest.put(Routes.applicationGuildCommands(discordClientId, discordGuildId), { body: commandsJson })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
});
