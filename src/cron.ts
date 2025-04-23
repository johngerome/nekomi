// Schedule daily Neko drop at 9:00 AM
  // cron.schedule('0 9 * * *', async () => {
  //   const catUrl = await fetchCatImage();
  //   if (!catUrl) return;
  //   // For each guild, send to its configured channel
  //   for (const [guildId] of client.guilds.cache) {
  //     // Dynamically import to avoid circular dependency
  //     const { getScheduleChannel } = await import('./db/scheduleChannel');
  //     const channelId = await getScheduleChannel(guildId);
  //     if (!channelId) continue;
  //     try {
  //       const channel = await client.channels.fetch(channelId);
  //       if (channel && channel.isTextBased()) {
  //         await (channel as TextChannel).send({
  //           content: "Nekomi's daily cat delivery! 🐾",
  //           files: [catUrl],
  //         });
  //       }
  //     } catch (err) {
  //       console.error(`Failed to send Neko to guild ${guildId}:`, err);
  //     }
  //   }
  // });