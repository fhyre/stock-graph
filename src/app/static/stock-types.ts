export type StockResults = {
  v: number;
  vw: number;
  o: number;
  c: number;
  h: number;
  l: number;
  t: number;
  n: number;
};

export type PolygonStockData = {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: StockResults[];
};

export type OmitTime = Omit<StockResults, "t">;

export type StockFilters = OmitTime & { "": null };

export type ChartColumns = {
  label: string;
  key: keyof OmitTime;
  value: number;
}[];

export type ChartLegend = {
  [legendLabel: string]: { key: keyof OmitTime; color: string };
};

export type ChartData = {
  data: {
    columns: ChartColumns;
    columnLabel: { label: string };
  }[];
  legend: ChartLegend;
};

export type DisplayedFilters = {
  dpFilters: string[];
  limit: string[];
};

export const StockStrings = {
  dpFilters: {
    title: "Data Points",
    key: "dpFilters",
  },
  limit: {
    title: "Limit",
    key: "limit",
  },
};
