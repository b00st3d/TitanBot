const { EmbedBuilder } = require('discord.js');
const vars = require('../../../config/config.json');

module.exports.rulesEmbed = function rulesEmbed(){//build the embed for displaying rules
    const rulesEmbed = new EmbedBuilder()
        .setColor(vars.embedColor)
        .setThumbnail(vars.NRicon)
        .setTitle("__Tech Titans__\n\n We are a vibrant and dynamic Discord community dedicated to all things programming and technology.\n\n__Tech Titan Rules__")
        .setDescription("\n\n\
        1. Be respectful and polite; this means tolerating other users, treating them with respect, not posting discriminatory or inflammatory content, and not spamming channels.\n\n\
	2. The Moderation and Admin team have the final say in any moderation decision. If you do not approve, voice your feedback.\n\n\
	3. Do not discuss anything illegal or blackhat, send malware, post anything NSFW, or break Discord ToS https://discord.com/terms.\n\n\
	4. Chatter about your personal life is not prohibited ex: religion, sex life, etc., but should be kept to a minimum. Let it not be the primary reason you're a member of the server.\n\n\
	5. Always keep personal information to yourself or share at your own risk. Tech titans, nor discord are responsible for information you provide.");
    return(rulesEmbed);
}
