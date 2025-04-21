import { supabase } from './supabaseClient';

export async function setScheduleChannel(guildId: string, channelId: string): Promise<void> {
  const { error } = await supabase
    .from('guild_channels')
    .upsert([{ guild_id: guildId, channel_id: channelId }], { onConflict: 'guild_id' });
  if (error) throw error;
}

export async function getScheduleChannel(guildId: string): Promise<string | undefined> {
  const { data, error } = await supabase
    .from('guild_channels')
    .select('channel_id')
    .eq('guild_id', guildId)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // ignore no row found
  return data?.channel_id;
}

export async function removeScheduleChannel(guildId: string): Promise<void> {
  const { error } = await supabase.from('guild_channels').delete().eq('guild_id', guildId);
  if (error) throw error;
}
