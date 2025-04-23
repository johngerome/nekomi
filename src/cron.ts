import cron from 'node-cron';
import consola from 'consola';
import { Client, TextChannel } from 'discord.js';
import { fetchCatImage } from './util';

export async function scheduleDailyNekoDrop(client: Client, guildId: string) {
  try {
    // Dynamically import to avoid circular dependency
    const { getScheduleChannel } = await import('./db/scheduleChannel');
    const channel = await getScheduleChannel(guildId);

    if (!channel?.channelId || !channel.time) return;

    const [hour, minute] = channel.time.split(':').map(Number);
    const cronExpr = `${minute} ${hour} * * *`;

    cron.schedule(cronExpr, async () => {
      consola.info('Cron Triggered for guild:', guildId, new Date().toISOString());
      const catUrl = await fetchCatImage();

      if (!catUrl) return;

      const dch = await client.channels.fetch(channel.channelId);

      if (dch && dch.isTextBased()) {
        await (dch as TextChannel).send({
          content: "Nekomi's daily cat delivery! 🐾",
          files: [catUrl],
        });
      }
    });

    consola.info('Cron scheduled for guild');
  } catch (error) {
    consola.error('Failed to schedule daily Neko drop:', error);
  }
}
