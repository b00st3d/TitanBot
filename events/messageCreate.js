const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        if (message.content.substring(0,3)=="!tt"){ //check if the message is a techTitan command
            if (message.content.substring(3,7) == "test"){
                console.log(message.content)
            }
        }
    }        
}