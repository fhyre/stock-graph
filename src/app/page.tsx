import { StockBadgeListLayout } from "./components/layouts/stock-badge-list-layout";
import { StockBadge } from "./components/stock-badge";
import { StockChartSuspense } from "./components/stock-chart-suspense";
import { StockModal } from "./components/stock-modal";
import { StockSymbol } from "./static/stock-symbol";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: Props) {
  const showStockModal = searchParams?.modal === "true";
  const symbol = searchParams?.stock as string;

  return (
    <>
      <div className={`flex h-screen w-screen items-center justify-center`}>
        <main className="m-4 flex min-w-[300px] max-w-[600px] flex-col gap-5 rounded-xl border border-slate-300 bg-slate-100 p-4">
          <h1 className="text-2xl font-semibold">Stocks</h1>
          <StockBadgeListLayout>
            {...Object.keys(StockSymbol).map((symbol) => {
              return <StockBadge key={symbol} symbol={symbol} />;
            })}
          </StockBadgeListLayout>
        </main>
        {showStockModal && symbol && (
          <StockModal symbol={symbol}>
            <StockChartSuspense symbol={symbol} />
          </StockModal>
        )}
      </div>
    </>
  );
}
