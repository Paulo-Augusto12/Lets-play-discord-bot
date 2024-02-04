const {
  SlashCommandBuilder,
  EmbedBuilder,
  codeBlock,
  inlineCode,
} = require("discord.js");

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

const gameEmbed = (title, description, link, image, requirements) => {
  return new EmbedBuilder()
    .setColor("Purple")
    .setTitle(`Eu acho que você deveria jogar ${title}`)
    .setDescription(description)
    .setThumbnail(image)
    .setURL(link)
    .setImage(image)
    .addFields({
      name: "Requisitos mínimos",
      value: `Confira os requisitos mínimos para jogar ${title}`,
    })
    .addFields({ name: "Sistema:", value: inlineCode(requirements.os) })
    .addFields({
      name: "Processador:",
      value: inlineCode(requirements.processor),
    })
    .addFields({ name: "Memória:", value: inlineCode(requirements.memory) })
    .addFields({
      name: "Armazenamento:",
      value: inlineCode(requirements.storage),
    })
    .addFields({
      name: "Placa de vídeo",
      value: inlineCode(requirements.graphics),
    });
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jogo-aleatorio-gratuito")
    .setDescription(
      "Irá retornar um jogo totalmente aleatório e gratuito para jogar"
    ),

  async execute(interaction) {
    const game = await getARandomGame();

    return await interaction.reply({
      embeds: [
        gameEmbed(
          game.title,
          game.short_description,
          game.game_url,
          game.thumbnail,
          game.minimum_system_requirements
        ),
      ],
    });
  },
};
