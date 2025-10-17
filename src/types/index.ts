import { t } from "i18next";

/** ================================
 *  🧩 TIPAGENS GERAIS
 * ================================= */
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "income" | "expense";
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

/** ================================
 *  🟢 RECEITAS (INCOME)
 * ================================= */
export const INCOME_TYPES = [
  t("salary") || "Salário",
  t("extraHours") || "Horas Extras",
  t("extraIncome") || "Renda Extra",
  t("commissions") || "Comissões",
  t("13salary") || "13º Salário",
  t("vacation") || "Férias",
  t("taxRefund") || "Restituição do Imposto de Renda",
  t("rentReceived") || "Aluguel Recebido",
  t("dividends") || "Dividendos de Ações",
  t("investmentReturns") || "Rendimentos de Investimentos",
  t("savingsInterest") || "Juros sobre Poupança",
  t("cashback") || "Cashback",
  t("productSales") || "Venda de Produtos",
  t("freelance") || "Freelas / Serviços",
  t("pension") || "Aposentadoria / Pensão",
  t("governmentBenefits") || "Benefícios Governamentais (Auxílio, Bolsa Família)",
  t("prizes") || "Prêmios / Loterias",
  t("reimbursement") || "Reembolso de Empresa",
  t("assetSales") || "Venda de Bens",
  t("other") || "Outros",
];

/** ================================
 *  🔴 DESPESAS (EXPENSES)
 * ================================= */
