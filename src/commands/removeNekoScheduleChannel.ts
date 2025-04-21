import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  MessageFlags,
} from 'discord.js';
import { removeScheduleChannel } from '../db/scheduleChannel';

export const data = new SlashCommandBuilder()
  .setName('removenekoschedulechannel')
  .setDescription('Remove the channel for the daily Neko schedule.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function executeRemoveNekoScheduleChannel(interaction: ChatInputCommandInteraction) {
  if (!interaction.guildId) {
    await interaction.reply({
      content: 'This command can only be used in a server.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  await removeScheduleChannel(interaction.guildId);
  await interaction.reply({
    content: 'Daily Neko schedule channel has been removed.',
    flags: MessageFlags.Ephemeral,
  });
}
