const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core');
const { joinVoiceChannel, AudioPlayerStatus, createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Mettre en pause la music'),
    async execute(interaction, serverQueue) {
        
    },
}