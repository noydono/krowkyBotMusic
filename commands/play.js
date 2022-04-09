const {SlashCommandBuilder} = require('@discordjs/builders');
const ytdl = require('ytdl-core');
const {
    joinVoiceChannel,
    AudioPlayerStatus,
    createAudioPlayer,
    NoSubscriberBehavior,
    createAudioResource
} = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('lire une video youtube')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Url de la video youtube')
                .setRequired(true)
        ),

    async execute(interaction, serverQueue , queue) {
        console.log("coucou")
        const url = interaction.options.getString('url');

        const voiceChannel = interaction.member.voice.channel;

         checkIsValidChannel(voiceChannel, interaction)

         checkPermission(voiceChannel, interaction)

        let song = await getSong(url)

        if (!serverQueue) {
            const queueContruct = {
                textChannel: interaction.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };

            queue.set(interaction.guild.id, queueContruct);

            queueContruct.songs.push(song);

            try {
                queueContruct.connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                });

                play(interaction.guild, queueContruct.songs[0], queue);

                return interaction.reply(`Démarrage de la musique: **${queueContruct.songs[0].title}**`)
            } catch (error) {
                console.error(error);
                queue.delete(interaction.guild.id);
                return interaction.channel.send(error);
            }

        }else {
            serverQueue.songs.push(song);
            return interaction.reply(`${song.title} has been added to the queue!`)
        }
    },
}



function checkPermission(voiceChannel, interaction) {
    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return interaction.channel.send("I need the permissions to join and speak in your voice channel!");
    }
}

function checkIsValidChannel(voiceChannel, interaction) {
    if (!voiceChannel) {
        return interaction.channel.send("You need to be in a voice channel to play music!");
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

async function getSong(url) {
    const songInfo = await ytdl.getInfo(url);
    return song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };
}



