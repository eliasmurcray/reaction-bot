const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');

const slashCommand = new SlashCommandBuilder()
.setName('reactrole')
.setDescription('Creates a message which assigns roles based on reactions!')
.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
	.addRoleOption((option) => option
		.setName('role-1')
		.setDescription('Role number 1')
		.setRequired(true))
	.addStringOption((option) => option
		.setName('emoji-1')
		.setDescription('Emoji number 1')
		.setRequired(true));

for(let i = 2; i !== 10; i++) {
  slashCommand
		.addRoleOption((option) => option
			.setName(`role-${i}`)
			.setDescription(`Role number ${i}`))
		.addStringOption((option) => option
			.setName(`emoji-${i}`)
			.setDescription(`Emoji number ${i}`));
}

module.exports = {
  data: slashCommand,
	async execute(interaction) {
		const { options } = interaction;
		const roles = [];
		const reactions = [];
		let contentString = '**React To Get A Role**\n\n';
		for(let i = 1; i !== 10; i++) {
			let role = options.getRole('role-' + i);
			let reaction = options.getString('emoji-' + i);
			if(!(role?.name || reaction)) break;
			roles.push(role);
			reactions.push(reaction);
			contentString += `${role.name} - ${reaction}\n`;
		}

		const message = await interaction.reply({
			content: contentString,
			fetchReply: true
		});
		
		const data = JSON.parse(fs.readFileSync('./database/data.json'));
		const promises = [];

		for (let i = 0; i < roles.length; i++) {
			const role = roles[i];
			const reaction = reactions[i];

			promises.push(new Promise(async (resolve) => {
				await message.react(reaction);

				if(!data.messages[message.id])
					data.messages[message.id] = { emojis: { [reaction]: role.id } };
				else
					data.messages[message.id].emojis[reaction] = role.id;
				
				resolve();
			}));
		}

		await Promise.all(promises);
		fs.writeFileSync('./database/data.json', JSON.stringify(data, null, 4));
	}
};