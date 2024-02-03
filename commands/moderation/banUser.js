const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  userMention,
} = require("discord.js");
const { getUserAvatarUrl } = require("../../utils/getUserAvatarUrl");

function banUserCommand() {
  return new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Escolha um usuário para ser banido")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Selecione um usuário")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Adicione uma razão para o banimento deste usuário")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false);
}

function banUserEmbed(author, bannedUser, server, reason) {
  return new EmbedBuilder()
    .setTitle(
      `O usuário ${userMention(bannedUser.id)} será banido do servidor ${server.name}`
    )
    .addFields({
      name: "Motivo do banimento",
      value: reason ?? "Motivo não informado.",
    })
    .setThumbnail(getUserAvatarUrl(bannedUser.avatar, bannedUser.id))
    .setAuthor({
      name: author.username,
      iconURL: getUserAvatarUrl(author.avatar, author.id),
    })
    .setTimestamp(Date.now())
    .setColor("Purple");
}

module.exports = {
  data: banUserCommand(),
  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");
    const confirm = new ButtonBuilder()
      .setCustomId("confirm")
      .setLabel("Confirmar")
      .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Cancelar")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(confirm, cancel);

    const response = await interaction.reply({
      content: `Tem certeza que deseja banir o usuário  ${userMention(target.id)} ${reason ? `Pelo motivo: ${reason}` : "Você não está adicionando nenhum motivo para este banimento. Poderá continuar com esta ação mesmo assim, porém isto não é recomendado"}`,
      components: [row],
    });

    const collectorFilter = (i) => i.user.id === interaction.user.id;

    try {
      const userBanConfirmation = await response.awaitMessageComponent({
        filter: collectorFilter,
        time: 60_000,
      });

      if (userBanConfirmation.customId === "confirm") {
        await userBanConfirmation.update({
          embeds: [
            banUserEmbed(interaction.user, target, interaction.guild, reason),
          ],
          components:[]
        });
        await interaction.guild.members.ban(target)
      } else {
        return await userBanConfirmation.reply(
          `A ação de banimento do usuário ${target.username} foi cancelada.`
        );
      }
    } catch (err) {
      await interaction.editReply({
        content:
          "Não foi informada uma ação para ser executada. Cancelando banimento",
      });
    }
  },
};
