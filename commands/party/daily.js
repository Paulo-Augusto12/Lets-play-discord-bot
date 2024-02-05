const {
  SlashCommandBuilder,
  EmbedBuilder,
  userMention,
  time,
} = require("discord.js");
const { getUserAvatarUrl } = require("../../utils/getUserAvatarUrl");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Resgate a sua recompensa diária de atividade no servidor"),
  async execute(interaction) {
    const user = interaction.user;
    const actualDate = new Date(Date.now());
    const tomorrowDate = new Date(actualDate.setDate(actualDate.getDate() + 1));

    console.log(interaction.client.user);
    const embedMessage = new EmbedBuilder()
      .setAuthor({
        name: user.username,
        iconURL: getUserAvatarUrl(user.avatar, user.id),
      })
      .setColor("Purple")
      .setDescription(
        `${userMention(user.id)} o comando daily foi registrado com sucesso. Sua recompensa diária já foi recebida`
      )
      .setTitle("Recompensa diária resgatada com sucesso")
      .setThumbnail(
        getUserAvatarUrl(
          interaction.client.user.avatar,
          interaction.client.user.id
        )
      )
      .setTimestamp(Date.now())
      .addFields(
        {
          name: "Recompensa registrada em",
          value: time(actualDate),
          inline: true,
        },
        {
          name: "Proxima recompensa em",
          value: time(tomorrowDate),
          inline: true,
        }
      );

    return await interaction.reply({ embeds: [embedMessage] });
  },
};
