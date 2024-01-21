const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

async function getGiveaway(store) {
  const giveaway = await fetch(
    `https://www.gamerpower.com/api/giveaways?platform=${store}&type=game&sort-by=popularity`
  ).then((result) => result.json());
  
  if(!Array.isArray(giveaway)) {
    return 'No active giveaways available at the moment, please try again later.'
  }
  return giveaway[0];
}

const embeds = (title, description, image, link, thumbnail) => {
  return new EmbedBuilder()
    .setTitle(title)
    .setImage(image)
    .setColor("Purple")
    .setDescription(description)
    .setURL(link)
    .setThumbnail(thumbnail);
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("game-giveaways")
    .setDescription("I will return a game giveaway from a selected store")
    .addStringOption((option) =>
      option
        .setName("store")
        .setDescription("Select a store to see the better actual giveaway")
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

    if(typeof giveaway === 'string') {
     return await interaction.reply(giveaway)
    }
    
    await interaction.reply({
      embeds: [
        embeds(
          giveaway.title,
          giveaway.description,
          giveaway.image,
          giveaway.open_giveaway,
          giveaway.thumbnail
        ),
      ],
    });
  },
};
