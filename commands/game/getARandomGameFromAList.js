const {
  SlashCommandBuilder,
  EmbedBuilder,
  hyperlink,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
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

async function getARandomGame(list) {
  if (list) {
    const { data, error } = await supabase
      .from("gameLists")
      .select()
      .eq("id", list);
    if (data !== null || data.length) {
      const gameList = data[0];
      const random = Math.floor(Math.random() * gameList.games.length);
      const game = gameList.games[random];
      return {
        title: game.title,
        description: game.description,
        image: game.image,
        url: game.url,
      };
    }
  }
  const { data, error } = await supabase
    .from("gameLists")
    .select("games")
    .eq("");

  if (data !== null || data.length) {
    const gameList = data[0];
    const random = Math.floor(Math.random() * gameList.games.length);
    const game = gameList.games[random];
    return {
      title: game.title,
      description: game.description,
      image: game.image,
      url: game.url,
    };
  }
}

const embeds = (user, gameTitle, gameUrl, gameDescription, gameThumbnail) => {
  return new EmbedBuilder()
    .setTitle(`O que acha de jogar ${gameTitle} ?`)
    .setColor("Purple")
    .setTimestamp(new Date().getTime())
    .setAuthor({
      name: user.username,
      iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
    })
    .setDescription(gameDescription ? gameDescription : null)
    .setFooter(gameUrl ? hyperlink(gameUrl) : null)
    .setImage(gameThumbnail ? gameThumbnail : null);
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jogo-aleatorio")
    .setDescription("Irá retornar um jogo aleatório de uma lista selecionada")
    .addBooleanOption((option) =>
      option
        .setName("lista-aleatoria")
        .setDescription("Irá retornar um jogo de qualquer uma de suas listas")
    ),

  async execute(interaction) {
    const random = interaction.options.getBoolean("aleatoria");
    if (random === true) {
      const randomGame = await getARandomGame();
      return await interaction.reply({
        embeds: [
          embeds(
            interaction.user,
            randomGame.title,
            randomGame.url,
            randomGame.image
          ),
        ],
      });
    }
    const options = await getUserGameLists(interaction.user.id);
    const select = new StringSelectMenuBuilder()
      .setCustomId("list")
      .setPlaceholder(`Selecione uma lista para buscar um jogo a partir dela`)
      .addOptions(...options);

    const row = new ActionRowBuilder().addComponents(select);

    const response = await interaction.reply({
      content: "Selecione uma lista",
      components: [row],
    });

    try {
      const option = await response.awaitMessageComponent();

      const game = await getARandomGame(option.values[0]);
      return await option.reply({
        embeds: [embeds(interaction.user, game.title, game.url, game.image)],
      });
    } catch (err) {
      return await interaction.reply("Something wrong just happened");
    }
  },
};
