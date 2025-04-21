import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

const nekoScheduleCommand = {
  data: new SlashCommandBuilder()
    .setName('nekoschedule')
    .setDescription('Check when Nekomi posts her daily cat photo!'),
  async execute(interaction: ChatInputCommandInteraction) {
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
      const channelId = await getScheduleChannel(interaction.guildId);
      const channelInfo = channelId
        ? ` in <#${channelId}>`
        : ' (No schedule channel set!). Use `/setnekoschedulechannel` to set one.';
      await interaction.editReply(
        `Nekomi posts a cat every day at **9:00 AM** server time${channelInfo}! 🕘🐱`,
      );
    } catch (error) {
      // Only log in development or for diagnostics
      console.error('Error in /nekoschedule command:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: 'Sorry, something went wrong!',
          ephemeral: true,
        });
      } else if (interaction.deferred && !interaction.replied) {
        await interaction.editReply({
          content: 'Sorry, something went wrong!',
        });
      }
    }
  },
};

export default nekoScheduleCommand;
