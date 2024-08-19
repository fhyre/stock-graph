import { dataPointsMapping } from "./data-points-mapping";
import { DisplayedFilters } from "./stock-types";

export const dataPointFilters: { [dataPointKey: string]: string } =
  Object.entries(dataPointsMapping).reduce(
    (accu, [dataPointKey, { label }]) => {
      if (dataPointKey === "t") return accu;

      return {
        ...accu,
        [dataPointKey]: label,
      };
    },
    { "": "All" },
  );

export const limitFilters: { [limitKey: string]: string } = {
  10: "10",
  100: "100",
  500: "500",
  1000: "1000",
  5000: "5000",
  7500: "7500",
  10000: "10000",
};

export const displayedFilters = {
  dpFilters: dataPointFilters,
  limit: limitFilters,
};
