const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
		.setName('reactrole')
		.setDescription('Says hello!'),
	async execute(interaction) {
		await interaction.reply('Hello!');
	}
};