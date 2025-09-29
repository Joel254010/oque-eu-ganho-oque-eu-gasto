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

export const INCOME_TYPES = [
  'Salário',
  'Horas Extras',
  'Renda Extra',
  'Comissões',
  'Outros'
];

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
  
  // 👨‍👩‍👧‍👦 Despesas Familiares
  'Escola / Faculdade',
  'Material Escolar',
  'Transporte Escolar',
  'Cursos Extras',
  'Creche / Babá',
  'Mesada dos Filhos',
  'Presentes para Familiares',
  
  // 🧾 Contas e Serviços
  'Cartão de Crédito',
  'Empréstimos / Financiamentos',
  'Parcelamentos',
  'Cheques',
  'Juros e Multas',
  'Seguros Diversos',
  'Assinaturas Online',
  
  // 🩺 Saúde e Bem-Estar
  'Plano de Saúde',
  'Farmácia / Medicamentos',
  'Consultas Médicas',
  'Exames',
  'Dentista',
  'Academia / Personal Trainer',
  'Terapias',
  'Ótica',
  
  // 👕 Roupas e Estilo
  'Roupas',
  'Calçados',
  'Acessórios',
  'Salão de Beleza / Barbearia',
  'Cosméticos / Perfumes',
  'Joias e Relógios',
  
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
  
  // 🐾 Animais de Estimação
  'Ração',
  'Pet Shop',
  'Veterinário',
  'Brinquedos para Pets',
  
  // 🎁 Compras e Outros
  'Eletrodomésticos',
  'Eletrônicos',
  'Móveis',
  'Decoração',
  'Papelaria',
  'Presentes',
  'Flores',
  
  // 💼 Obrigações e Impostos
  'INSS',
  'Imposto de Renda',
  'Taxas Governamentais',
  'Contribuições Sindicais',
  
  // 🔧 Outros Gastos Extras
  'Multas de Trânsito',
  'Gorjetas',
  'Doações / Contribuições Religiosas',
  'Serviços de Entrega / Correios',
  'Assinaturas de Revistas / Jornais',
  'Manutenção de Equipamentos',
  'Despesas Jurídicas / Advogados',
  'Outros'
];