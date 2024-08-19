"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { stockSymbolsMap } from "../static/stock-symbol";
import { SlidersHorizontal } from "lucide-react";
import { StockFiltersModal } from "./stock-filters-modal";
import { DisplayedFilters } from "../static/stock-types";

type Props = {
  symbol: string;
  children?: React.ReactNode;
};

export const StockModal = ({ symbol, children }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryParamsMap = useSearchParams();
  const queryParamsParsed = Array.from(queryParamsMap.entries()).reduce(
    (acc, [param, value]) => ({ ...acc, [param]: value }),
    {} as Record<string, string>,
  );

  const [modalOpened, setModalOpened] = useState(true);
  const [optionsModalOpened, setOptionsModalOpened] = useState(false);

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  const handleOpenChange = () => {
    setModalOpened(!modalOpened);
    setTimeout(() => {
      router.push("/");
    }, 300);
  };

  const handleToggleOptionsModal = () => {
    setOptionsModalOpened(!optionsModalOpened);
  };

  const handleSaveFilters = (filters: DisplayedFilters) => {
    Object.entries(filters).forEach(([key, value]) => {
      queryParamsParsed[key] = value.join(",");
    });
    const queryString = new URLSearchParams(queryParamsParsed).toString();
    router.push(`${pathname}?${queryString}`);
  };

  return (
    <>
      <Dialog open={modalOpened} onOpenChange={handleOpenChange}>
        <DialogContent
          className={`flex h-3/4 max-h-[800px] w-3/4 max-w-[1200px] transform-gpu flex-col transition-all duration-300 ${optionsModalOpened && "translate-y-[-58%] scale-[0.95]"}`}
          overlayStyles="bg-slate-50/50 backdrop-blur-sm"
        >
          <DialogHeader>
            <DialogTitle className="flex justify-between text-2xl">
              <div>
                {symbol}
                <span className="mx-2">-</span>
                {stockSymbolsMap[symbol]}
              </div>
              <div className="mr-5">
                <button
                  className="rounded-full border border-slate-500 p-1 text-slate-800 transition-all hover:border-slate-800 hover:bg-slate-800 hover:text-slate-50"
                  onClick={handleToggleOptionsModal}
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </button>
              </div>
            </DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
      {optionsModalOpened && (
        <StockFiltersModal
          opened={optionsModalOpened}
          onClose={handleToggleOptionsModal}
          onSaveFilters={handleSaveFilters}
        />
      )}
    </>
  );
};
