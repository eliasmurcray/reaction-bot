const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const { token, clientId } = require('./secret.json');
const greetingCommand = require('./greeting.js');
const reactRoleCommand = require('./reactrole.js');

const commands = [
  greetingCommand,
  reactRoleCommand
];

// Refresh commands using REST API
async function refreshCommands(commands) {
  const request = new REST({ version: '10' }).setToken(token);
  await request.put(Routes.applicationCommands(clientId), {
      body: commands.map((command) => command.data.toJSON())
    })
  	.then(() => console.log('Successfully refreshed application commands.'))
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

client.login(token);