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
    .setTitle(`I think you should play ${title}`)
    .setDescription(description)
    .setThumbnail(image)
    .setURL(link)
    .setImage(image)
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("free-random-game")
    .setDescription("I will return a free and totally random game"),

  async execute(interaction) {
    const game = await getARandomGame();

    await interaction.reply({
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
