const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

async function getARandomGame() {
  const game = await fetch(
    `https://www.freetogame.com/api/game?id=${Math.floor(
      Math.random() * 500 - 1 + 1
    )}`
  )
    .then((result) => result.json())
    .catch((err) => {
      console.log(err);
    });

  return game;
}

const gameEmbed = (title, description, link, image) => {
  return new EmbedBuilder()
    .setColor("Purple")
    .setTitle(`Eu acho que você deveria jogar ${title}`)
    .setDescription(description)
    .setThumbnail(image)
    .setURL(link)
    .setImage(image)
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jogo-aleatorio-gratuito")
    .setDescription("Irá retornar um jgo totalmente aleatório e gratuito para jogar"),

  async execute(interaction) {
    const game = await getARandomGame();

    return await interaction.reply({
      embeds: [
        gameEmbed(
          game.title,
          game.short_description,
          game.game_url,
          game.thumbnail
        ),
      ],
    });
  },
};
