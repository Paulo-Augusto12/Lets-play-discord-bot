const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getUserAvatarUrl } = require("../../utils/getUserAvatarUrl");

function getEventById(id) {
  switch (id) {
    case "cblol": {
      return {
        name: "CBLOL",
        link: "https://lolesports.com/standings/cblol-brazil",
        image:
          "https://static.lolesports.com/leagues/cblol-logo-symbol-offwhite.png",
        description: `Sobre o CBLOL: O Campeonato Brasileiro de League of Legends, conhecido como CBLOL, é a principal competição de League of Legends no Brasil. Organizado pela Riot Games, o CBLOL reúne as melhores equipes do país em uma emocionante disputa pela supremacia no cenário competitivo de LoL.

          A competição é realizada em duas etapas: o Campeonato Brasileiro de League of Legends (CBLOL) e o Circuito Desafiante. No CBLOL, as principais equipes do país competem em uma fase de pontos corridos, seguida por uma fase eliminatória que culmina na grande final. O vencedor do CBLOL garante sua vaga para representar o Brasil no Campeonato Mundial de League of Legends, enfrentando as melhores equipes de outros países.
          
          O CBLOL não apenas serve como uma plataforma para os jogadores demonstrarem suas habilidades individuais e táticas de equipe, mas também atrai uma grande base de fãs. As partidas são transmitidas ao vivo, e a comunidade de fãs se envolve ativamente, torcendo por suas equipes favoritas e acompanhando as reviravoltas emocionantes durante as partidas.
          
          Além da competição em si, o CBLOL contribui para o crescimento e desenvolvimento do cenário de esportes eletrônicos no Brasil, proporcionando oportunidades para novos talentos, criando ídolos e fortalecendo a presença do League of Legends na cultura gamer brasileira. O evento também serve como uma vitrine para patrocinadores e parceiros, consolidando o CBLOL como um dos principais eventos de esportes eletrônicos no país.`,
      };
    }
    case "cblolAcademy": {
      return {
        name: "CBLOL ACADEMY",
        link: "https://lolesports.com/schedule?leagues=cblol_academy",
        image:
          "https://liquipedia.net/commons/images/thumb/b/b3/CBLOL_Academy_darkmode.png/600px-CBLOL_Academy_darkmode.png",
        description: "Sobre o CBLOL Academy: O CBLOL Academy é um torneio de League of Legends (LoL) organizado pela Riot Games e funciona como uma espécie de segunda divisão do CBLOL. O evento conta com dois splits por ano e com a participação de seis equipes.",
      };
    }
    case "lck": {
      return {
        name: "LCK",
        link: "https://lolesports.com/standings/lck/",
        image: "https://static.lolesports.com/leagues/lck-color-on-black.png",
        description: `Sobre a LCK: A Liga Coreana de League of Legends, conhecida como LCK (League of Legends Champions Korea), é a principal competição de LoL na Coreia do Sul. Organizada pela Riot Games, a LCK é renomada mundialmente por reunir algumas das equipes mais talentosas e competitivas do cenário internacional.

        A LCK segue um formato semelhante ao CBLOL, dividindo-se em duas fases principais: a fase regular e os playoffs. Durante a fase regular, as equipes competem em uma série de partidas em um formato de pontos corridos para determinar sua classificação. As equipes mais bem colocadas avançam para os playoffs, onde disputam uma série de confrontos eliminatórios até a grande final.
        
        Os times que se destacam na LCK têm a oportunidade de representar a Coreia do Sul em competições internacionais, como o Campeonato Mundial de League of Legends. A região é conhecida por sua forte presença no cenário competitivo global, com várias conquistas de títulos mundiais por equipes coreanas.
        
        Além da competição em si, a LCK desempenha um papel crucial no desenvolvimento e na promoção de talentos. A liga é um viveiro para jogadores talentosos, e muitos atletas coreanos de destaque internacional começaram suas carreiras na LCK.
        
        A popularidade da LCK não se limita apenas à Coreia do Sul; ela atrai uma audiência global significativa, com transmissões ao vivo e cobertura extensiva nas redes sociais. A liga contribui substancialmente para a consolidação do League of Legends como um esporte eletrônico de destaque em escala mundial.`,
      };
    }
    case "vct": {
      return {
        name: "VCT",
        link: "https://valorantesports.com/schedule",
        image:
          "https://static.lolesports.com/leagues/1678994077551_VCT23_INT_AMERICAS_Logo_MARK_RGB_White.png",
        description: `Sobre o VCT: ${"Acreditamos que o VCT Américas será uma liga absurdamente competitiva, com equipes que não só desenvolveram elencos que podem competir com qualquer outro, mas que também contam com rivalidades intensas e criarão partidas imperdíveis semanalmente. Temos muita sorte de ter encontrado um forte grupo de equipes que representarão os fãs pela América do Norte, Brasil e América Latina. Essas organizações têm um histórico de sucesso dentro dos Esports e construíram marcas com bases de fãs muito fiéis. Dentro de cada região de origem, os fãs reconhecem essas equipes tanto pela história que elas escreveram quanto pela capacidade de ligar os Esports à cultura de jogos mais ampla."}`,
      };
    }
    case "lec": {
      return {
        name: "LEC",
        link: "https://lolesports.com/schedule?leagues=lec",
        image:
          "https://pbs.twimg.com/profile_images/1361268233303638018/gsm7Oee5_400x400.jpg",
        description: `Sobre a LEC A Liga Europeia de League of Legends, conhecida como LEC (League of Legends European Championship), é a principal competição de League of Legends na Europa. Organizada pela Riot Games, a LEC representa o mais alto nível de competição na região, reunindo algumas das equipes mais talentosas e competitivas do continente.

        O formato da LEC segue uma estrutura semelhante ao de outras ligas de elite, compreendendo uma fase regular e uma fase de playoffs. Durante a fase regular, as equipes competem em uma série de partidas, adotando o formato de pontos corridos para determinar sua classificação. As equipes de melhor desempenho avançam para os playoffs, onde disputam confrontos eliminatórios até a grande final.
        
        Os times que se destacam na LEC têm a oportunidade de representar a Europa em competições internacionais, notadamente no Campeonato Mundial de League of Legends. A região é reconhecida por sua competitividade e por ter produzido campeões mundiais em várias ocasiões.
        
        Além da importância competitiva, a LEC desempenha um papel crucial na promoção do cenário de esportes eletrônicos na Europa. A liga contribui para o desenvolvimento de talentos e cria uma base sólida para jogadores aspirantes. A popularidade da LEC se reflete na significativa audiência global, com transmissões ao vivo e engajamento da comunidade de fãs nas plataformas online.
        
        A presença de equipes e jogadores notáveis, bem como a qualidade de produção das transmissões, solidificam a LEC como uma das principais ligas de League of Legends no mundo, contribuindo para a expansão contínua do ecossistema competitivo do jogo.`,
      };
    }
  }
}
function sendEsportsLinkCommand() {
  return new SlashCommandBuilder()
    .setName("esports")
    .setDescription("Confira os sites dos principais eventos de esports")
    .addStringOption((option) =>
      option
        .setName("event")
        .setDescription("Escolha um evento de esports")
        .setRequired(true)
        .addChoices(
          {
            name: "CBLOL",
            value: "cblol",
          },
          {
            name: "CBLOL Academy",
            value: "cblolAcademy",
          },
          {
            name: "LCK",
            value: "lck",
          },
          {
            name: "VCT Americas",
            value: "vct",
          },
          {
            name: "LEC",
            value: "lec",
          }
        )
    );
}

module.exports = {
  data: sendEsportsLinkCommand(),
  async execute(interaction) {
    const user = interaction.user;
    const eventOption = interaction.options.getString("event");
    const event = getEventById(eventOption);
    const embeds = new EmbedBuilder()
      .setTitle(`Confira os dados sobre o ${event.name}`)
      .setColor("Purple")
      .setURL(event.link)
      .setDescription(event.description)
      .setThumbnail(event.image)
      .setAuthor({
        name: user.username,
        iconURL: getUserAvatarUrl(user.avatar, user.id),
      });
    await interaction.reply({ embeds: [embeds] });
  },
};
