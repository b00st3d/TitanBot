//const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, RoleSelectMenuBuilder } = require('discord.js');
const { timestamp } = require('../../timestamp.js');
const cmd = require('../Commands.js');

module.exports.command = async function slash(interaction){
    const member = interaction.member;
    const client = interaction.client;
    const guild  = interaction.guild;
    const options = interaction.options;
    const id = interaction.customId;
    const value = interaction.values[0];

    switch(id){
        case 'selectMenu':
            await interaction.update({ //there's nothing to update but slash commands need it.
                content: "Select a role",
                ephemeral: true
            })
            interaction.channel.send(value).then(msg => {
                setTimeout(() => msg.delete(), 500)
            });
        break;

        case 'roleMenu':
            
    }
}