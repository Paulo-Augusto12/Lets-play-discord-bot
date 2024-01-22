const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  hyperlink,
} = require("discord.js");
const { supabase } = require("../../server/server");

async function getUserGameLists(userId) {
  const { data } = await supabase
    .from("gameLists")
    .select()
    .eq("userId", userId);

  if (data !== null && data.length) {
    return data.map((list) =>
      new StringSelectMenuOptionBuilder()
        .setLabel(list.title)
        .setDescription(
          list.description !== null
            ? list.description
            : "Nenhuma descrição informada"
        )
        .setValue(list.id)
    );
  } else {
    return [];
  }
}

async function addGameToTheList(list, game) {
  const { data } = await supabase.from("gameLists").select().eq("id", list);
  const gameJson = { title: game, image: "", description: "" };

  if (data !== null && data.length) {
    const { error } = await supabase
      .from("gameLists")
      .update({
        games:
          data[0].games !== null
            ? [...data[0].games, gameJson]
            : data[0].games.push(gameJson),
      })
      .eq("id", list);

    if (error) {
      // console.log(error);
    }
  }
}

const embeds = (gameTitle, user) => {
  return new EmbedBuilder()
    .setTitle(`O jogo ${gameTitle} foi adicionado a lista com sucesso`)
    .setAuthor({
      name: user.username,
      iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
    })
    .setDescription(
      `Para conferir suas listas e editar seu conteudo confira nosso ${hyperlink("site", "https://github.com")}`
    )
    .setTimestamp(new Date().getTime());
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("adicionar-jogo")
    .setDescription("Adicione um jogo a uma de suas listas")
    .addStringOption((option) =>
      option
        .setRequired(true)
        .setName("nome")
        .setDescription("O nome do jogo que você quer adicionar")
    ),

  async execute(interaction) {
    const options = await getUserGameLists(interaction.user.id);
    const gameTitle = interaction.options.getString("nome");

    const select = new StringSelectMenuBuilder()
      .setCustomId("list")
      .setPlaceholder(`Selecione uma lista para adicionar o jogo ${gameTitle}`)
      .addOptions(...options);

    const row = new ActionRowBuilder().addComponents(select);

    const response = await interaction.reply({
      content: "Selecione uma lista",
      components: [row],
    });

    try {
      const option = await response.awaitMessageComponent();

      await addGameToTheList(option.values[0], gameTitle);
      return await option.reply({
        embeds: [embeds(gameTitle, interaction.user)],
      });
    } catch (err) {
      // console.log(err, 'erro aqui')
      return await interaction.reply("Something wrong just happened");
    }
  },
};
