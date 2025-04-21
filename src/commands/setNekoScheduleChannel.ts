import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType,
} from 'discord.js';
import { setScheduleChannel } from '../db/scheduleChannel';

export const data = new SlashCommandBuilder()
  .setName('setnekoschedulechannel')
  .setDescription('Set the channel for the daily Neko schedule.')
  .addChannelOption(option =>
    option
      .setName('channel')
      .setDescription('The channel to post the daily cat schedule in')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function executeSetNekoScheduleChannel(interaction: ChatInputCommandInteraction) {
  const channel = interaction.options.getChannel('channel', true);
  if (channel.type !== ChannelType.GuildText) {
    await interaction.reply({ content: 'Please select a text channel.', ephemeral: true });
    return;
  }
  setScheduleChannel(interaction.guildId!, channel.id);
  await interaction.reply({
    content: `Daily Neko schedule channel set to <#${channel.id}>!`,
    ephemeral: true,
  });
}
