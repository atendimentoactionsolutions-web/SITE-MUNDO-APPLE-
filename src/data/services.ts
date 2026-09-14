import { TechnicalService } from "@/types/service";

export const technicalServices: TechnicalService[] = [
  {
    id: "troca-tela",
    title: "Troca de Tela & Display",
    category: "display",
    description: "Substituição completa de telas quebradas ou touch danificado com componentes de alta fidelidade de cor e True Tone.",
    estimatedTime: "30 a 60 minutos",
    warranty: "90 dias de garantia",
    featuredHome: true,
    priceStartingFrom: 190,
    iconName: "Smartphone"
  },
  {
    id: "troca-bateria",
    title: "Substituição de Bateria",
    category: "battery",
    description: "Devolva a autonomia original ao seu iPhone, iPad ou MacBook com baterias novas de alta capacidade e saúde 100%.",
    estimatedTime: "30 minutos",
    warranty: "90 dias de garantia",
    featuredHome: true,
    priceStartingFrom: 150,
    iconName: "BatteryCharging"
  },
  {
    id: "reparo-placa",
    title: "Reparo Avançado de Placa",
    category: "board",
    description: "Solução para aparelhos que não ligam, não carregam ou apresentam problemas de áudio (Codec), GPU, alimentação ou curto-circuito interno.",
    estimatedTime: "1 a 3 dias úteis",
    warranty: "180 dias de garantia",
    featuredHome: true,
    priceStartingFrom: 350,
    iconName: "Cpu"
  },
  {
    id: "cameras",
    title: "Câmeras e Lentes",
    category: "camera",
    description: "Reparo de tremores, falhas de foco, lente trincada ou substituição do módulo de câmera traseira/frontal.",
    estimatedTime: "45 minutos",
    warranty: "90 dias de garantia",
    featuredHome: true,
    priceStartingFrom: 200,
    iconName: "Camera"
  },
  {
    id: "tampa-traseira",
    title: "Troca da Tampa Traseira a Laser",
    category: "glass",
    description: "Remoção do vidro traseiro quebrado via tecnologia laser de alta precisão sem danificar os componentes internos do iPhone.",
    estimatedTime: "2 a 4 horas",
    warranty: "90 dias de garantia",
    featuredHome: false,
    priceStartingFrom: 250,
    iconName: "Shield"
  },
  {
    id: "conector-carga",
    title: "Conector de Carga (Lightning / USB-C)",
    category: "connector",
    description: "Conserto de conector com mau contato, sujeira acumulada, não reconhecido pelo carregador ou danos físicos.",
    estimatedTime: "40 minutos",
    warranty: "90 dias de garantia",
    featuredHome: false,
    priceStartingFrom: 160,
    iconName: "Zap"
  },
  {
    id: "diagnostico",
    title: "Diagnóstico Preventivo & Limpeza",
    category: "diagnostic",
    description: "Análise completa de hardware, desoxidação preventiva e limpeza interna para prolongar a vida útil do seu aparelho.",
    estimatedTime: "Imediato",
    warranty: "Cortesia técnica",
    featuredHome: false,
    priceStartingFrom: 0,
    iconName: "Search"
  },
  {
    id: "outros-reparos",
    title: "Outros Reparos & Ajustes Especializados",
    category: "other",
    description: "Troca de alto-falantes, microfones, botões laterais, gaveta de chip, problemas de Wi-Fi/Bluetooth e Face ID.",
    estimatedTime: "Sob avaliação",
    warranty: "90 dias de garantia",
    featuredHome: false,
    iconName: "Wrench"
  }
];
