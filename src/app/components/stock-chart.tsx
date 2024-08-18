import { getStock } from "../lib/services";
import { GenericError } from "./fallback/generic-error";
import { dataPointsMapping } from "../static/data-points-mapping";
import {
  ChartColumns,
  ChartData,
  OmitTime,
  PolygonStockData,
} from "../static/stock-types";
import { BarChart } from "./bar-chart";

type Props = {
  symbol: string;
};

export const StockChart = async ({ symbol }: Props) => {
  try {
    const data: PolygonStockData = await getStock(symbol);
    const { results } = data;

    const chartData: ChartData = {
      data: results.map((item) => ({
        columns: Object.entries(item).reduce<ChartColumns>(
          (accu, [dataPointKey, value]) => {
            if (dataPointKey === "t") return accu;
            return [
              ...accu,
              {
                label: dataPointsMapping[dataPointKey as keyof OmitTime]?.label,
                key: dataPointKey as keyof OmitTime,
                value: value,
              },
            ];
          },
          [],
        ),
        columnLabel: {
          label: new Date(item.t).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
        },
      })),
      legend: Object.entries(dataPointsMapping).reduce(
        (accu, [dataPointKey, curr]) => {
          if (dataPointKey === "t") return accu;

          return {
            ...accu,
            [curr.label]: {
              key: dataPointKey as keyof OmitTime,
              color: curr.color,
            },
          };
        },
        {},
      ),
    };

    return <BarChart data={chartData.data} legend={chartData.legend} />;
  } catch (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <GenericError />
      </div>
    );
  }
};
