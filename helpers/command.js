const {Client, CommandInteraction} = require('discord.js');

const handleCommand = async (client,interaction,queue) => {
    const command = client.commands.get(interaction.commandName);

    if(!command) return;

    try {
        const serverQueue = queue.get(interaction.guild.id);
        await command.execute(interaction, serverQueue, queue);
    } catch (error) {
        console.error(error);
        await interaction.reply({content: "You need to enter a valid command!", ephemeral: true})
    }
};

module.exports = handleCommand
