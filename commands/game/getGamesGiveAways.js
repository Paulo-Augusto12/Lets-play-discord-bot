const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require("discord.js");
const { getUserAvatarUrl } = require("../../utils/getUserAvatarUrl");

async function getGiveaway(store) {
  const giveaway = await fetch(
    `https://www.gamerpower.com/api/giveaways?platform=${store}&type=game&sort-by=popularity`
  ).then((result) => result.json());

  if (!Array.isArray(giveaway)) {
    return "Não há giveaways ativos no momento para a plataforma ou loja selecionada. tente novamente mais tarde";
  }
  return giveaway[0];
}

const embeds = (
  title,
  description,
  image,
  link,
  thumbnail,
  user,
  instructions
) => {
  return new EmbedBuilder()
    .setTitle(title)
    .setImage(image)
    .setColor("Purple")
    .setDescription(description)
    .setURL(link)
    .setThumbnail(thumbnail)
    .setAuthor({
      name: user.username,
      iconURL: getUserAvatarUrl(user.avatar, user.id),
    })
    .addFields({name: 'Como conseguir este jogo ?',value: codeBlock("html", instructions)});
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaways")
    .setDescription(
      "Vai retornar um giveaway a partir de uma store ou plataforma selecionada"
    )
    .addStringOption((option) =>
      option
        .setName("store")
        .setDescription(
          "Selecione uma opção para ver o melhor giveaway dela atualmente"
        )
        .setRequired(true)
        .addChoices(
          { name: "Epic Games", value: "epic-games-store" },
          { name: "Steam", value: "steam" },
          { name: "Ubisoft", value: "ubisoft" },
          { name: "Itch.io", value: "itchio" },
          { name: "Android", value: "android" },
          { name: "Ios", value: "ios" },
          { name: "Pc", value: "pc" }
        )
    ),

  async execute(interaction) {
    const store = interaction.options.getString("store");
    const giveaway = await getGiveaway(store);

    if (typeof giveaway === "string") {
      return await interaction.reply(giveaway);
    }

    await interaction.reply({
      embeds: [
        embeds(
          giveaway.title,
          giveaway.description,
          giveaway.image,
          giveaway.open_giveaway,
          giveaway.thumbnail,
          interaction.user,
          giveaway.instructions
        ),
      ],
    });
  },
};
