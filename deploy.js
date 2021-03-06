const fs = require('fs')
const { REST }  = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9');

require('dotenv').config();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for(let file of commandFiles){
    const command = require(`./KrowkyBotMusic/commands/${file}`)
    commands.push(command.data.toJSON());
}

const rest = new REST({version: '9'}).setToken(process.env.TOKEN);

(async () => {
    try {
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID,process.env.GUILD_ID),{body: commands})
        console.log('Command resister');
    } catch (error) {
        console.error(error);
    }
})()