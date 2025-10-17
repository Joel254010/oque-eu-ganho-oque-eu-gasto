import React, { useState, useMemo } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { saveTransaction } from "../utils/storage";
import { INCOME_TYPES, EXPENSE_CATEGORIES } from "../types";
import { useTranslation } from "react-i18next";

/** 🌍 Lista completa de moedas ISO 4217 (com símbolo, nome e código) */
const CURRENCIES = [
  { code: "BRL", symbol: "R$", name: "Real Brasileiro" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan Renminbi" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "ARS", symbol: "$", name: "Argentine Peso" },
  { code: "CLP", symbol: "$", name: "Chilean Peso" },
  { code: "COP", symbol: "$", name: "Colombian Peso" },
  { code: "PEN", symbol: "S/", name: "Peruvian Sol" },
  { code: "UYU", symbol: "$U", name: "Uruguayan Peso" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "EGP", symbol: "£", name: "Egyptian Pound" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "MAD", symbol: "د.م.", name: "Moroccan Dirham" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
  { code: "RON", symbol: "lei", name: "Romanian Leu" },
  { code: "BGN", symbol: "лв", name: "Bulgarian Lev" },
  { code: "HRK", symbol: "€", name: "Croatian Euro" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia" },
  { code: "KZT", symbol: "₸", name: "Kazakhstani Tenge" },
  { code: "IRR", symbol: "﷼", name: "Iranian Rial" },
  { code: "IQD", symbol: "ع.د", name: "Iraqi Dinar" },
  { code: "DZD", symbol: "د.ج", name: "Algerian Dinar" },
  { code: "TND", symbol: "د.ت", name: "Tunisian Dinar" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling" },
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
  { code: "XOF", symbol: "CFA", name: "West African CFA Franc" },
  { code: "XAF", symbol: "CFA", name: "Central African CFA Franc" },
  { code: "XPF", symbol: "₣", name: "CFP Franc" },
  { code: "BWP", symbol: "P", name: "Botswana Pula" },
  { code: "MZN", symbol: "MT", name: "Mozambican Metical" },
  { code: "AOA", symbol: "Kz", name: "Angolan Kwanza" },
  { code: "ETB", symbol: "Br", name: "Ethiopian Birr" },
  { code: "SDG", symbol: "£", name: "Sudanese Pound" },
  { code: "GMD", symbol: "D", name: "Gambian Dalasi" },
  { code: "BHD", symbol: ".د.ب", name: "Bahraini Dinar" },
  { code: "OMR", symbol: "﷼", name: "Omani Rial" },
  { code: "QAR", symbol: "﷼", name: "Qatari Riyal" },
  { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee" },
  { code: "NPR", symbol: "₨", name: "Nepalese Rupee" },
  { code: "MMK", symbol: "K", name: "Myanmar Kyat" },
  { code: "KHR", symbol: "៛", name: "Cambodian Riel" },
  { code: "LAK", symbol: "₭", name: "Lao Kip" },
  { code: "MNT", symbol: "₮", name: "Mongolian Tugrik" },
  { code: "AFN", symbol: "؋", name: "Afghan Afghani" },
  { code: "MVR", symbol: "Rf", name: "Maldivian Rufiyaa" },
  { code: "BND", symbol: "B$", name: "Brunei Dollar" },
  { code: "FJD", symbol: "FJ$", name: "Fiji Dollar" },
  { code: "PGK", symbol: "K", name: "Papua New Guinea Kina" },
  { code: "SBD", symbol: "SI$", name: "Solomon Islands Dollar" },
  { code: "TOP", symbol: "T$", name: "Tongan Paʻanga" },
  { code: "WST", symbol: "WS$", name: "Samoan Tala" },
  { code: "VUV", symbol: "VT", name: "Vanuatu Vatu" },
  { code: "XCD", symbol: "EC$", name: "East Caribbean Dollar" },
  { code: "TTD", symbol: "TT$", name: "Trinidad & Tobago Dollar" },
  { code: "BSD", symbol: "B$", name: "Bahamian Dollar" },
  { code: "BBD", symbol: "Bds$", name: "Barbados Dollar" },
  { code: "JMD", symbol: "J$", name: "Jamaican Dollar" },
  { code: "DOP", symbol: "RD$", name: "Dominican Peso" },
  { code: "HTG", symbol: "G", name: "Haitian Gourde" },
  { code: "CUP", symbol: "₱", name: "Cuban Peso" },
  { code: "CRC", symbol: "₡", name: "Costa Rican Colón" },
  { code: "GTQ", symbol: "Q", name: "Guatemalan Quetzal" },
  { code: "HNL", symbol: "L", name: "Honduran Lempira" },
  { code: "NIO", symbol: "C$", name: "Nicaraguan Córdoba" },
  { code: "BZD", symbol: "BZ$", name: "Belize Dollar" },
  { code: "PAB", symbol: "B/.", name: "Panamanian Balboa" },
  { code: "KYD", symbol: "CI$", name: "Cayman Islands Dollar" },
  { code: "ANG", symbol: "ƒ", name: "Netherlands Antillean Guilder" },
  { code: "AWG", symbol: "ƒ", name: "Aruban Florin" },
  { code: "BMD", symbol: "BD$", name: "Bermudian Dollar" },
  { code: "MUR", symbol: "₨", name: "Mauritian Rupee" },
  { code: "SCR", symbol: "₨", name: "Seychellois Rupee" },
  { code: "MGA", symbol: "Ar", name: "Malagasy Ariary" },
  { code: "SZL", symbol: "E", name: "Swazi Lilangeni" },
  { code: "LSL", symbol: "L", name: "Lesotho Loti" },
  { code: "BIF", symbol: "FBu", name: "Burundian Franc" },
  { code: "RWF", symbol: "FRw", name: "Rwandan Franc" },
  { code: "MWK", symbol: "MK", name: "Malawian Kwacha" },
  { code: "ZMW", symbol: "ZK", name: "Zambian Kwacha" },
  { code: "GNF", symbol: "FG", name: "Guinean Franc" },
  { code: "SLL", symbol: "Le", name: "Sierra Leonean Leone" },
  { code: "LRD", symbol: "L$", name: "Liberian Dollar" },
  { code: "SOS", symbol: "Sh", name: "Somali Shilling" },
  { code: "DJF", symbol: "Fdj", name: "Djiboutian Franc" },
  { code: "CDF", symbol: "FC", name: "Congolese Franc" },
  { code: "XAG", symbol: "oz Ag", name: "Silver (Ounce)" },
  { code: "XAU", symbol: "oz Au", name: "Gold (Ounce)" },
  { code: "BTC", symbol: "₿", name: "Bitcoin (Crypto)" },
  { code: "ETH", symbol: "Ξ", name: "Ethereum (Crypto)" },
  { code: "USDT", symbol: "₮", name: "Tether (Crypto)" },
];

interface AddTransactionProps {
  type: "income" | "expense";
  onBack: () => void;
  onSave: () => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({
  type,
  onBack,
  onSave,
}) => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = useMemo(() => {
    const base = type === "income" ? INCOME_TYPES : EXPENSE_CATEGORIES;
    return base.map((key) => t(key));
  }, [type, i18n.language, t]);

  const title = type === "income" ? t("addIncome") : t("addExpense");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.amount || !formData.category || !formData.date) {
      setError(t("allFieldsRequired"));
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError(t("invalidValue"));
      return;
    }

    if (!user) return;

    const ok = await saveTransaction({
      userId: user.id,
      type,
      amount,
      category: formData.category,
      date: `${formData.date}T12:00:00`,
      currency: selectedCurrency.code,
    });

    if (!ok) {
      setError(t("transactionSaveError"));
      return;
    }

    await onSave();
    onBack();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-6">
      {/* Cabeçalho */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="text-violet-500 hover:text-violet-400 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-violet-500 ml-4">{title}</h1>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-auto w-full">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* 🔹 Seletor de Moeda */}
          <div>
            <label className="block text-violet-500 mb-2 font-medium">
              {t("value")} ({selectedCurrency.symbol})
            </label>
            <select
              value={selectedCurrency.code}
              onChange={(e) =>
                setSelectedCurrency(
                  CURRENCIES.find((c) => c.code === e.target.value) ||
                    CURRENCIES[0]
                )
              }
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-3 text-white focus:border-violet-500 focus:outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} - {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* 🔹 Valor abaixo da moeda */}
          <div>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              step="0.01"
              min="0"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
              placeholder="0.00"
            />
          </div>

          {/* Categoria */}
          <div className="relative">
            <label className="block text-violet-500 mb-2 font-medium">
              {type === "income" ? t("typeLabel") : t("categoryLabel")}
            </label>
            <input
              type="text"
              value={searchTerm || formData.category}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("searchCategory")}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
              autoComplete="off"
            />
            {searchTerm && (
              <ul className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                {categories
                  .filter((cat) =>
                    cat.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((cat) => (
                    <li
                      key={cat}
                      onClick={() => {
                        setFormData({ ...formData, category: cat });
                        setSearchTerm("");
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-violet-600 transition-colors"
                    >
                      {cat}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Data */}
          <div>
            <label className="block text-violet-500 mb-2 font-medium">
              {t("date")}
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Botão Salvar */}
        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 px-6 rounded-lg mt-8 transition-colors duration-300 flex items-center justify-center"
        >
          <Save className="w-5 h-5 mr-2" />
          {t("save")} {type === "income" ? t("income") : t("expense")}
        </button>
      </form>

      {/* Rodapé */}
      <footer className="text-center text-violet-500 mt-6">
        {t("footerText")} <span className="font-bold">My GlobyX 🚀</span>
      </footer>
    </div>
  );
};

export default AddTransaction;