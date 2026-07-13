import type { Bi } from "./i18n";

/**
 * CONTEÚDO DO SITE — Rotary Club of Maputo Metro (Distrito 9400)
 *
 * Conteúdo real fornecido pelo clube (Julho 2026), organizado conforme o
 * "Plano de Conteúdo" aprovado. Itens pendentes estão marcados com PENDENTE.
 * Na Fase 3 estas estruturas migram para o Supabase e passam a ser geridas
 * pelo painel de administração.
 *
 * FOTOS:
 *  - /public/images/gallery/   → 1.º lote (49 fotos gerais do clube)
 *  - /public/images/events/    → 2.º lote (59 fotos classificadas por evento;
 *    ver _mapa-de-origem.txt — classificação provisória a validar pelo clube)
 */

// ---------- Identidade do clube ----------

export const club = {
  name: "Rotary Club of Maputo Metro",
  district: { pt: "Distrito 9400", en: "District 9400" },
  acronym: "RCMM",
  founded: 2023,
};

export type ClubInfo = typeof club;

// ---------- Textos da Home (confirmados pelo clube) ----------

export const home = {
  headline: {
    pt: "Pessoas de Ação, a Servir com Propósito",
    en: "People of Action, Serving with Purpose",
  },
  // 2 primeiras frases do texto de apoio (hero)
  lead: {
    pt: "O Rotary Club of Maputo Metro é um clube vibrante de líderes, profissionais e voluntários dedicados, unidos pelo compromisso de criar mudanças positivas e duradouras. Guiados pelo lema do Rotary, Service Above Self (Dar de Si Antes de Pensar em Si), desenhamos e apoiamos projetos sustentáveis que melhoram vidas, fortalecem comunidades e inspiram esperança.",
    en: "The Rotary Club of Maputo Metro is a vibrant club of dedicated leaders, professionals, and volunteers united by a shared commitment to creating lasting, positive change. Guided by Rotary's motto, Service Above Self, we design and support sustainable projects that improve lives, strengthen communities, and inspire hope.",
  },
  // Frases 3–4 do texto de apoio (secção de convite)
  invite: {
    pt: "Quer pretenda servir a sua comunidade, colaborar em projetos de impacto, ou apoiar a nossa missão através de parcerias ou doações, será muito bem-vindo(a). Juntos, podemos construir comunidades mais fortes, capacitar as gerações futuras e criar um amanhã melhor.",
    en: "Whether you are looking to serve your community, collaborate on impactful projects, or support our mission through partnership or donations, we welcome you to join us. Together, we can build stronger communities, empower future generations, and create a better tomorrow.",
  },
};

export type HomeContent = typeof home;

// PENDENTE: o clube sugeriu a foto das colunas "Rotary International" para o
// hero, mas o ficheiro em alta resolução ainda não foi recebido. Quando chegar:
// otimizar para /public/images/hero.jpg e trocar o caminho abaixo.
export const heroImage = "/images/gallery/photo-21.jpg";
export const missionImage = "/images/gallery/photo-02.jpg";

// ---------- Sobre Nós ----------

