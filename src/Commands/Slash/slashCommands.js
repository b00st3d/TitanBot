const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, RoleSelectMenuBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { timestamp } = require('../../timestamp.js');
const cmd = require('../Commands.js');

module.exports.command = async function slash(interaction){
    console.log(`==========\nSlash Command: ${interaction.commandName} \nMember: ${interaction.member.displayName}`)
    const member = interaction.member;
    const client = interaction.client;
    const guild  = interaction.guild;
    const options = interaction.options;
    var priv = options.getString('private');
    if (priv == "" || priv == 'no'){
        priv = false;
    } else {
        priv = true;
    }
    switch(interaction.commandName){
        case "test":
            //test commands here
        break;

        case "ip":
            const ip = options.getString('ip');
            console.log(`Submitted Text: ${ip}`)
            const ipstatEmbed = await cmd.ipStats(ip);
            await interaction.reply({
                embeds: [ipstatEmbed],
                ephemeral: priv
            });
            

        break;
//Rules
		case "rules": 
        try {
            await interaction.reply({
                embeds: [cmd.rules()], 
                ephemeral: priv
            })
        } catch (error) {
            cmd.logger(guild, "Error", `Rules embed failed to send: ${error}`);
            console.error(`${timestamp()} - server: ${guild.name} - Rules embed failed to send: ${error}`);
        }
		break;
//help
        case "help":
            await interaction.reply({ embeds: [cmd.help()], ephemeral: priv})
        break;
//Poll
		case "poll": 
            try {
                const user = interaction.user.username;
                const thumb = interaction.user.thumbnail;
                const question = options.getString('question');
                console.log(`Submitted Text: ${question}`)
                if(question){
                    const msg = await interaction.reply({
                    embeds: [cmd.createPoll(user,thumb,question)], fetchReply: true
                });
		        cmd.addPollReactions(msg)
                } else {
                    await interaction.reply({content: "I recieved an empty string.  Why you hackin?", ephemeral: true})
                    console.log(`${timestamp()} - server: ${guild.name} - Empty string recieved from ${user}.`)
                }
                
            } catch (error) {
                cmd.logger(guild, "Error", `Poll embed failed to send: ${error}`)
                console.error(`${timestamp()} - server: ${guild.name} - Poll embed failed to send: ${error}`)
            }
		break;
//Stat
        case "stats":
            const sub = options.getSubcommand();
            const user = options.getUser('target');
            console.log(`Submitted Text: ${user}`)
            try {
                switch(sub){
                    case 'server':
                        let serverEmbed = await cmd.serverStats(guild); //so apparently it takes time to build embeds.  Needs await.
                        await interaction.reply({
                            embeds: [serverEmbed], ephemeral: priv
                        })
                    break;
                    case 'user':
                        let userEmbed = await cmd.userStats(user, guild)
                        await interaction.reply({
                            embeds: [userEmbed], ephemeral: priv
                        })
                    break;
                    default: await interaction.reply({content: "Invalid selection.  What did you do?", ephemeral: true })
                break;
                }
            } catch (error) {
                cmd.logger(guild, "Error", `Stats embed failed to send: ${error}`)
                console.error(`${timestamp()} - server: ${guild.name} - Stats embed failed to send: ${error}`)
            }
        break;
//////////////ADMIN COMMANDS//////////////
//Parrot
        case "parrot": 
            var message = options.getString('string');
            var chan = options.getChannel('channel');
            var channel;
            console.log(`Submitted Text: ${message}`)
            if (isAdmin(member)){
                try {
                    if (chan && chan.type == 0){//check if the channel was sent in the message and is a text channel.
                        channel = chan
                    } else channel = client.channels.cache.get(interaction.channel.id) //channel sent from
                    if (channel){ //check if the channel is valid
                        if(message){ //check if the message exists
                            channel.send(message)
                            await interaction.reply({content:`Your message has been sent to channel: ${channel.name}.`,ephemeral: true})//succesful respond
                            cmd.logger(guild, "Admin Command Usage", `Parrot was used by ${interaction.user} to send the message: "${message}" in channel: ${guild.channels.cache.get(channel.id)}`)
                            console.log(`${timestamp()} - server: ${guild.name} - Parrot was used by ${interaction.user.username} to send the message: "${message}" in channel: ${guild.channels.cache.get(channel.id).name}`);
                        } else {
                            await interaction.reply({content:'I recieved an empty string.  Why you hackin?', ephemeral: true})
                            console.log(`${timestamp()} - server: ${guild.name} - Empty string recieved from ${interaction.user.username}. Server: ${guild.name}`)
                        }
                    } else {
                        await interaction.reply({content:`${chan} is an invalid channel.  Please check your spelling.`,ephemeral: true})//failed respond
                    } 
                } catch (error) {
                    console.error(`${timestamp()} - server: ${guild.name} - Parrot message failed to send: ${error}`)
                    cmd.logger(guild, "Error", `Parrot message failed to send: ${error}`)
                }          
            } else {
                cmd.logger(guild, "Admin command by non-admin user", `${interaction.user} attempted to send the parrot message: "${message}" in channel: ${interaction.channel}`)
                await interaction.reply({content: "You must be staff to use this command", ephemeral: true});//Shouldn't see this since it will be blocked at server level..           
            }    
        break;
//Delete
        case "delete":
            let delChannel = client.channels.cache.get(interaction.channel.id)//run in the channel command is run from.
            let delNumber = options.getNumber('number')
            
            if (isAdmin(member)){
                try {
                    let delMessage = await cmd.delete(interaction, delChannel, delNumber)
                    await interaction.reply({content: delMessage, ephemeral: true})
                    cmd.logger(guild, "Bulk Delete", delMessage);
                } catch (error) {
                    console.error(`${timestamp()} - server: ${guild.name} - Bulk Delete failed: ${error}`)
                    cmd.logger(guild, "Error", `Bulk Delete failed: ${error}`)
                }
            } else {
                cmd.logger(guild, "Admin command by non-admin user", `${interaction.user} attempted to delete ${delNumber} messages from ${delChannel}`)
                console.log(`${timestamp()} - server: ${guild.name} - Admin command by non-admin user - ${interaction.user.username} attempted to delete ${delNumber} messages from ${delChannel} in ${guild.name}`)
                await interaction.reply({content: "You must be staff to use this command.  This action has been logged.", ephemeral: true});//Shouldn't see this since it will be blocked at server level..   
            }
        break;
//rolelist
        case "rolelist":
            if (isAdmin(member)){
                cmd.userRoles(interaction, guild, options)
            } else {
                cmd.logger(guild, "Admin command by non-admin user", `${interaction.user} attempted to delete ${delNumber} messages from ${delChannel}`)
                console.log(`${timestamp()} - server: ${guild.name} - Admin command by non-admin user - ${interaction.user.username} attempted to delete ${delNumber} messages from ${delChannel} in ${guild.name}`)
                await interaction.reply({content: "You must be staff to use this command", ephemeral: true});//Shouldn't see this since it will be blocked at server level..)
            }
	}
}

function isAdmin(member){ //checks if user is staff
	if (member.roles.cache.find(r => r.name === "Admin" || r.name === 'Moderator')){
		return true 
	} return false 
}
