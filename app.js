const fs = require('node:fs');
const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const { token, clientId } = require('./secret.json');
const { execute } = require('./commands/reactrole');
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
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
  console.log('Ready! Logged in as ' + c.user.tag);
});

// Commands
client.commands = new Collection();
commands.forEach((command) => {
  client.commands.set(command.data.name, command);
});

// Events
client.on(Events.InteractionCreate, async interaction => {
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

client.on(Events.MessageReactionAdd, async (reaction, user) => {
	console.log(reaction, user);
	const data = JSON.parse(fs.readFileSync('./database/data.json'));
	const message = data.messages[reaction.message.id];
	console.log(message);
	if(message) {
		const emoji = reaction._emoji.name;
		console.log(emoji);
		if(message.emojis[emoji]) {
			const role = reaction.message.guild.roles.cache.get(message.emojis[emoji]);
			console.log(role);
			if (!role) return;
			const member = await reaction.message.guild.member.cache.get(user.id);
			console.log(member);
			member.roles.add(role);
			console.log(`Role '${role}' added to ${user.tag}.`);
		} else {
			reaction.remove();
		}
	}
});

client.login(token);