export const about = {
  mission: {
    pt: "Unir líderes e voluntários apaixonados ao serviço das nossas comunidades, através de projetos sustentáveis e de impacto que promovem a saúde, a educação, a paz, a proteção do ambiente e o desenvolvimento económico. Guiados pelos valores do Rotary — companheirismo, integridade, diversidade, serviço e liderança — estamos comprometidos em criar mudanças positivas duradouras e melhorar vidas em Maputo, em todo o Moçambique e além.",
    en: "To unite passionate leaders and volunteers in serving our communities through sustainable, impactful projects that promote health, education, peace, environmental stewardship, and economic development. Guided by Rotary's values of fellowship, integrity, diversity, service, and leadership, we are committed to creating lasting positive change and improving lives in Maputo, across Mozambique, and beyond.",
  },
  // O clube segue a visão, missão e valores da Rotary International
  riVision: {
    pt: "Juntos, vemos um mundo onde as pessoas se unem e agem para criar mudanças duradouras — no mundo, nas nossas comunidades e em nós mesmos.",
    en: "Together, we see a world where people unite and take action to create lasting change — across the globe, in our communities and in ourselves.",
  },
  riMission: {
    pt: "Servimos o próximo, promovemos a integridade e fomentamos a compreensão mundial, a boa vontade e a paz através da nossa rede de líderes empresariais, profissionais e comunitários.",
    en: "We provide service to others, promote integrity, and advance world understanding, goodwill and peace through our fellowship of business, professional and community leaders.",
  },
  values: [
    {
      title: { pt: "Serviço", en: "Service" },
      text: {
        pt: "Colocamos as necessidades dos outros acima das nossas.",
        en: "We put the needs of others above our own.",
      },
    },
    {
      title: { pt: "Integridade", en: "Integrity" },
      text: {
        pt: "Honramos os nossos compromissos.",
        en: "We honour our commitments.",
      },
    },
    {
      title: { pt: "Diversidade", en: "Diversity" },
      text: {
        pt: "Ligamos perspetivas diversas.",
        en: "We connect diverse perspectives.",
      },
    },
    {
      title: { pt: "Companheirismo", en: "Fellowship" },
      text: {
        pt: "Construímos relações para a vida.",
        en: "We build lifelong relationships.",
      },
    },
    {
      title: { pt: "Liderança", en: "Leadership" },
      text: {
        pt: "Inspiramos ação através do exemplo.",
        en: "We inspire action through example.",
      },
    },
  ],
};

export type AboutContent = typeof about;
export type AboutValue = AboutContent["values"][number];

// ---------- Direção 2026–2027 ----------

export type Leader = { name: string; role: Bi; photo?: string };

export const leaders: Leader[] = [
  {
    name: "Ken McGhee",
    role: { pt: "Presidente", en: "President" },
    photo: "/images/leaders/ken-mcghee.png",
  },
  {
    name: "Sisa Sibanda",
    role: { pt: "Secretária", en: "Secretary" },
    photo: "/images/leaders/sisa-sibanda.png",
  },
  {
    name: "Eleutéria Latifat Laguda",
    role: { pt: "Imagem Pública", en: "Public Image" },
    photo: "/images/leaders/eleuteria-laguda.png",
  },
  {
    name: "Yara Manhiça",
    role: { pt: "Fundação", en: "Foundation" },
    photo: "/images/leaders/yara-manhica.png",
  },
  {
    name: "Roque Sebastião",
    role: { pt: "Tesoureiro", en: "Treasurer" },
    photo: "/images/leaders/roque-sebastiao.png",
  },
  {
    name: "Vitalis Che Musong",
    role: { pt: "Serviços à Juventude", en: "Youth Service Chair" },
    photo: "/images/leaders/vitalis-musong.png",
  },
  {
    name: "Eddy Chivanga",
    role: { pt: "Quadro Associativo", en: "Membership Chair" },
    photo: "/images/leaders/eddy-chivanga.png",
  },
  {
    name: "Subho Roy",
    role: { pt: "Projetos", en: "Projects Chair" },
    photo: "/images/leaders/subho-roy.png",
  },
];

// ---------- Projetos ----------

