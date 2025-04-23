import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import consola from 'consola';
import { fetchCatImage } from '../util';

export const CMD_NEKO = 'neko';

export const nekoCommand = new SlashCommandBuilder()
  .setName(CMD_NEKO)
  .setDescription('Get a random cute cat image!');

export async function executeNekoCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const catUrl = await fetchCatImage();

    if (!catUrl) {
      await interaction.editReply(
        "Sorry, I couldn't fetch a cat right now. Please try again later! 😿",
      );
      return;
    }

    await interaction.editReply({
      files: [catUrl],
    });
  } catch (error) {
    consola.error('Error in /neko command:', error);
    await interaction.editReply('Something went wrong fetching your cat. 😿');
  }
}
