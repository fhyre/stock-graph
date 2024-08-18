import { Suspense } from "react";
import { StockChart } from "./stock-chart";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  symbol: string;
};

export const StockChartSuspense = async ({ symbol }: Props) => {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <StockChart symbol={symbol} />
    </Suspense>
  );
};