export type Project = {
  id: string;
  title: Bi;
  summary: Bi;
  detail: Bi;
  category: string;
  categoryLabel: Bi;
  status: "active" | "completed";
  image: string;
  gallery?: string[];
  videoUrl?: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    id: "wash-khongolote",
    title: {
      pt: "Projeto WASH — Escola Básica de Khongolote",
      en: "WASH Project — Khongolote Basic School",
    },
    summary: {
      pt: "Furo de água, saneamento e educação em higiene para os alunos e a comunidade de Khongolote.",
      en: "Water borehole, sanitation and hygiene education for the learners and community of Khongolote.",
    },
    detail: {
      pt: "O Rotary Club of Maputo Metro está comprometido em melhorar a saúde e o bem-estar das crianças e das comunidades vizinhas através de iniciativas sustentáveis de Água, Saneamento e Higiene (WASH). Na Escola Básica de Khongolote, o nosso projeto incluiu a instalação de um furo de água para dar aos alunos acesso fiável a água potável, limpa e segura. Esta iniciativa é complementada por melhorias nas instalações sanitárias e por educação em higiene, dando às crianças os conhecimentos e as práticas necessárias para prevenir doenças e viver de forma mais saudável. O projeto visa melhorar a assiduidade escolar, valorizar o ambiente de aprendizagem e reforçar a saúde e a qualidade de vida das crianças e de toda a comunidade de Khongolote.",
      en: "The Rotary Club of Maputo Metro is committed to improving the health and well-being of children and surrounding communities through sustainable Water, Sanitation and Hygiene (WASH) initiatives. At Khongolote Basic School, our project included the installation of a water borehole to provide learners with reliable access to clean and safe drinking water. This initiative is complemented by improvements in sanitation facilities and hygiene education, equipping children with the knowledge and practices needed to prevent disease and lead healthier lives. This project aims to improve school attendance, enhance the learning environment, and strengthen the overall health and quality of life of both the children and the wider Khongolote community.",
    },
    category: "wash",
    categoryLabel: {
      pt: "Água, Saneamento e Higiene",
      en: "Water, Sanitation & Hygiene",
    },
    status: "completed",
    image: "/images/events/wash-khongolote/05.jpg",
    gallery: [
      "/images/events/wash-khongolote/01.jpg",
      "/images/events/wash-khongolote/02.jpg",
      "/images/events/wash-khongolote/03.jpg",
      "/images/events/wash-khongolote/04.jpg",
      "/images/events/wash-khongolote/05.jpg",
      "/images/events/wash-khongolote/06.jpg",
    ],
    videoUrl: "/images/events/wash-khongolote/video-01.mp4",
    featured: true,
  },
  // PENDENTE: o clube indicou que enviará fichas de outros projetos.
];

// ---------- Eventos (6 eventos reais — todos já realizados) ----------

export type ClubEvent = {
  id: string;
  day: string;
  month: Bi;
  year: string;
  title: Bi;
  info: Bi;
  status: "upcoming" | "past";
  gallery?: string[];
  videoUrl?: string;
  mapQuery?: string; // local do evento para o Google Maps
};

