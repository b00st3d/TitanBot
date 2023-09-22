//directory of user commands
module.exports.createPoll = require('./User/poll.js').createPoll; //user, thumb, question
module.exports.addPollReactions = require('./User/poll.js').addReactions; //message
module.exports.rules = require('./User/rules.js').rulesEmbed; //message, cmd2, guild
module.exports.userStats = require('./User/stat.js').userStats; //message, cmd2, guild
module.exports.serverStats = require('./User/stat.js').serverStats; //guild
module.exports.help = require('./User/help.js').helpEmbed; 

module.exports.delete = require('./Admin/delete.js').del; //interaction, channel, number
module.exports.logger = require('./Admin/logger.js').logger; //guild, title, message
module.exports.userRoles = require('./Admin/userRoles.js').userRoles;
module.exports.ipStats = require('./User/ipStat.js').ipStats;
module.exports.storeNewUser = require('../Functions/userData.js').storeNewUser;
module.exports.deleteUser = require('../Functions/userData.js').deleteUser;
module.exports.checkUsers = require('../Functions/userData.js').checkUsers;

