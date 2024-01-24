const {
  SlashCommandBuilder,
  EmbedBuilder,
  userMention,
  spoiler,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const { getUserAvatarUrl } = require("../../utils/getUserAvatarUrl");

const embeds = (user, choice, result) => {
  const avatar = getUserAvatarUrl(user.avatar, user.id);
  return new EmbedBuilder()
    .setAuthor({
      name: user.username,
      iconURL: avatar,
    })
    .setTitle("Lancei a moeda !")
    .setDescription(
      `${userMention(user.id)} escolheu ${choice} e... ${spoiler(result)}`
    )
    .setThumbnail(avatar);
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("cara-ou-coroa")
    .setDescription("Irei lançar uma moeda e retornar o resultado de seu lado")
    .addStringOption((option) =>
      option
        .setName("side")
        .setDescription("Selecione um lado da moeda")
        .addChoices(
          { name: "Cara", value: "cara" },
          { name: "Coroa", value: "coroa" }
        )
        .setRequired(true)
    ),

  async execute(interaction) {
    const side = interaction.options.getString("side");

    const getAOption = () => {
      const options = ["cara", "coroa"];

      const result =
        options[Math.floor(Math.random() * options.length - 1 + 1)];

      if (side === result) {
        return "venceu !";
      } else {
        return "perdeu !";
      }
    };

    return await interaction.reply({
      embeds: [embeds(interaction.user, side, getAOption())],
    });
  },
};
