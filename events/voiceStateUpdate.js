const { getVoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice')

module.exports = {
  name: "voiceStateUpdate",
  async execute(client, oldState, newState) {
    if (!oldState.guild && !newState.guild) return;

    if (newState.channelId){
      if (client.db.get(`manual_${newState.guild.id}`) === true) return;

      const channel = await newState.guild.channels.fetch(client.db.get(`autochannel_${newState.guild.id}`)).catch(() => false)
      if (!channel) return;

      if (newState.channelId !== channel.id) return;

      const VoiceConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
      });
  
      const live = createAudioResource("http://icecast.skyrock.net/s/natio_aac_128k"); 
      const player = createAudioPlayer()
  
      VoiceConnection.subscribe(player)
      player.play(live)
    }
  }
}
