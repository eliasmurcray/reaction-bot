const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('relisten')
		.setDescription('Reapplies event listeners to a message')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
			.addStringOption((option) => option
				.setName('messageid')
				.setDescription('ID of message you want to reimplement event listeners to')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const messageID = interaction.options.getString('messageid').trim();

		let message;
		try {
			message = await interaction.channel.messages.fetch(messageID);
		} catch(e) {
			return await interaction.editReply(`Message with ID "${messageID}" does not exist.`);
		}
		const content = message.content;

		const data = JSON.parse(fs.readFileSync('./database/data.json'));

		// Construct emojis dataset from content
		const emojis = {};
		const promises = [];
		content.split('\n')
			.forEach((line) => {
				promises.push(new Promise(async (resolve) => {
					if(line.startsWith('*') || line.length === 0) {
						return resolve();
					}
	
					const [ name, reactionDelimiter ] = line.split(' - ');
					const reactionID = reactionDelimiter.split(':')[2].split('>')[0];
	
					console.log(reactionID);
					await message.react(reactionID);
	
					emojis[name] = reactionID;

					resolve();
				}));
			});
		await Promise.all(promises);
		data.messages[messageID].emojis = emojis;

		fs.writeFileSync('./database/data.json', JSON.stringify(data, null, 4));

		await interaction.editReply(`Listeners successfully added to ${messageID}.`);
	}
};