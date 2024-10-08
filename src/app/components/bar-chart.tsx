"use client";
import { memo, useMemo, useRef, useState } from "react";
import {
  ChartData,
  ChartLegend,
  OmitTime,
  StockStrings,
} from "../static/stock-types";
import { useSearchParams } from "next/navigation";
import { useVirtualizer } from "@tanstack/react-virtual";

const _BarChart = ({ data, legend }: ChartData) => {
  const [hiddenColumns, setHiddenColumns] = useState<{
    [index: number]: (keyof OmitTime)[];
  }>({});

  const queryParams = useSearchParams();
  const filters = useMemo(
    () => queryParams.get(StockStrings.dpFilters.key)?.split(",") ?? [""],
    [queryParams],
  );
  const limit = useMemo(
    () => queryParams.get(StockStrings.limit.key) ?? "100",
    [queryParams],
  );

  const filteredData = useMemo(() => {
    return data.slice(0, Number(limit)).map((item) => {
      return {
        ...item,
        columns: item.columns.filter(({ key }) => {
          if (filters.length === 1 && filters.at(0) === "") return true;
          return filters.includes(key);
        }),
      };
    });
  }, [filters, limit, data]);

  const filteredLegend = useMemo(() => {
    return Object.entries(legend)
      .filter(([_, { key }]) => {
        if (filters.length === 1 && filters.at(0) === "") return true;
        return filters.includes(key);
      })
      .reduce<ChartLegend>(
        (accu, [legendKey, value]) => ({
          ...accu,
          [legendKey]: value,
        }),
        {},
      );
  }, [filters, legend]);

  const max = useMemo(() => {
    return Math.max(
      ...filteredData.map((item) =>
        Math.max(
          ...item.columns.map((col) => {
            return col.value;
          }),
        ),
      ),
    );
  }, [filteredData]);

  const barContainerRef = useRef<HTMLDivElement>(null);
  const floatingInfoRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    horizontal: true,
    getScrollElement: () => barContainerRef.current,
    count: filteredData.length,
    estimateSize: () => 300,
  });

  const resetFloatingInfo = () => {
    const floatingInfo = floatingInfoRef.current;
    if (floatingInfo) {
      floatingInfo.style.transform = "scale(0)";
      setTimeout(() => {
        floatingInfo.style.visibility = "hidden";
        floatingInfo.textContent = "";
      }, 100);
    }
  };

  const handleColumnClick = (columnKey: number, dataPoint: keyof OmitTime) => {
    setHiddenColumns((prev) => {
      const prevArray = prev?.[columnKey] ?? [];

      if (prevArray.includes(dataPoint)) return prev;

      return {
        ...prev,
        [columnKey]: [...prevArray, dataPoint],
      };
    });

    resetFloatingInfo();
  };

  const handleOnColumnHover = (
    content: string,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const barContainer = barContainerRef.current;
    const floatingInfo = floatingInfoRef.current;

    if (barContainer && floatingInfo) {
      const { top, left } = barContainer.getBoundingClientRect();
      floatingInfo.style.top = `${e.clientY - top * 0.8}px`;
      floatingInfo.style.left = `${e.clientX - left}px`;
      floatingInfo.style.visibility = "visible";
      floatingInfo.style.transform = "scale(1)";
      floatingInfo.textContent = content;
    }
  };

  const handleOnColumnLeave = () => {
    resetFloatingInfo();
  };

  return (
    <>
      <div className={`flex h-full flex-col justify-stretch gap-2`}>
        <div className="flex justify-start gap-3 overflow-x-auto p-1 md:justify-center">
          {Object.entries(filteredLegend).map(([key, { color }]) => (
            <div
              key={key}
              className="flex items-center justify-center gap-1 text-nowrap text-xs"
            >
              <span className={`h-[10px] w-[10px] ${color}`} />
              {key}
            </div>
          ))}
        </div>
        <div className="flex h-full">
          <div className="overflow-x-scroll" ref={barContainerRef}>
            <div
              className={`relative h-full`}
              style={{
                width: `${virtualizer.getTotalSize()}px`,
              }}
            >
              {virtualizer.getVirtualItems().map(({ index, size, start }) => {
                const idx1 = index;
                const item = filteredData[idx1];
                return (
                  <div
                    className="absolute left-0 top-0 h-full transform-gpu"
                    style={{
                      width: `${size}px`,
                      transform: `translateX(${start}px)`,
                    }}
                    key={`${idx1}-bars`}
                  >
                    <div className="flex h-full flex-col items-center">
                      <div className="flex h-full items-end gap-1 overflow-hidden">
                        {item.columns.map((col, idx2) => {
                          const hidden = hiddenColumns[idx1]?.includes(col.key);
                          return (
                            <div
                              key={`${idx2}-bar`}
                              className={`flex h-full transition-all hover:bg-gray-200/60 ${hidden && "invisible"} `}
                              onMouseMove={(e) =>
                                handleOnColumnHover(col.value.toString(), e)
                              }
                              onMouseLeave={handleOnColumnLeave}
                            >
                              <button
                                className={`w-[30px] self-end ${legend[col.label].color} origin-center transform-gpu transition-all ${hidden ? "invisible scale-0 duration-300 hover:scale-0" : "hover:z-[1] hover:scale-150 hover:brightness-50"}`}
                                style={{
                                  height: `${(Math.log(col.value) / Math.log(max)) * 100}%`,
                                }}
                                onClick={() => handleColumnClick(idx1, col.key)}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <div className="mb-2 mt-[0.5px] h-[1px] w-full bg-slate-800/50" />
                      <p className="text-nowrap text-xs">
                        {item.columnLabel.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="relative flex justify-center text-sm font-bold text-slate-700">
          Date
          <p className="absolute right-0 font-normal text-slate-500">
            <span className="invisible mr-1 sm:visible">Displaying</span>
            {filteredData.length} points
          </p>
        </div>
      </div>
      <div
        className="fixed transform-gpu rounded-xl bg-slate-800 px-4 text-slate-50 transition-transform"
        ref={floatingInfoRef}
      />
    </>
  );
};

export const BarChart = memo(_BarChart);
