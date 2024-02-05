const {
  SlashCommandBuilder,
  userMention,
  roleMention,
  EmbedBuilder,
  inlineCode,
} = require("discord.js");
const { supabase } = require("../../server/server");
const { getUserAvatarUrl } = require("../../utils/getUserAvatarUrl");

async function getUserById(userId) {
  const { error, data } = await supabase
    .from("users")
    .select()
    .eq("id", userId);

  return { error, data };
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName("carteira")
    .setDescription("Confira o seu saldo de Play points"),
  async execute(interaction) {
    const user = interaction.user;
    const roles = await interaction.guild.roles.fetch();
    const serverRoles = roles.map((role) => {
      return { name: role.name, id: role.id };
    });
    const { data, error } = await getUserById(user.id);
    if (error) {
      const developerRole = serverRoles.filter(
        (role) => role.name === "developer"
      );
      return await interaction.reply(
        `${userMention(user.id)} houve um erro enquanto tentava obter seu saldo no banco de dados. Tente novamente mais tarde ou se possivel contate um ${roleMention(developerRole[0].id)}`
      );
    }

    const databaseUser = data[0];
    return await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: user.username,
            iconURL: getUserAvatarUrl(user.avatar, user.id),
          })
          .setTitle("Confira seu saldo de Play points")
          .setColor("Purple")
          .setTimestamp(Date.now())
          .setThumbnail(
            getUserAvatarUrl(
              interaction.client.user.avatar,
              interaction.client.user.id
            )
          )
          .setDescription(
            `${userMention(user.id)} você possui ${inlineCode(databaseUser.play_points)} Play points`
          ),
      ],
    });
  },
};
