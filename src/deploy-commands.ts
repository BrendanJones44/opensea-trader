const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

import dotenv from 'dotenv';

// Use dotenv to load DISCORD_TOKEN from a .env file
dotenv.config();
const discordToken = process.env.DISCORD_TOKEN;
const discordClientId = process.env.DISCORD_CLIENT_ID;
const discordGuildId = process.env.DICORD_GUIILD_ID;

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
    new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
    .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(discordToken);

rest.put(Routes.applicationGuildCommands(discordClientId, discordGuildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
