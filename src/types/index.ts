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
  /** Código ISO-4217 da moeda, ex.: "USD", "BRL", "EUR" */
  currency?: string;
  /** Observação/detalhe livre da transação (ex.: “Compra para churrasco”) */
  details?: string;
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
  "salary",
  "extraHours",
  "extraIncome",
  "commissions",
  "13salary",
  "vacation",
  "taxRefund",
  "rentReceived",
  "dividends",
  "investmentReturns",
  "savingsInterest",
  "cashback",
  "productSales",
  "freelance",
  "pension",
  "governmentBenefits",
  "prizes",
  "reimbursement",
  "assetSales",
  "other",
] as const;

/** ================================
 *  🔴 DESPESAS (EXPENSES)
 * ================================= */
export const EXPENSE_CATEGORIES = [
  // 🏠 Moradia
  "rent",
  "mortgage",
  "condominium",
  "propertyTax",
  "electricity",
  "water",
  "gas",
  "internet",
  "landline",
  "tv",
  "homeInsurance",
  "homeMaintenance",
  "furniturePurchase",
  "homeRenovations",

  // 🛒 Alimentação
  "supermarket",
  "butcher",
  "bakery",
  "market",
  "delivery",
  "restaurants",
  "snackBars",
  "coffeeShop",
  "iceCream",
  "fastFood",
  "bottledWater",
  "sweets",

  // 🚗 Transporte e Mobilidade
  "fuel",
  "vehicleMaintenance",
  "parking",
  "toll",
  "carInsurance",
  "vehicleTax",
  "publicTransport",
  "taxi",
  "mobilityApps",
  "mechanic",
  "carWash",
  "trafficFines",
  "technicalWash",

  // 👨‍👩‍👧‍👦 Despesas Familiares
  "school",
  "schoolSupplies",
  "schoolTransport",
  "extraCourses",
  "daycare",
  "allowance",
  "familyGifts",
  "extracurricular",
  "childRecreation",

  // 🧾 Contas e Serviços
  "creditCard",
  "loans",
  "installments",
  "checks",
  "fines",
  "insurance",
  "subscriptions",
  "consulting",
  "monthlyPayments",

  // 🩺 Saúde e Bem-Estar
  "healthPlan",
  "pharmacy",
  "medicalAppointments",
  "exams",
  "dentist",
  "gym",
  "therapy",
  "optics",
  "psychologist",
  "supplements",
  "physiotherapy",

  // 👕 Roupas e Estilo
  "clothing",
  "shoes",
  "accessories",
  "beautySalon",
  "cosmetics",
  "jewelry",
  "nails",
  "makeup",

  // 🎉 Lazer e Entretenimento
  "cinema",
  "shows",
  "parties",
  "trips",
  "hotels",
  "familyTrips",
  "parks",
  "games",
  "sportsEvents",
  "books",
  "streaming",

  // 🐾 Animais de Estimação
  "petFood",
  "petShop",
  "veterinary",
  "petToys",
  "grooming",
  "petMedicine",

  // 🛍️ Compras e Outros
  "appliances",
  "electronics",
  "furniture",
  "decoration",
  "stationery",
  "gifts",
  "flowers",
  "marketplace",

  // 💼 Obrigações e Impostos
  "inss",
  "incomeTax",
  "governmentFees",
  "unionFees",
  "licensingFees",
  "documents",

  // 🔧 Outros Gastos Extras
  "tips",
  "donations",
  "deliveryServices",
  "subscriptionsPrint",
  "equipmentMaintenance",
  "legalExpenses",
  "clubFees",
  "onlineCourses",
  "other",
] as const;
