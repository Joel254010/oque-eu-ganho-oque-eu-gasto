export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

/** 🟢 RECEITAS */
export const INCOME_TYPES = [
  'Salário',
  'Horas Extras',
  'Renda Extra',
  'Comissões',
  '13º Salário',
  'Férias',
  'Restituição do Imposto de Renda',
  'Aluguel Recebido',
  'Dividendos de Ações',
  'Rendimentos de Investimentos',
  'Juros sobre Poupança',
  'Cashback',
  'Venda de Produtos',
  'Freelas / Serviços',
  'Aposentadoria / Pensão',
  'Benefícios Governamentais (Auxílio, Bolsa Família)',
  'Prêmios / Loterias',
  'Reembolso de Empresa',
  'Venda de Bens',
  'Outros'
];

/** 🔴 DESPESAS */
export const EXPENSE_CATEGORIES = [
  // 🏠 Moradia
  'Aluguel',
  'Prestação da Casa / Financiamento Imobiliário',
  'Condomínio',
  'IPTU',
  'Luz / Energia Elétrica',
  'Água e Esgoto',
  'Gás Encanado / Botijão',
  'Internet Banda Larga',
  'Telefone Fixo',
  'TV a Cabo / Streaming',
  'Seguro Residencial',
  'Manutenção da Casa',
  'Compra de Móveis',
  'Reformas',

  // 🛒 Alimentação
  'Supermercado',
  'Açougue',
  'Padaria',
  'Feira Livre / Hortifruti',
  'Delivery (iFood, Rappi, etc.)',
  'Restaurantes',
  'Lanchonetes',
  'Cafeteria',
  'Sorveteria',
  'Fast Food',
  'Água Mineral / Galão',
  'Doces e Guloseimas',

  // 🚗 Transporte e Mobilidade
  'Abastecimento (Gasolina, Etanol, Diesel)',
  'Manutenção Veicular',
  'Estacionamento',
  'Pedágio',
  'Seguro do Carro',
  'Licenciamento / IPVA',
  'Transporte Público',
  'Táxi',
  'Aplicativos de Mobilidade (Uber, 99)',
  'Oficina Mecânica',
  'Lava-rápido',
  'Multas de Trânsito',
  'Lavagem Técnica',

  // 👨‍👩‍👧‍👦 Despesas Familiares
  'Escola / Faculdade',
  'Material Escolar',
  'Transporte Escolar',
  'Cursos Extras',
  'Creche / Babá',
  'Mesada dos Filhos',
  'Presentes para Familiares',
  'Mesada',
  'Atividades Extracurriculares',
  'Recreação Infantil',

  // 🧾 Contas e Serviços
  'Cartão de Crédito',
  'Empréstimos / Financiamentos',
  'Parcelamentos',
  'Cheques',
  'Juros e Multas',
  'Seguros Diversos',
  'Assinaturas Online',
  'Consultoria / Serviços Profissionais',
  'Mensalidades',

  // 🩺 Saúde e Bem-Estar
  'Plano de Saúde',
  'Farmácia / Medicamentos',
  'Consultas Médicas',
  'Exames',
  'Dentista',
  'Academia / Personal Trainer',
  'Terapias',
  'Ótica',
  'Psicólogo',
  'Suplementos',
  'Fisioterapia',

  // 👕 Roupas e Estilo
  'Roupas',
  'Calçados',
  'Acessórios',
  'Salão de Beleza / Barbearia',
  'Cosméticos / Perfumes',
  'Joias e Relógios',
  'Unhas / Manicure / Pedicure',
  'Maquiagem',

  // 🎉 Lazer e Entretenimento
  'Cinema',
  'Shows / Teatros',
  'Baladas',
  'Viagens / Passagens',
  'Hotéis / Pousadas',
  'Passeios em Família',
  'Parques / Zoológico / Museus',
  'Jogos Online / Videogame',
  'Eventos Esportivos',
  'Livros / HQs',
  'Streaming / Música',

  // 🐾 Animais de Estimação
  'Ração',
  'Pet Shop',
  'Veterinário',
  'Brinquedos para Pets',
  'Banho e Tosa',
  'Remédios para Pets',

  // 🛍️ Compras e Outros
  'Eletrodomésticos',
  'Eletrônicos',
  'Móveis',
  'Decoração',
  'Papelaria',
  'Presentes',
  'Flores',
  'Marketplace (Shopee, Amazon, etc.)',

  // 💼 Obrigações e Impostos
  'INSS',
  'Imposto de Renda',
  'Taxas Governamentais',
  'Contribuições Sindicais',
  'Taxas de Licenciamento',
  'Certidões / Documentações',

  // 🔧 Outros Gastos Extras
  'Gorjetas',
  'Doações / Contribuições Religiosas',
  'Serviços de Entrega / Correios',
  'Assinaturas de Revistas / Jornais',
  'Manutenção de Equipamentos',
  'Despesas Jurídicas / Advogados',
  'Mensalidade do Clube',
  'Cursos Online / Educação',
  'Outros'
];
