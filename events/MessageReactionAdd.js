const fs = require('node:fs');

module.exports = {
  eventName: 'messageReactionAdd',
  async callback(reaction, user) {
		const userID = user.id;
		if(userID === '1072595131905081497') {
			return;
		}
		const data = require('../database/data.json');
		const message = data[reaction.message.guild.id][reaction.message.id];
		if(message !== undefined) {
			const emojiName = reaction._emoji.name;
			if(message[emojiName] !== undefined) {
				const role = reaction.message.guild.roles.cache.get(message[emojiName]);
				if (role === undefined) {
					console.log(`\x1b[1;33mWARNING\x1b[0m Nonexistent role at "${reaction.message.guild.id}/${reaction.message.id}/${emojiName}"`);
					return;
				}
				const member = await reaction.message.guild.members.cache.get(userID);
				member.roles.add(role);
				console.log(`Role '${role.name}' added to '${user.tag}' in server '${reaction.message.guild.name}'.`);
			} else {
				reaction.remove();
			}
		}
	}
};