export const events: ClubEvent[] = [
  {
    id: "doacao-alimentos-2026",
    day: "25",
    month: { pt: "Abr", en: "Apr" },
    year: "2026",
    title: {
      pt: "Doação de Alimentos, Roupas e Cosméticos",
      en: "Food, Clothing & Cosmetics Donation",
    },
    info: {
      pt: "Dom Orione Maputo Centre — 10h00 às 13h00",
      en: "Dom Orione Maputo Centre — 10:00 AM to 1:00 PM",
    },
    status: "past",
    mapQuery: "Dom Orione, Avenida de Moçambique, Zimpeto, Maputo",
    gallery: [
      "/images/events/doacao-alimentos/02.jpg",
      "/images/events/doacao-alimentos/03.jpg",
      "/images/events/doacao-alimentos/04.jpg",
      "/images/events/doacao-alimentos/05.jpg",
      "/images/events/doacao-alimentos/06.jpg",
      "/images/events/doacao-alimentos/07.jpg",
      "/images/events/doacao-alimentos/08.jpg",
      "/images/events/doacao-alimentos/09.jpg",
      "/images/events/doacao-alimentos/10.jpg",
    ],
  },
  {
    id: "dia-da-crianca-2026",
    day: "01",
    month: { pt: "Jun", en: "Jun" },
    year: "2026", // PENDENTE: confirmar o ano do evento com o clube
    title: {
      pt: "Dia da Criança — “A Minha História Tem Cores”",
      en: "Children's Day — “My Story Has Colors”",
    },
    info: {
      pt: "Dom Orione, Avenida de Moçambique, Zimpeto, Maputo — 10h00. Pintura, palhaço, danças culturais, exposição de arte infantil e leilão solidário.",
      en: "Dom Orione, Avenida de Moçambique, Zimpeto, Maputo — 10:00 AM. Painting, clown entertainment, cultural dances, children's artwork exhibition and charity auction.",
    },
    status: "past",
    mapQuery: "Dom Orione, Avenida de Moçambique, Zimpeto, Maputo",
    gallery: [
      "/images/events/dia-da-crianca/0.jpg",
      "/images/events/dia-da-crianca/01.jpg",
      "/images/events/dia-da-crianca/02.jpg",
      "/images/events/dia-da-crianca/03.jpg",
      "/images/events/dia-da-crianca/04.jpg",
      "/images/events/dia-da-crianca/05.jpg",
      "/images/events/dia-da-crianca/06.jpg",
      "/images/events/dia-da-crianca/07.jpg",
      "/images/events/dia-da-crianca/08.jpg",
    ],
  },
  {
    id: "seeds-of-change-2025",
    day: "05",
    month: { pt: "Dez", en: "Dec" },
    year: "2025",
    title: {
      pt: "“Seeds of Change” — Exposição de Arte e Leilão Beneficente",
      en: "“Seeds of Change” — Art Exhibition & Charity Auction",
    },
    info: {
      pt: "Aga Khan Academy Maputo, Av. do Zimbabwe n.º 212, Matola “A” — 15h00. Parte da receita apoiou o Projeto Boane: uma biblioteca para a Escola Primária de Vunguine.",
      en: "Aga Khan Academy Maputo, Av. do Zimbabwe No. 212, Matola “A” — 3:00 PM. Part of the auction's earnings supported the Boane Project: a library for the Vunguine Primary School.",
    },
    status: "past",
    mapQuery: "Aga Khan Academy, Av. do Zimbabwe 212, Matola, Mozambique",
    gallery: [
      "/images/events/seeds-of-change/01.jpg",
      "/images/events/seeds-of-change/02.jpg",
      "/images/events/seeds-of-change/03.jpg",
      "/images/events/seeds-of-change/04.jpg",
      "/images/events/seeds-of-change/05.jpg",
      "/images/events/seeds-of-change/06.jpg",
      "/images/events/seeds-of-change/07.jpg",
      "/images/events/seeds-of-change/08.jpg",
      "/images/events/seeds-of-change/09.jpg",
      "/images/events/seeds-of-change/10.jpg",
      "/images/events/seeds-of-change/11.jpg",
      "/images/events/seeds-of-change/12.jpg",
      "/images/events/seeds-of-change/13.jpg",
      "/images/events/seeds-of-change/14.jpg",
      "/images/events/seeds-of-change/15.jpg",
      "/images/events/seeds-of-change/16.jpg",
      "/images/events/seeds-of-change/17.jpg",
    ],
  },
  {
    id: "doacao-ajudas-tecnicas-2025",
    day: "03",
    month: { pt: "Dez", en: "Dec" },
    year: "2025",
    title: {
      pt: "Doação de Ajudas Técnicas de Mobilidade",
      en: "Walking Aids Donation Event",
    },
    info: {
      pt: "Centro de Reabilitação da Malhangalene, Av. Milagre Mabote n.º 1102 — 9h00. Anfitriã: AMMD — Associação Moçambicana de Mulheres com Deficiência.",
      en: "Centro de Reabilitação da Malhangalene, Av. Milagre Mabote No. 1102 — 9:00 AM. Host: AMMD — Mozambican Association of Women with Disabilities.",
    },
    status: "past",
    mapQuery: "Centro de Reabilitação da Malhangalene, Av. Milagre Mabote 1102, Maputo",
    gallery: [
      "/images/events/doacao-ajudas-tecnicas/01.jpg",
      "/images/events/doacao-ajudas-tecnicas/02.jpg",
      "/images/events/doacao-ajudas-tecnicas/03.jpg",
      "/images/events/doacao-ajudas-tecnicas/04.jpg",
      "/images/events/doacao-ajudas-tecnicas/05.jpg",
      "/images/events/doacao-ajudas-tecnicas/06.jpg",
    ],
  },
  {
    id: "doacao-sangue-2025",
    day: "08",
    month: { pt: "Mar", en: "Mar" },
    year: "2025",
    title: {
      pt: "Campanha de Doação de Sangue",
      en: "Blood Donation Event",
    },
    info: {
      pt: "Clínica Universitária da UEM, Maputo — 8h00 às 15h00. Em parceria com o Rotaract Clube da Polana (D9400), o Serviço Nacional de Sangue e outros parceiros.",
      en: "Clínica Universitária da UEM, Maputo — 8:00 AM to 3:00 PM. In partnership with Rotaract Clube da Polana (D9400), the National Blood Service and other partners.",
    },
    status: "past",
    mapQuery: "Clínica Universitária UEM, Maputo",
    gallery: [
      "/images/events/doacao-sangue/01.jpg",
      "/images/events/doacao-sangue/02.jpg",
      "/images/events/doacao-sangue/03.jpg",
      "/images/events/doacao-sangue/04.jpg",
      "/images/events/doacao-sangue/05.jpg",
      "/images/events/doacao-sangue/06.jpg",
      "/images/events/doacao-sangue/07.jpg",
      "/images/events/doacao-sangue/08.jpg",
      "/images/events/doacao-sangue/09.jpg",
      "/images/events/doacao-sangue/10.jpeg",
    ],
  },
  {
    id: "end-polio-now-2024",
    day: "24",
    month: { pt: "Out", en: "Oct" },
    year: "2024",
    title: {
      pt: "Campanha End Polio Now — Dia Mundial de Combate à Pólio",
      en: "End Polio Now Campaign — World Polio Day",
    },
    info: {
      pt: "Maputo — atividade de dia inteiro. A participação do clube foi destaque em reportagem televisiva.",
      en: "Maputo — all-day activity. The club's participation was featured in national TV coverage.",
    },
    status: "past",
    mapQuery: "Maputo, Mozambique",
    gallery: [
      "/images/events/end-polio-now/01.jpg",
      "/images/events/end-polio-now/02.jpg",
      "/images/events/end-polio-now/03.jpg",
    ],
    videoUrl: "/images/events/end-polio-now/video-01.mp4",
  },
  // PENDENTE: eventos futuros — quando o clube indicar o próximo evento,
  // adicionar aqui com status "upcoming" (aparece no filtro "Próximos" e na Home).
];

