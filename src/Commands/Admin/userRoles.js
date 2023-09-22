const { EmbedBuilder, ActionRowBuilder, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const vars = require('../../../config/config.json');
const { timestamp } = require('../../timestamp.js');
const cmd = require('../Commands.js');
const { stringify } = require('querystring');

module.exports.userRoles = userRoles;
module.exports.list = list;

async function userRoles(interaction, guild, options){
    const subCommand = options.getSubcommand()
    switch (subCommand){
        case "update":
            update(interaction, guild)
        break;
        case "list":
            list(interaction, guild)
        break;
        case "post":
            post(interaction, guild)
        default: await interaction.reply({content: "Invalid selection.  What did you do?", ephemeral: true });
    }
}

async function update(interaction, guild){ //add roles to user assignable roles list
    const roles = new RoleSelectMenuBuilder()
        .setCustomId('roleMenu')
        .setPlaceholder('Select Roles')
        .setMinValues(0)
        .setMaxValues(25)
    const confirmButton = new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Confirm')
        .setStyle(ButtonStyle.Secondary)
    const cancelButton = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger)
    const menuRow = new ActionRowBuilder()
        .addComponents(roles)
    const buttonRow = new ActionRowBuilder()
        .addComponents(cancelButton, confirmButton)

    var response = await interaction.deferReply({
        content: "Please select all roles you would like to be user assignable",
        components: [menuRow],
        ephemeral: true
    })
    try {
        var selectedRoles = await response.awaitMessageComponent({ time: 60*1000 });
        console.log(selectedRoles)
        var responseConfirm = await response.update({
            content: `selected roles: ${selectedRoles.values.map(r => `${guild.roles.cache.get(r)}`).join('\n')}`, 
            components: [buttonRow]
        })
        try{
            var buttonClick = await responseConfirm.awaitMessageComponent({ time: 30*1000 });
            console.log(response)
            //console.log(buttonClick)
            if (buttonClick.customId == 'confirm'){
                const object = JSON.stringify({
                guildID: guild.id,
                roles: selectedRoles.values
                })
                writeFile(object, guild.id, interaction)
            } else interaction.editReply({
                content: "Request canceled", 
                components: []})
        } catch (e){
                interaction.editReply({
                    content: "Request timed out", 
                    components: []})//button response
            }
    } catch (e){
        interaction.editReply({
            content: "Data not recieved in a timely manner.", 
            components: []})//menu response
    }
}


async function list(interaction, guild){ //list user assignable roles list
    
}

async function post(interaction, guild){ //post Rolelist to current channel

}

function writeFile(jsonObj, guildID, interaction){
    const filename = path.resolve(__dirname,'../../../data/userRoles.json')
    let jsonStr = fs.readFileSync(filename); //read in the json data
    let obj = JSON.parse(jsonStr).guilds; //parsed the json string for reading.
    let newObj = JSON.parse(jsonObj); //parsed the user input to json data
    let found = false;
    for (let i=0;i<obj.length;i++){ //if the guild is already in the file, then update
        if(guildID == obj[i].guildID){
            found = true;
            console.log(newObj.roles)
            obj[i].roles = newObj.roles
            console.log(obj[i])
        }
    }
    if (!found){ //guild wasn't found in the json data
        obj.push(newObj)
    }
    console.log(obj)


    try{
        //fs.writeFileSync(filename, jsonObj)
    } catch(e){
        console.log(e)
    }
    
}