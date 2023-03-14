module.exports = {
  eventName: 'messageReactionRemove',
  async callback(reaction, user) {
    const data = require('../database/data.json');
    const message = data.messages[reaction.message.id];
    if(message === undefined) return;
    const emoji = reaction._emoji.name;
    if(message.emojis[emoji] === undefined) return;
    const role = reaction.message.guild.roles.cache.get(message.emojis[emoji]);
    if (role === undefined) return;
    const userRef = reaction.message.guild.members.cache.get(user.id);
    userRef.roles.remove(role);
    console.log(`Role '${role.name}' removed from ${user.tag}.`);
  }
};