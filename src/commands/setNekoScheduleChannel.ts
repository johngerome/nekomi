import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType,
  MessageFlags,
} from 'discord.js';
import { setScheduleChannel } from '../db/scheduleChannel';
import { parse, isValid, format } from 'date-fns';
import { scheduleDailyNekoDrop } from '../cron';

export const CMD_SETNEKOSCHEDULE = 'setnekoschedule';

export const setNekoScheduleCommand = new SlashCommandBuilder()
  .setName(CMD_SETNEKOSCHEDULE)
  .setDescription('Set the channel and time for the daily Neko schedule.')
  .addChannelOption(option =>
    option
      .setName('channel')
      .setDescription('The channel to post the daily cat schedule in')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText),
  )
  .addStringOption(option =>
    option.setName('time').setDescription('Time in 24hr format (HH:mm)').setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function executeSetNekoScheduleCommand(interaction: ChatInputCommandInteraction) {
  const channel = interaction.options.getChannel('channel', true);
  const timeInput = interaction.options.getString('time', true);

  if (!channel) {
    await interaction.reply({ content: 'Please select a text channel.', ephemeral: true });
    return;
  }

  if (!timeInput) {
    await interaction.reply({ content: 'Please provide a time.', ephemeral: true });
    return;
  }

  const parsedTime = parse(timeInput, 'HH:mm', new Date());

  if (!isValid(parsedTime)) {
    await interaction.reply({
      content: 'Invalid time format. Please use 24hr format (HH:mm), e.g., 14:30.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const time = format(parsedTime, 'HH:mm');

  // Store channel and time (assume setScheduleChannel can accept time as second argument)
  await setScheduleChannel(interaction.guildId!, channel.id, time);
  await scheduleDailyNekoDrop(interaction.client, interaction.guildId!);

  await interaction.reply({
    content: `Daily Neko schedule channel set to <#${channel.id}> at **${time}**!`,
    flags: MessageFlags.Ephemeral,
  });
}
