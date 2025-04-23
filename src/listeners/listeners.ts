import { Client, Interaction, REST } from 'discord.js';
import { interactionCreate, register } from './register';

/**
 * Runs when the bot is ready to go!
 * @param client The bot client that's now connected and ready.
 * @param rest The REST client we use to set up commands.
 */
export function onReady(client: Client, rest: REST) {
  client.on('ready', () => {
    register(client, rest);

    console.log(`Nekomi is online nya~ as ${client.user?.tag}`);
  });
}

/**
 * Handles stuff when someone interacts with the bot!
 * @param client The bot client that's listening for interactions.
 */
export function onInteractionCreate(client: Client) {
  client.on('interactionCreate', async (interaction: Interaction) => {
    await interactionCreate(interaction);
  });
}
