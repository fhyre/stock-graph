export enum StockSymbol {
  IBM = "IBM",
  AAPL = "Apple",
  AMZN = "Amazon",
  TSLA = "Tesla",
  GOOGL = "Google",
  MSFT = "Microsoft",
  META = "Meta",
  NVDA = "Nvidia",
  JNJ = "Johnson & Johnson",
  PFE = "Pfizer",
  BAC = "Bank of America",
  WMT = "Walmart",
  PEP = "Pepsi",
  JPM = "JPMorgan",
  INTC = "Intel",
  AMD = "AMD",
  NFLX = "Netflix",
  DASH = "Doordash",
  DDOG = "Datadog",
  ADBE = "Adobe",
}

export const stockSymbolsMap: { [key: string]: string } = Object.entries(
  StockSymbol,
).reduce((accu, [key, value]) => ({ ...accu, [key]: value }), {});
