const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("toss-a-coin")
    .setDescription("Will toss a coin and return heads or tails")
    .addStringOption((option) =>
      option
        .setName("side")
        .setDescription("Select a coin side")
        .addChoices(
          { name: "Head", value: "head" },
          { name: "Tails", value: "tails" }
        )
    ),

  async execute(interaction) {
    const side = interaction.options.getString("side");

    const getAOption = () => {
      const options = ["head", "tails"];

      const result =
        options[Math.floor(Math.random() * options.length - 1 + 1)];

      if (side === result) {
        return "won !";
      } else {
        return "lost !";
      }
    };

    return await interaction.reply(
      `${interaction.user.username} chosed ${side} and ${getAOption()}`
    );
  },
};
