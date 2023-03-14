const fs = require('node:fs');

module.exports = {
  eventName: 'messageReactionAdd',
  async callback(reaction, user) {
		const data = JSON.parse(fs.readFileSync('./database/data.json'));
		const message = data.messages[reaction.message.id];
		if(message) {
			const emoji = reaction._emoji.name;
			if(message.emojis[emoji]) {
				const role = reaction.message.guild.roles.cache.get(message.emojis[emoji]);
				if (!role) return;
				const member = await reaction.message.guild.members.cache.get(user.id);
				member.roles.add(role);
				console.log(`Role '${role.name}' added to ${user.tag}.`);
			} else {
				reaction.remove();
			}
		}
	}
};