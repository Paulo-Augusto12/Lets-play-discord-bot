const { SlashCommandBuilder, userMention, inlineCode } = require("discord.js");
const { clientId } = require("../../config.json");

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
    )
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription(
          "Selecione apenas um usuário para que suas mensagens sejam deletadas"
        )
    ),
  async execute(interaction) {
    const channel = interaction.channel;
    const qtde = interaction.options.getNumber("qtde");
    const selectedUser = interaction.options.getUser("usuario");
    await channel.messages
      .fetch({
        before: interaction.id,
        limit: qtde,
      })
      .then((receivedMessages) => {
        receivedMessages.forEach((m) => {
          if (selectedUser !== null) {
            if (m.author.id === selectedUser.id) {
              m.delete();
            }
          } else {
            m.delete();
          }
        });
      });

    interaction
      .reply(
        `${userMention(interaction.user.id)} serão deletadas ${inlineCode(qtde)} mensagens enviadas neste canal !`
      )
      .then((response) =>
        setTimeout(() => {
          response.delete();
        }, 3000)
      );
  },
};
