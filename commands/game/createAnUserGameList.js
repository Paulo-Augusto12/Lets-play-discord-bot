const {
  SlashCommandBuilder,
  EmbedBuilder,
  inlineCode,
  hyperlink,
  bold,
} = require("discord.js");

const { supabase } = require("../../server/server");

async function checkIfListAlreadyExist(userId, listTitle) {
  const { data, error } = await supabase
    .from("gameLists")
    .select()
    .eq("userId", userId);

  if (data === null || !data.length) {
    return false;
  }

  if (!data.map((item) => item.title).includes(listTitle)) {
    return false;
  }

  return true;
}

async function addListToUser(title, userId) {
  if (await checkIfListAlreadyExist(userId, title)) {
    return "Uma lista com este nome já existe";
  }
  const { error } = await supabase
    .from("gameLists")
    .insert({ userId: userId, title: title });

  if (error !== null) {
    console.log(error);
    return "Algo de errado aconteceu enquanto sua lista estava sendo criada. Por favor tente novamente mais tarde";
  }

  return null;
}

const embeds = (user, listName) => {
  return new EmbedBuilder()
    .setColor("Purple")
    .setAuthor({
      name: user.username,
      iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
    })
    .setTitle(`A lista ${bold(listName)} foi criada com sucesso`)
    .setDescription(
      `Você pode adicionar jogos a lista utilizando o comando ${inlineCode("/adicionar-jogo")} ou pelo nosso ${hyperlink("site", "https://github.com/Paulo-Augusto12/random-game-bot")}`
    )
    .setTimestamp(new Date().getTime());
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("criar-lista-de-jogos")
    .setDescription("Crie uma lista de jogos !")
    .addStringOption((option) =>
      option.setName("nome").setDescription("Nome da lista").setRequired(true)
    ),

  async execute(interaction) {
    const list = interaction.options.getString("nome");

    const add = await addListToUser(list, interaction.user.id);

    if (add !== null) {
      return interaction.reply(add);
    }

    return await interaction.reply({
      embeds: [embeds(interaction.user, list)],
    });
  },
};
