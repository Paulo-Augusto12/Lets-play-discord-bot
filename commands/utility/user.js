const {
  SlashCommandBuilder,
  EmbedBuilder,
  userMention,
  time
} = require("discord.js");
const { getUserAvatarUrl } = require("../../utils/getUserAvatarUrl");

const embeds = (user, guild, joinedAt) => {
  return new EmbedBuilder()
    .setAuthor({
      name: user.username,
      iconURL: getUserAvatarUrl(user.avatar, user.id),
    })
    .setColor("Purple")
    .setImage(
      user.banner
        ? `https://cdn.discordapp.com/${user.id}/${user.banner}.png`
        : getUserAvatarUrl(user.avatar, user.id)
    )
    .setThumbnail(getUserAvatarUrl(user.avatar, user.id))
    .setTimestamp(new Date().getTime())
    .setDescription(`Confira um pouco sobre o usuário ${userMention(user.id)}`)
    .addFields(
      { name: "menção", value: userMention(user.id), inline: true }
    ).addFields({ name: "Entrou neste canal em", value: time(new Date(joinedAt)) });
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Will retur information about the user"),

  async execute(interaction) {
    console.log(interaction.member.roles);
    await interaction.reply({
      embeds: [
        embeds(
          interaction.user,
          interaction.guild,
          interaction.member.joinedTimestamp
        ),
      ],
    });
  },
};
