const { SlashCommandBuilder, ModalBuilder } = require("discord.js");

function eventsCommand() {
  return new SlashCommandBuilder()
    .setName("event")
    .setDescription("Envie um novo evento interessante para o servidor");
}

module.exports = {
  data: eventsCommand(),
  async execute(interaction) {
    const modal = ModalBuilder().setTitle("Novo evento");
    await interaction.reply({components: []});
  },
};
