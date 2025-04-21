import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';

const neko = {
  data: new SlashCommandBuilder().setName('neko').setDescription('Get a random cute cat image!'),
  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    await interaction.deferReply();
    try {
      // Use the fetchCatImage helper attached to client
      // @ts-ignore
      const fetchCatImage: () => Promise<string | null> = client.fetchCatImage;
      const catUrl = await fetchCatImage();
      if (!catUrl) {
        await interaction.editReply(
          "Sorry, I couldn't fetch a cat right now. Please try again later! 😿",
        );
        return;
      }
      await interaction.editReply({
        content: "Here's a cute cat for you! 🐾",
        files: [catUrl],
      });
    } catch (error) {
      console.error('Error in /neko command:', error);
      await interaction.editReply('Something went wrong fetching your cat. 😿');
    }
  },
};

export default neko;
