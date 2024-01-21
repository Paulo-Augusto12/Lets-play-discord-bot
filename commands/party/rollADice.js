const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

function diceResultDescription(result) {
  if (result < 10) {
    return "This was a bad result 😢";
  }
  if (result >= 10 && result <= 15) {
    return "This was an average result 😌";
  }
  if (result >= 15) {
    return "This was an AWESOME result 😎";
  }
  if (result === 20) {
    return "THIS WAS AN SUPERB RESULT 💫💫";
  }
}
const embeds = (user, dice, result) => {
  return new EmbedBuilder()
    .setTitle(`${user.username} rolled a ${dice}`)
    .setThumbnail(
      `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    )
    .setDescription(`🎲 the dice result was ${result}`)
    .setColor("Purple")
    .setFooter({text: diceResultDescription(result)})
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll-dice")
    .setDescription("Will roll a dice")
    .addStringOption((option) =>
      option
        .setRequired(true)
        .setName("dice")
        .setDescription("Choose a dice")
        .addChoices(
          { name: "D6", value: "d6" },
          { name: "D12", value: "d12" },
          { name: "D20", value: "d20" }
        )
    ),

  async execute(interaction) {
    const dice = interaction.options.getString("dice");

    const rollDice = () => {
      switch (dice) {
        case "d6": {
          return Math.floor(Math.random() * 6 - 1 + 1);
        }
        case "d12": {
          return Math.floor(Math.random() * 12 - 1 + 1);
        }
        case "d20": {
          return Math.floor(Math.random() * 20 - 1 + 1);
        }
      }
    };

    // `🎲 ${
    //   interaction.user.username
    // } Rolled a ${dice.toUpperCase()} and the result was ${rollDice()}`
    return await interaction.reply({
      embeds: [embeds(interaction.user, dice.toUpperCase(), rollDice())],
    });
  },
};
