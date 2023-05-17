const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guildid')
		.setDescription('Prints the guild ID.'),
	async execute(interaction) {
		await interaction.reply(interaction.guild.id);
	}
};