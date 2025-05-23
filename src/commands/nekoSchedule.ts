import type { ChatInputCommandInteraction } from 'discord.js';

import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import { CMD_SETNEKOSCHEDULE as SET_COMMAND } from './setNekoScheduleChannel';

import consola from 'consola';

export const CMD_CHECK_NEKOSCHEDULE = 'check-schedule';

export const nekoScheduleCommand = new SlashCommandBuilder()
  .setName(CMD_CHECK_NEKOSCHEDULE)
  .setDescription('Check when Nekomi posts her daily cat photo!');

export async function executeNekoScheduleCommand(interaction: ChatInputCommandInteraction) {
  if (!interaction.guildId) {
    await interaction.reply({
      content: 'This command can only be used in a server.',
      ephemeral: true,
    });
    return;
  }

  try {
    await interaction.deferReply({ ephemeral: true });
    const { getScheduleChannel } = await import('../db/scheduleChannel');
    const schedule = await getScheduleChannel(interaction.guildId);

    if (!schedule) {
      await interaction.editReply(`No schedule channel set! Use /${SET_COMMAND} to set one.`);
      return;
    }

    const { channelId, time } = schedule;

    if (!channelId) {
      await interaction.editReply(`No schedule channel set! Use /${SET_COMMAND} to set one.`);
      return;
    }

    if (!time) {
      await interaction.editReply(`No schedule time set! Use /${SET_COMMAND} to set one.`);
      return;
    }

    await interaction.editReply(
      `Nekomi posts a cat every day at **${time}** server time in <#${channelId}>! 🕘🐱`,
    );
  } catch (error) {
    // Only log in development or for diagnostics
    consola.error(`Error in /${CMD_CHECK_NEKOSCHEDULE} command:`, error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: 'Sorry, something went wrong!',
        flags: MessageFlags.Ephemeral,
      });
    } else if (interaction.deferred && !interaction.replied) {
      await interaction.editReply({
        content: 'Sorry, something went wrong!',
      });
    }
  }
}
