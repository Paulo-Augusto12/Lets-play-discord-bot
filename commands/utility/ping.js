const { SlashCommandBuilder, EmbedBuilder, blockQuote } = require("discord.js");
const { getUserAvatarUrl } = require("../../utils/getUserAvatarUrl");

const embeds = (user, latency) => {
  return new EmbedBuilder()
    .setTitle("Confira a minha latência para responder seus comandos")
    .setAuthor({
      name: user.username,
      iconURL: getUserAvatarUrl(user.avatar, user.id),
    })
    .setColor("Purple")
    .addFields({ name: "Latência ⏱️", value: ` ${blockQuote(latency)}ms` });
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("confere a latência do bot"),
  async execute(interaction) {
    const latency = Date.now() - interaction.createdTimestamp;
    console.log(interaction.createdTimestamp);
    await interaction.reply({ embeds: [embeds(interaction.user, latency)] });
  },
};
