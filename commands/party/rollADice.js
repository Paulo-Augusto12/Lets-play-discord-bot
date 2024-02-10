const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const embeds = (user, dice, result) => {
  return new EmbedBuilder()
    .setTitle(`${user.username} rolou um dado de ${dice} lados`)
    .setThumbnail(
      `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    )
    .setDescription(`🎲 O resultado do dado foi ${result}`)
    .setColor("Purple")
    .addFields(
      { name: "Mínimo", value: "1", inline: true },
      { name: "Maximo", value: `${dice}`, inline: true },
      { name: "Resultado", value: `${result}`, inline: true }
    )
    .setTimestamp(new Date().getTime());
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll-dice")
    .setDescription("Faça uma rolagem de um dado")
    .addNumberOption((option) =>
      option
        .setName("lados")
        .setRequired(true)
        .setDescription("A quantidade de lados do dado")
    ),

  async execute(interaction) {
    const dice = interaction.options.getNumber("lados");
    const rollDice = () => {
      const min = Math.ceil(1)
      const max = Math.ceil(dice)
      return Math.floor(Math.random() * (max - min) + min);
    };
    return await interaction.reply({
      embeds: [embeds(interaction.user, `${dice}`, rollDice())],
    });
  },
};
