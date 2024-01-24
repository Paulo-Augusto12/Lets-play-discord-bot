const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getUserAvatarUrl } = require("../../utils/getUserAvatarUrl");

const embeds = (user, latency) => {
  new EmbedBuilder()
    .setTitle("Latência")
    .setAuthor({
      name: user.username,
      iconURL: getUserAvatarUrl(user.avatar, user.id),
    })
    .addFields({ name: "Latência", value: `${latency}ms` });
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("confere a latência do bot"),
  async execute(interaction) {
    const latency = Date.now() - interaction.createdTimestamp;
    await interaction.reply({ embeds: [embeds(interaction.user, latency)] });
  },
};
