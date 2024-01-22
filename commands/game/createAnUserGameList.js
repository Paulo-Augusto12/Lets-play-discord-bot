const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("criar-lista-de-jogos")
    .setDescription(
      "Crie uma lista de jogos !"
    )
    .addStringOption((option) =>
      option
        .setName("nome")
        .setDescription("Nome da lista")
    ),

  async execute(interaction) {},
};
