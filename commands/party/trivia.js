const { default: axios } = require("axios");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  userMention,
  inlineCode,
} = require("discord.js");
const { getUserAvatarUrl } = require("../../utils/getUserAvatarUrl");
const { supabase } = require("../../server/server");

async function getQuestion() {
  try {
    const response = await axios.get(
      "https://opentdb.com/api.php?amount=1&category=15&type=multiple&encode=base64"
    );

    const data = response.data.results[0];
    return {
      description: atob(data.question),
      answers: [atob(...data.incorrect_answers), atob(data.correct_answer)],
      correctAnswer: atob(data.correct_answer),
    };
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

async function registerPlayPointsReward(userId, amount) {
  const { data } = await supabase.from("users").select().eq("id", userId);
  await supabase
    .from("users")
    .update({ play_points: data[0].play_points + amount })
    .eq("id", userId);
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription(
      "Participe em um jogo de perguntas e respostas sobre videogames. (Somente perguntas em inglês)"
    ),
  async execute(interaction) {
    try {
      const user = interaction.user;
      const question = await getQuestion();
      const buttons = question.answers.map((answer) =>
        new ButtonBuilder()
          .setLabel(answer)
          .setCustomId(answer)
          .setStyle(ButtonStyle.Primary)
      );
      const rows = new ActionRowBuilder().setComponents(...buttons);
      const response = await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Answer the following question")
            .setThumbnail(
              getUserAvatarUrl(
                interaction.client.user.avatar,
                interaction.client.user.id
              )
            )

            .setDescription(question.description)
            .setTimestamp(Date.now())
            .setColor("Purple"),
        ],
        components: [rows],
      });
      const collectorFilter = (i) => i.user.id === interaction.user.id;
      try {
        const userResponse = await response.awaitMessageComponent({
          filter: collectorFilter,
        });
        if (userResponse.customId === question.correctAnswer) {
          const randomAmount = Math.floor(Math.random() * 200 - 20 + 20);
          await registerPlayPointsReward(interaction.user.id, randomAmount);
          return await userResponse.update({
            embeds: [
              new EmbedBuilder()
                .setTitle("Resposta correta")
                .setDescription(
                  `Parabéns ${userMention(user.id)} você acertou na sua resposta`
                )
                .setThumbnail(
                  getUserAvatarUrl(
                    interaction.client.user.avatar,
                    interaction.client.user.id
                  )
                )
                .setAuthor({
                  name: user.username,
                  iconURL: getUserAvatarUrl(user.avatar, user.id),
                })
                .addFields(
                  { name: "Pergunta", value: question.description },
                  {
                    name: "Resposta correta",
                    value: inlineCode(question.correctAnswer),
                    inline: true,
                  },
                  {
                    name: "Play points ganhos",
                    value: inlineCode(randomAmount),
                    inline: true,
                  }
                )
                .setTimestamp(Date.now()),
            ],
            components: [],
          });
        } else {
          return await userResponse.update({
            embeds: [
              new EmbedBuilder()
                .setTitle("Resposta incorreta")
                .setThumbnail(
                  getUserAvatarUrl(
                    interaction.client.user.avatar,
                    interaction.client.user.id
                  )
                )
                .setDescription(
                  `Sinto muito ${userMention(user.id)} sua resposta está incorreta`
                )
                .setAuthor({
                  name: user.username,
                  iconURL: getUserAvatarUrl(user.avatar, user.id),
                })
                .addFields(
                  { name: "Pergunta", value: question.description },
                  {
                    name: "Resposta correta",
                    value: inlineCode(question.correctAnswer),
                    inline: true,
                  },
                  {
                    name: "Sua resposta",
                    value: inlineCode(userResponse.customId),
                    inline: true,
                  }
                )
                .setTimestamp(Date.now()),
            ],
            components: [],
          });
        }
      } catch (err) {
        console.error(err);
        await interaction.editReply({
          content:
            "Houve um erro ao responder esta pergunta. Tente novamente mais tarde",
        });
      }
    } catch (err) {
      return await interaction.reply(
        "Houve um erro enquanto tentava obter uma pertgunta. Tente novamente mais tarde !"
      );
    }
  },
};
