import { Client, GatewayIntentBits, REST, Routes, Interaction, TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import cron from 'node-cron';
import axios from 'axios';
import catschedule from './commands/nekoSchedule';
import neko from './commands/neko';
import * as setNekoScheduleChannel from './commands/setNekoScheduleChannel';
import * as removeNekoScheduleChannel from './commands/removeNekoScheduleChannel';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN as string);

// Register slash commands
client.once('ready', async () => {
  console.log(`Nekomi is online nya~ as ${client.user?.tag}`);

  try {
    await rest.put(Routes.applicationCommands(client.user!.id), {
      body: [
        catschedule.data.toJSON(),
        neko.data.toJSON(),
        setNekoScheduleChannel.data.toJSON(),
        removeNekoScheduleChannel.data.toJSON(),
      ],
    });
    console.log('Slash commands registered!');
  } catch (error) {
    console.error('Command registration failed:', error);
  }

  // Schedule daily Neko drop at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    const catUrl = await fetchCatImage();
    if (!catUrl) return;
    // For each guild, send to its configured channel
    for (const [guildId] of client.guilds.cache) {
      // Dynamically import to avoid circular dependency
      const { getScheduleChannel } = await import('./db/scheduleChannel');
      const channelId = await getScheduleChannel(guildId);
      if (!channelId) continue;
      try {
        const channel = await client.channels.fetch(channelId);
        if (channel && channel.isTextBased()) {
          await (channel as TextChannel).send({
            content: "Nekomi's daily cat delivery! 🐾",
            files: [catUrl],
          });
        }
      } catch (err) {
        console.error(`Failed to send Neko to guild ${guildId}:`, err);
      }
    }
  });
});

// Interaction handler
client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'nekoschedule') {
    await catschedule.execute(interaction);
  } else if (interaction.commandName === 'neko') {
    await neko.execute(interaction, client);
  } else if (interaction.commandName === 'setnekoschedulechannel') {
    await setNekoScheduleChannel.executeSetNekoScheduleChannel(interaction);
  } else if (interaction.commandName === 'removenekoschedulechannel') {
    await removeNekoScheduleChannel.executeRemoveNekoScheduleChannel(interaction);
  }
});

// Helper to get a cat image
const fetchCatImage = async (): Promise<string | null> => {
  try {
    const res = await axios.get('https://api.thecatapi.com/v1/images/search');
    return res.data[0]?.url || null;
  } catch (err) {
    console.error('Error fetching cat image:', err);
    return null;
  }
};

// Attach fetchCatImage to client for command access
// @ts-expect-error: fetchCatImage is dynamically attached to client
client.fetchCatImage = fetchCatImage;

client.login(process.env.DISCORD_TOKEN);
