const { Events } = require('discord.js');
const { timestamp } = require('../src/timestamp')

module.exports = {
    name: Events.GuildMemberRemove,
    execute(member) {
        //console.log(message);
        console.log(`${timestamp()} - server: ${member.guild.name} - ${member.displayName} has left ${member.guild.name}.`)
    }        
};