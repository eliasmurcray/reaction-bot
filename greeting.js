const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('greeting')
		.setDescription('Says hello!'),
	async execute(interaction) {
		await interaction.reply('Hello!');
	}
};