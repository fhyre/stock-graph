import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { headers } from "next/headers";
import { StockStrings } from "../static/stock-types";

type Props = {
  symbol: string;
};

export const StockBadge = ({ symbol }: Props) => {
  const headersList = headers();
  const pathname = headersList.get("x-pathname");
  const scheme = process.env.NODE_ENV === "production" ? "https://" : "http://";
  const url = new URL(
    pathname ? pathname : "",
    `${scheme}${headersList.get("host")}`,
  );
  url.searchParams.set("modal", "true");
  url.searchParams.set("stock", symbol);
  url.searchParams.set(StockStrings.limit.key, "10");

  return (
    <Link href={url.toString()}>
      <Badge
        variant="outline"
        className="border-slate-800 px-2 py-1 transition-all duration-300 hover:bg-slate-800 hover:text-slate-100"
      >
        {symbol}
      </Badge>
    </Link>
  );
};