// ---------- Contactos do clube ----------

export const clubContacts = {
  email: "", // PENDENTE: email oficial do clube
  phone: "", // PENDENTE: telefone oficial
  meetings: {
    pt: "Todas as terças-feiras — reunião online e reuniões presenciais no Southern Sun Stay Easy Hotel, Baía Mall, Maputo.",
    en: "Every Tuesday — online meeting and in-person meetings at Southern Sun Stay Easy Hotel, Baía Mall, Maputo.",
  },
  social: {
    facebook: "https://www.facebook.com/rcmaputometro/", // página "Rotary Club of Maputo Metro - RCMM"
    linkedin: "#", // PENDENTE: link direto — página "Rotary Club Maputo Metro"
    instagram: "https://www.instagram.com/rc_maputometro/",
  },
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=StayEasy+Maputo,+Av.+da+Marginal,+Maputo",
};

export type ClubContactsData = typeof clubContacts;

// ---------- Galeria ----------

export type GalleryItem = {
  id: string;
  url: string;
  mediaType: "image" | "video";
  caption: Bi;
  tag?: string;
  width?: number;
  height?: number;
};

export type GalleryStyle = "grid" | "masonry" | "justified" | "carousel" | "slideshow";

export type GallerySettingsData = {
  style: GalleryStyle;
  fullscreen: boolean;
};

// ---------- Notícias ----------

export type NewsArticle = {
  id: string;
  title: Bi;
  excerpt: Bi;
  body: Bi;
  author: string;
  publishedAt: string;
  coverImage?: GalleryItem;
};
