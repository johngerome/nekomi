import 'dotenv/config';

import { Client, GatewayIntentBits, REST } from 'discord.js';
import { onInteractionCreate, onReady } from './listeners/listeners';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN as string);

onReady(client, rest);
onInteractionCreate(client);

client.login(process.env.DISCORD_TOKEN);
