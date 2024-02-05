const {
  SlashCommandBuilder,
  EmbedBuilder,
  userMention,
  spoiler,
  codeBlock,
  inlineCode,
} = require("discord.js");
const { getUserAvatarUrl } = require("../../utils/getUserAvatarUrl");
const { supabase } = require("../../server/server");

async function getUserFromSupabase(userId) {
  const { data } = await supabase.from("users").select().eq("id", userId);
  if (data) {
    return data[0];
  }
}

async function registerDealValueInDatabase(userId, dealValue, action) {
  const user = await getUserFromSupabase(userId);

  const { error } = await supabase
    .from("users")
    .update({
      play_points:
        action === "increase"
          ? user.play_points + dealValue
          : user.play_points - dealValue,
    })
    .eq("id", userId);
}
const embeds = (user, choice, result, dealData) => {
  const avatar = getUserAvatarUrl(user.avatar, user.id);
  return new EmbedBuilder()
    .setAuthor({
      name: user.username,
      iconURL: avatar,
    })
    .setTitle("Lancei a moeda !")
    .setDescription(`${userMention(user.id)} escolheu ${choice} e... ${result}`)
    .addFields(
      {
        name: `Play points foram apostados nesse jogo !`,
        value: `Você apostou ${inlineCode(dealData.deal)} Play points`,
      },
      {
        name: `Você ${result}`,
        value: `E então foram ${result === "venceu" ? "adicionados" : "retirados"} ${inlineCode(dealData.deal)} play points na sua conta`,
      }
    )
    .setTimestamp(Date.now())
    .setThumbnail(avatar);
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("cara-ou-coroa")
    .setDescription("Irei lançar uma moeda e retornar o resultado de seu lado")
    .addStringOption((option) =>
      option
        .setName("side")
        .setDescription("Selecione um lado da moeda")
        .addChoices(
          { name: "Cara", value: "cara" },
          { name: "Coroa", value: "coroa" }
        )
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("aposta")
        .setDescription(
          "Insira uma quantidade de play points para apostar na moeda"
        )
    ),

  async execute(interaction) {
    const side = interaction.options.getString("side");
    const dealValue = interaction.options.getNumber("aposta");
    const databaseUser = await getUserFromSupabase(interaction.user.id);
    const userCannotMakeADeal = databaseUser.play_points < dealValue;

    if (userCannotMakeADeal) {
      return await interaction.reply(
        `${userMention(interaction.user.id)} você não tem a quantidade de play points inserida para apostar ! atualmente você tem ${codeBlock(databaseUser.play_points)}`
      );
    }
    const getAOption = async () => {
      const options = ["cara", "coroa"];

      const result =
        options[Math.floor(Math.random() * options.length - 1 + 1)];

      if (side === result) {
        await registerDealValueInDatabase(
          interaction.user.id,
          dealValue,
          "increase"
        );
        return "venceu";
      } else {
        await registerDealValueInDatabase(
          interaction.user.id,
          dealValue,
          "decrease"
        );
        return "perdeu";
      }
    };

    const gameResult = await getAOption();

    return await interaction.reply({
      embeds: [
        embeds(interaction.user, side, gameResult, {
          deal: dealValue,
          result: gameResult,
        }),
      ],
    });
  },
};
