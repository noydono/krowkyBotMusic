const fs = require('fs')
const {Client, Intents, Collection} = require('discord.js')
const handleCommand = require('./helpers/command');

let queue = new Map()


require('dotenv').config();

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES]})

client.commands = new Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (let file of commandFiles) {
    const command = require(`./KrowkyBotMusic/commands/${file}`)
    client.commands.set(command.data.name, command)
}

client.once('ready', () => {
    console.log('KrowkyBotMusicIsReady');
})

client.on('interactionCreate', interaction => {
    console.log("interaction")
    if (interaction.isCommand()) handleCommand(client, interaction, queue)
})


client.login(process.env.TOKEN)
