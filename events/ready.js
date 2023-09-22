const { Events, 
        ActivityType 
    } = require('discord.js');
const { timestamp } = require('../src/timestamp.js')
const { guildInvites } = require('../bot.js');
const { checkUsers } = require('../src/Functions/userData.js')

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setActivity("/help || Tech Titans", { type: ActivityType.Watching }); //Watching !ttHelp || Tech Titans
        console.log(`${timestamp()} Logged in as ${client.user.username} - Client activity set to '${client.user.presence.activities[0].name}'`);
        
        client.guilds.cache.forEach(guild => {
            guild.invites.fetch()
                .then(invites => {
                    console.log("Invites Cached");
                    const codeUses = new Map();
                    invites.each(inv => codeUses.set(inv.code, inv.uses))
                    guildInvites.set(guild.id, codeUses);
                })
        })
        checkUsers(client)
    }
};