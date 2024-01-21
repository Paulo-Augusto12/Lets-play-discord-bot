const { SlashCommandBuilder } = require("discord.js");

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

    return await interaction.reply(
      `🎲 ${
        interaction.user.username
      } Rolled a ${dice.toUpperCase()} and the result was ${rollDice()}`
    );
  },
};
