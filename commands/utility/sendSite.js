const { SlashCommandBuilder, hyperlink, userMention } = require("discord.js");
const { execute } = require("./ping");
const { isDevelopment, jwtSecret } = require("../../config.json");
const { supabase } = require("../../server/server");
const jwt = require("jsonwebtoken");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("site")
    .setDescription(
      "Confira o site do bot para obter mais informações e funcionalidades"
    ),

  async execute(interaction) {
    const token = jwt.sign({ id: interaction.user.id }, jwtSecret, {
      expiresIn: 300,
    });
    await supabase
      .from("users")
      .update({ jwt_token: token })
      .eq("id", interaction.user.id);
    const url = isDevelopment
      ? `http://localhost:5173?userId=${interaction.user.id}&token=${token}&username=${interaction.user.username}`
      : "";
    await interaction.reply(
      `${userMention(interaction.user.id)} clique ${hyperlink("aqui", url)} para ir ao nosso site para mais funcionalidades. Sua autenticação ao site já foi realizada !`
    );
  },
};
