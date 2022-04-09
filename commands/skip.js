const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core');
const { joinVoiceChannel, AudioPlayerStatus, createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Passez a la prochaine music'),
    async execute(interaction, serverQueue, queue) {
        serverQueue.songs.shift()

        play(interaction.guild, serverQueue.songs[0], queue);

        return interaction.reply(`Démarrage de la musique: **${serverQueue.songs[0].title}**`)
    }
}

function play(guild, song, queue) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.connection.disconnect();
        queue.delete(guild.id);
        return;
    }

    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });

    const resource = createAudioResource(ytdl(song.url,{ filter: 'audioonly'}),{ inlineVolume:true });

    resource.volume.setVolume(0.1)

    player.play(resource)

    const subscription = serverQueue.connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
        console.log('song is finis')
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0], queue);
    });

    player.on('error', error => {
        console.log('song is error')
        console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
    });

}
