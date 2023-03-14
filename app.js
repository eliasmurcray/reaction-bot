const fs = require('node:fs');
const { Client, Events, Partials, Collection, REST, IntentsBitField, Routes } = require('discord.js');
const { token, clientId } = require('./secret.json');

const eventFiles = fs.readdirSync('events');

const commandFiles = fs.readdirSync('commands');
const commands = [];
commandFiles.forEach((file) => {
	let command = require('./commands/' + file);
	commands.push(command);
});

// Refresh commands using REST API
async function refreshCommands(commands) {
  const request = new REST({ version: '10' }).setToken(token);
  return await request.put(Routes.applicationCommands(clientId), {
      body: commands.map((command) => command.data.toJSON())
    })
  	.then(() => console.log('Success! Application commands refreshed'))
  	.catch(console.error);
}
refreshCommands(commands);

// Initialize bot
const client = new Client({
	intents: new IntentsBitField(3276799),
	partials: [Partials.Message, Partials.Reaction]
});

client.once(Events.ClientReady, (bot) => {
  console.log('Ready! Logged in as ' + bot.user.tag);

	bot.on(Events.InteractionCreate, async interaction => {
		if (!interaction.isChatInputCommand()) return;
	
		const command = client.commands.get(interaction.commandName);
	
		if (!command) return;
	
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	});

	eventFiles.forEach((file) => {
		const contents = require('./events/' + file);
		bot.on(contents.eventName, contents.callback);
	});
});

// Commands
client.commands = new Collection();
commands.forEach((command) => {
  client.commands.set(command.data.name, command);
});

client.login(token);