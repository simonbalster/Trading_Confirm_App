export interface ForexPair {
  id: string;
  label: string;
  symbol: string;
  category: 'major' | 'minor' | 'exotic' | 'metals' | 'indices';
}

const unsortedForexPairs: ForexPair[] = [
  // Major Pairs
  { id: 'EURUSD', label: 'EUR/USD - Euro vs US Dollar', symbol: 'EUR/USD', category: 'major' },
  { id: 'GBPUSD', label: 'GBP/USD - British Pound vs US Dollar', symbol: 'GBP/USD', category: 'major' },
  { id: 'USDJPY', label: 'USD/JPY - US Dollar vs Japanese Yen', symbol: 'USD/JPY', category: 'major' },
  { id: 'USDCHF', label: 'USD/CHF - US Dollar vs Swiss Franc', symbol: 'USD/CHF', category: 'major' },
  { id: 'AUDUSD', label: 'AUD/USD - Australian Dollar vs US Dollar', symbol: 'AUD/USD', category: 'major' },
  { id: 'USDCAD', label: 'USD/CAD - US Dollar vs Canadian Dollar', symbol: 'USD/CAD', category: 'major' },
  { id: 'NZDUSD', label: 'NZD/USD - New Zealand Dollar vs US Dollar', symbol: 'NZD/USD', category: 'major' },
  
  // Minor Pairs (Cross Currencies)
  { id: 'EURGBP', label: 'EUR/GBP - Euro vs British Pound', symbol: 'EUR/GBP', category: 'minor' },
  { id: 'EURJPY', label: 'EUR/JPY - Euro vs Japanese Yen', symbol: 'EUR/JPY', category: 'minor' },
  { id: 'GBPJPY', label: 'GBP/JPY - British Pound vs Japanese Yen', symbol: 'GBP/JPY', category: 'minor' },
  { id: 'EURCHF', label: 'EUR/CHF - Euro vs Swiss Franc', symbol: 'EUR/CHF', category: 'minor' },
  { id: 'GBPCHF', label: 'GBP/CHF - British Pound vs Swiss Franc', symbol: 'GBP/CHF', category: 'minor' },
  { id: 'EURAUD', label: 'EUR/AUD - Euro vs Australian Dollar', symbol: 'EUR/AUD', category: 'minor' },
  { id: 'GBPAUD', label: 'GBP/AUD - British Pound vs Australian Dollar', symbol: 'GBP/AUD', category: 'minor' },
  { id: 'EURCAD', label: 'EUR/CAD - Euro vs Canadian Dollar', symbol: 'EUR/CAD', category: 'minor' },
  { id: 'GBPCAD', label: 'GBP/CAD - British Pound vs Canadian Dollar', symbol: 'GBP/CAD', category: 'minor' },
  { id: 'AUDCAD', label: 'AUD/CAD - Australian Dollar vs Canadian Dollar', symbol: 'AUD/CAD', category: 'minor' },
  { id: 'AUDJPY', label: 'AUD/JPY - Australian Dollar vs Japanese Yen', symbol: 'AUD/JPY', category: 'minor' },
  { id: 'CADJPY', label: 'CAD/JPY - Canadian Dollar vs Japanese Yen', symbol: 'CAD/JPY', category: 'minor' },
  { id: 'CADCHF', label: 'CAD/CHF - Canadian Dollar vs Swiss Franc', symbol: 'CAD/CHF', category: 'minor' },
  { id: 'CHFJPY', label: 'CHF/JPY - Swiss Franc vs Japanese Yen', symbol: 'CHF/JPY', category: 'minor' },
  { id: 'NZDJPY', label: 'NZD/JPY - New Zealand Dollar vs Japanese Yen', symbol: 'NZD/JPY', category: 'minor' },
  { id: 'NZDCAD', label: 'NZD/CAD - New Zealand Dollar vs Canadian Dollar', symbol: 'NZD/CAD', category: 'minor' },
  { id: 'NZDCHF', label: 'NZD/CHF - New Zealand Dollar vs Swiss Franc', symbol: 'NZD/CHF', category: 'minor' },

  
  // Popular Exotic Pairs
  { id: 'USDTRY', label: 'USD/TRY - US Dollar vs Turkish Lira', symbol: 'USD/TRY', category: 'exotic' },
  { id: 'USDZAR', label: 'USD/ZAR - US Dollar vs South African Rand', symbol: 'USD/ZAR', category: 'exotic' },
  { id: 'USDMXN', label: 'USD/MXN - US Dollar vs Mexican Peso', symbol: 'USD/MXN', category: 'exotic' },
  { id: 'USDSEK', label: 'USD/SEK - US Dollar vs Swedish Krona', symbol: 'USD/SEK', category: 'exotic' },
  { id: 'USDNOK', label: 'USD/NOK - US Dollar vs Norwegian Krone', symbol: 'USD/NOK', category: 'exotic' },
  { id: 'USDDKK', label: 'USD/DKK - US Dollar vs Danish Krone', symbol: 'USD/DKK', category: 'exotic' },
  { id: 'USDSGD', label: 'USD/SGD - US Dollar vs Singapore Dollar', symbol: 'USD/SGD', category: 'exotic' },
  { id: 'USDHKD', label: 'USD/HKD - US Dollar vs Hong Kong Dollar', symbol: 'USD/HKD', category: 'exotic' },
  { id: 'GBPSGD', label: 'GBP/SGD - British Pound vs Singapore Dollar', symbol: 'GBP/SGD', category: 'exotic' },
  { id: 'EURSGD', label: 'EUR/SGD - Euro vs Singapore Dollar', symbol: 'EUR/SGD', category: 'exotic' },

  // Metals
  { id: 'XAUUSD', label: 'XAU/USD - GOLD vs US Dollar', symbol: 'XAU/USD', category: 'metals' },
  { id: 'XAGUSD', label: 'XAG/USD - SILVER vs US Dollar', symbol: 'XAG/USD', category: 'metals' },
  { id: 'XAGAUD', label: 'XAG/AUD - SILVER vs Australian Dollar', symbol: 'XAG/AUD', category: 'metals' },

  // Indices
  { id: 'UK100', label: 'UK100 - FTSE 100', symbol: 'UK100', category: 'indices' },
  { id: 'US30', label: 'US30 - DOW 30', symbol: 'US30', category: 'indices' },
  { id: 'US500', label: 'US500 - S&P 500', symbol: 'US500', category: 'indices' },
  { id: 'USTEC', label: 'USTEC - NASDAQ 100', symbol: 'USTEC', category: 'indices' }
];

// Sort forex pairs alphabetically by ID
export const forexPairs: ForexPair[] = unsortedForexPairs.sort((a, b) => a.id.localeCompare(b.id));

export default forexPairs;