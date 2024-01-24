const { SlashCommandBuilder, userMention, inlineCode } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Vou limpar parte da bagunça que fiz neste canal")
    .addNumberOption((option) =>
      option
        .setName("qtde")
        .setDescription("Quantas mensagens quer que eu exclua")
        .setMaxValue(100)
        .setMinValue(1)
        .setRequired(true)
    ),
  async execute(interaction) {
    const channel = interaction.channel;
    const qtde = interaction.options.getNumber("qtde");
    const messages = await channel.messages.fetch({
      before: interaction.id,
      limit: qtde,
    });

    messages.forEach(async (message) => {
      await message.delete();
    });

    interaction.reply(
      `${userMention(interaction.user.id)} serão deletadas ${inlineCode(qtde)} mensagens que enviei neste canal !`
    );
  },
};
