import { Client, Interaction, REST, Routes } from 'discord.js';

import { CMD_NEKO, executeNekoCommand, nekoCommand } from '../commands/neko';
import {
  CMD_NEKOSCHEDULE,
  executeNekoScheduleCommand,
  nekoScheduleCommand,
} from '../commands/nekoSchedule';
import {
  CMD_SETNEKOSCHEDULE,
  executeSetNekoScheduleCommand,
  setNekoScheduleCommand,
} from '../commands/setNekoScheduleChannel';
import {
  CMD_REMOVENEKOSCHEDULE,
  executeRemoveNekoScheduleCommand,
  removeNekoScheduleCommand,
} from '../commands/removeNekoScheduleChannel';

/**
 * Sets up all the bot's slash commands!
 * @param client The bot client we're adding commands to.
 * @param rest The REST client we use to send the commands.
 */
export async function register(client: Client, rest: REST) {
  try {
    await rest.put(Routes.applicationCommands(client.user!.id), {
      body: [
        nekoCommand.toJSON(),
        nekoScheduleCommand.toJSON(),
        setNekoScheduleCommand.toJSON(),
        removeNekoScheduleCommand.toJSON(),
      ],
    });
    console.log('Slash commands registered!');
  } catch (error) {
    console.error('Command registration failed:', error);
  }
}

/**
 * Handles what happens when someone uses a slash command!
 * @param interaction The user's interaction with the bot.
 */
export async function interactionCreate(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  switch (interaction.commandName) {
    case CMD_NEKO:
      await executeNekoCommand(interaction);
      break;
    case CMD_NEKOSCHEDULE:
      await executeNekoScheduleCommand(interaction);
      break;
    case CMD_SETNEKOSCHEDULE:
      await executeSetNekoScheduleCommand(interaction);
      break;
    case CMD_REMOVENEKOSCHEDULE:
      await executeRemoveNekoScheduleCommand(interaction);
      break;
  }
}
