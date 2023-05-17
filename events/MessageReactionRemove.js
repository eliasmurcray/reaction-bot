module.exports = {
  eventName: 'messageReactionRemove',
  async callback(reaction, user) {
    const userID = user.id;
		if(userID === '1072595131905081497') {
			return;
		}
		const data = require('../database/data.json');
		const message = data[reaction.message.guild.id][reaction.message.id];
    if(message === undefined) return;
    const emojiName = reaction._emoji.name;
    const role = reaction.message.guild.roles.cache.get(message[emojiName]);
    if (role === undefined) {
      console.log(`\x1b[1;33mWARNING\x1b[0m Nonexistent role at "${reaction.message.guild.id}/${reaction.message.id}/${emojiName}"`);
      return;
    }
    const member = reaction.message.guild.members.cache.get(userID);
    member.roles.remove(role);
    console.log(`Role '${role.name}' removed from '${user.tag}' in server '${reaction.message.guild.name}'.`);
  }
};