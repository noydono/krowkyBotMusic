const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('renvoie le nombre de ping'),
    async execute(interaction) {
        await interaction.reply('pong')

        const message = await interaction.fetchReply();

        return interaction.editReply(`Le message a mis ${message.createdTimestamp - interaction.createdTimestamp} ms pour me parvenir et te revenir.\n Ton ping et de ${interaction.client.ws.ping} ms`)
    },
}