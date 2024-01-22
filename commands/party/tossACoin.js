const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cara-ou-coroa")
    .setDescription("Irei lançar uma moeda e retornar o resultado de seu lado")
    .addStringOption((option) =>
      option
        .setName("side")
        .setDescription("Selecione um lado da moeda")
        .addChoices(
          { name: "Cara", value: "head" },
          { name: "Coroa", value: "tails" }
        )
        .setRequired(true)
    ),

  async execute(interaction) {
    const side = interaction.options.getString("side");

    const getAOption = () => {
      const options = ["head", "tails"];

      const result =
        options[Math.floor(Math.random() * options.length - 1 + 1)];

      if (side === result) {
        return "venceu !";
      } else {
        return "perdeu !";
      }
    };

    return await interaction.reply(
      `${interaction.user.username} escolheu ${side} e ${getAOption()}`
    );
  },
};
