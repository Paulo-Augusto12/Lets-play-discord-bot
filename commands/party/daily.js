const {
  SlashCommandBuilder,
  EmbedBuilder,
  userMention,
  time,
} = require("discord.js");
const { getUserAvatarUrl } = require("../../utils/getUserAvatarUrl");
const { supabase } = require("../../server/server");

async function getUserLastDaily(userId) {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", userId);
  if (error) {
    console.error(error);
    throw new Error(error);
  }

  if (data) {
    return data[0].last_daily;
  }
}

async function registerNewUserDaily(userId, daily) {
  const user = await supabase.from("users").select().eq("id", userId);
  if (user.data) {
    const { data, error } = await supabase
      .from("users")
      .update({ last_daily: daily, play_points: user.data[0].play_points + 20 })
      .eq("id", userId)
      .select();
    if (error) {
      console.error(error);
      throw new Error(error);
    }
    return data[0];
  }
}

function newDailyRegisteredEmbed(user, client, playPoints) {
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
  const today = new Date(Date.now());
  return new EmbedBuilder()
    .setAuthor({
      name: user.username,
      iconURL: getUserAvatarUrl(user.avatar, user.id),
    })
    .setColor("Purple")
    .setDescription(
      `${userMention(user.id)} o comando daily foi registrado com sucesso. Sua recompensa diária já foi recebida`
    )
    .setTitle("Recompensa diária resgatada com sucesso")
    .setThumbnail(getUserAvatarUrl(client.user.avatar, client.user.id))
    .setFooter({
      text: "Utilize os play points para fazer apostas no servidor. Ganhe mais play points através de apostas ou de outras atividades",
    })
    .setTimestamp(Date.now())
    .addFields(
      {
        name: "Recompensa registrada em",
        value: time(today),
        inline: true,
      },
      {
        name: "Proxima recompensa em",
        value: time(tomorrow),
        inline: true,
      },
      {
        name: "Atualmente você tem",
        value: `${playPoints} play points`,
      }
    );
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Resgate a sua recompensa diária de atividade no servidor"),
  async execute(interaction) {
    const user = interaction.user;
    const lastUserDaily = await getUserLastDaily(user.id);
    if (lastUserDaily !== null) {
      const milissecondsDiference = Date.now() - new Date(lastUserDaily);
      const differenceInDays = milissecondsDiference / (1000 * 60 * 60 * 24);
      if (differenceInDays > 1) {
        const regiteredData = await registerNewUserDaily(
          user.id,
          new Date(Date.now())
        );
        return await interaction.reply({
          embeds: [
            newDailyRegisteredEmbed(
              interaction.user,
              interaction.client,
              regiteredData.play_points
            ),
          ],
        });
      } else {
        const dayInMilisseconds = 86400000;
        const nextAvailableDaily =
          new Date(lastUserDaily).getTime() + dayInMilisseconds;
        return await interaction.reply(
          `${userMention(user.id)} a sua Recompensa diária já foi resgatada ! utilize novamente este comando em ${time(new Date(nextAvailableDaily))}`
        );
      }
    } else {
      const regiteredData = await registerNewUserDaily(
        user.id,
        new Date(Date.now())
      );
      return await interaction.reply({
        embeds: [
          newDailyRegisteredEmbed(
            interaction.user,
            interaction.client,
            regiteredData.play_points
          ),
        ],
      });
    }
  },
};