export const EXPENSE_CATEGORIES = [
  // 🏠 Moradia
  t("rent") || "Aluguel",
  t("mortgage") || "Prestação da Casa / Financiamento Imobiliário",
  t("condominium") || "Condomínio",
  t("propertyTax") || "IPTU",
  t("electricity") || "Luz / Energia Elétrica",
  t("water") || "Água e Esgoto",
  t("gas") || "Gás Encanado / Botijão",
  t("internet") || "Internet Banda Larga",
  t("landline") || "Telefone Fixo",
  t("tv") || "TV a Cabo / Streaming",
  t("homeInsurance") || "Seguro Residencial",
  t("homeMaintenance") || "Manutenção da Casa",
  t("furniturePurchase") || "Compra de Móveis",
  t("homeRenovations") || "Reformas",

  // 🛒 Alimentação
  t("supermarket") || "Supermercado",
  t("butcher") || "Açougue",
  t("bakery") || "Padaria",
  t("market") || "Feira Livre / Hortifruti",
  t("delivery") || "Delivery (iFood, Rappi, etc.)",
  t("restaurants") || "Restaurantes",
  t("snackBars") || "Lanchonetes",
  t("coffeeShop") || "Cafeteria",
  t("iceCream") || "Sorveteria",
  t("fastFood") || "Fast Food",
  t("bottledWater") || "Água Mineral / Galão",
  t("sweets") || "Doces e Guloseimas",

  // 🚗 Transporte e Mobilidade
  t("fuel") || "Abastecimento (Gasolina, Etanol, Diesel)",
  t("vehicleMaintenance") || "Manutenção Veicular",
  t("parking") || "Estacionamento",
  t("toll") || "Pedágio",
  t("carInsurance") || "Seguro do Carro",
  t("vehicleTax") || "Licenciamento / IPVA",
  t("publicTransport") || "Transporte Público",
  t("taxi") || "Táxi",
  t("mobilityApps") || "Aplicativos de Mobilidade (Uber, 99)",
  t("mechanic") || "Oficina Mecânica",
  t("carWash") || "Lava-rápido",
  t("trafficFines") || "Multas de Trânsito",
  t("technicalWash") || "Lavagem Técnica",

  // 👨‍👩‍👧‍👦 Despesas Familiares
  t("school") || "Escola / Faculdade",
  t("schoolSupplies") || "Material Escolar",
  t("schoolTransport") || "Transporte Escolar",
  t("extraCourses") || "Cursos Extras",
  t("daycare") || "Creche / Babá",
  t("allowance") || "Mesada dos Filhos",
  t("familyGifts") || "Presentes para Familiares",
  t("extracurricular") || "Atividades Extracurriculares",
  t("childRecreation") || "Recreação Infantil",

  // 🧾 Contas e Serviços
  t("creditCard") || "Cartão de Crédito",
  t("loans") || "Empréstimos / Financiamentos",
  t("installments") || "Parcelamentos",
  t("checks") || "Cheques",
  t("fines") || "Juros e Multas",
  t("insurance") || "Seguros Diversos",
  t("subscriptions") || "Assinaturas Online",
  t("consulting") || "Consultoria / Serviços Profissionais",
  t("monthlyPayments") || "Mensalidades",

  // 🩺 Saúde e Bem-Estar
  t("healthPlan") || "Plano de Saúde",
  t("pharmacy") || "Farmácia / Medicamentos",
  t("medicalAppointments") || "Consultas Médicas",
  t("exams") || "Exames",
  t("dentist") || "Dentista",
  t("gym") || "Academia / Personal Trainer",
  t("therapy") || "Terapias",
  t("optics") || "Ótica",
  t("psychologist") || "Psicólogo",
  t("supplements") || "Suplementos",
  t("physiotherapy") || "Fisioterapia",

  // 👕 Roupas e Estilo
  t("clothing") || "Roupas",
  t("shoes") || "Calçados",
  t("accessories") || "Acessórios",
  t("beautySalon") || "Salão de Beleza / Barbearia",
  t("cosmetics") || "Cosméticos / Perfumes",
  t("jewelry") || "Joias e Relógios",
  t("nails") || "Unhas / Manicure / Pedicure",
  t("makeup") || "Maquiagem",

  // 🎉 Lazer e Entretenimento
  t("cinema") || "Cinema",
  t("shows") || "Shows / Teatros",
  t("parties") || "Baladas",
  t("trips") || "Viagens / Passagens",
  t("hotels") || "Hotéis / Pousadas",
  t("familyTrips") || "Passeios em Família",
  t("parks") || "Parques / Zoológico / Museus",
  t("games") || "Jogos Online / Videogame",
  t("sportsEvents") || "Eventos Esportivos",
  t("books") || "Livros / HQs",
  t("streaming") || "Streaming / Música",

  // 🐾 Animais de Estimação
  t("petFood") || "Ração",
  t("petShop") || "Pet Shop",
  t("veterinary") || "Veterinário",
  t("petToys") || "Brinquedos para Pets",
  t("grooming") || "Banho e Tosa",
  t("petMedicine") || "Remédios para Pets",

  // 🛍️ Compras e Outros
  t("appliances") || "Eletrodomésticos",
  t("electronics") || "Eletrônicos",
  t("furniture") || "Móveis",
  t("decoration") || "Decoração",
  t("stationery") || "Papelaria",
  t("gifts") || "Presentes",
  t("flowers") || "Flores",
  t("marketplace") || "Marketplace (Shopee, Amazon, etc.)",

  // 💼 Obrigações e Impostos
  t("inss") || "INSS",
  t("incomeTax") || "Imposto de Renda",
  t("governmentFees") || "Taxas Governamentais",
  t("unionFees") || "Contribuições Sindicais",
  t("licensingFees") || "Taxas de Licenciamento",
  t("documents") || "Certidões / Documentações",

  // 🔧 Outros Gastos Extras
  t("tips") || "Gorjetas",
  t("donations") || "Doações / Contribuições Religiosas",
  t("deliveryServices") || "Serviços de Entrega / Correios",
  t("subscriptionsPrint") || "Assinaturas de Revistas / Jornais",
  t("equipmentMaintenance") || "Manutenção de Equipamentos",
  t("legalExpenses") || "Despesas Jurídicas / Advogados",
  t("clubFees") || "Mensalidade do Clube",
  t("onlineCourses") || "Cursos Online / Educação",
  t("other") || "Outros",
];
