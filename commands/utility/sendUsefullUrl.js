const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder().setName('goat').setDescription('O melhor do mundo'),
  async execute(interaction) {
    await interaction.reply('https://www.youtube.com/watch?v=ISw99SZk6xU')
  }
}


//tava vendo o ping como base, achei q eu ia ter q escrever mais coigo