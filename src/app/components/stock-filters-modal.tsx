import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DisplayedFilters, StockStrings } from "../static/stock-types";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { dataPointFilters, displayedFilters } from "../static/stock-filters";
import { useSearchParams } from "next/navigation";

type Props = {
  opened: boolean;
  onClose: () => void;
  onSaveFilters: (filters: DisplayedFilters) => void;
};

export const StockFiltersModal = ({
  opened,
  onClose,
  onSaveFilters,
}: Props) => {
  const queryParamsMap = useSearchParams();
  const dpFilters = useMemo(
    () => queryParamsMap.get(StockStrings.dpFilters.key)?.split(",") ?? [""],
    [queryParamsMap],
  );
  const limitFilters = useMemo(
    () => [queryParamsMap.get(StockStrings.limit.key) ?? "100"],
    [queryParamsMap],
  );

  const filters: DisplayedFilters = useMemo(
    () => ({
      dpFilters,
      limit: limitFilters,
    }),
    [dpFilters, limitFilters],
  );

  const [selectedFilters, setSelectedFilters] = useState(filters);

  useEffect(() => {
    if (
      selectedFilters.dpFilters.length ===
        Object.keys(dataPointFilters).length - 1 ||
      selectedFilters.dpFilters.length === 0
    ) {
      setSelectedFilters((prev) => ({ ...prev, dpFilters: [""] }));
    }
  }, [selectedFilters]);

  const handleSelectFilter = (
    filterLabelKey: keyof DisplayedFilters,
    filterKey: string,
  ) => {
    if (filterLabelKey === StockStrings.limit.key) {
      if (selectedFilters[filterLabelKey]?.at(0) === filterKey) return;
      setSelectedFilters((prev) => ({
        ...prev,
        [filterLabelKey]: [filterKey],
      }));
      return;
    }

    if (filterKey === "") {
      setSelectedFilters((prev) => ({ ...prev, [filterLabelKey]: [""] }));
      return;
    }

    if (selectedFilters[filterLabelKey].includes("")) {
      setSelectedFilters((prev) => ({
        ...prev,
        [filterLabelKey]: prev[filterLabelKey].filter(
          (filter) => filter !== "",
        ),
      }));
    }

    if (selectedFilters[filterLabelKey].includes(filterKey)) {
      setSelectedFilters((prev) => ({
        ...prev,
        [filterLabelKey]: prev[filterLabelKey].filter(
          (filter) => filter !== filterKey,
        ),
      }));
      return;
    }

    setSelectedFilters((prev) => ({
      ...prev,
      [filterLabelKey]: [...prev[filterLabelKey], filterKey],
    }));
  };

  const handleResetFilters = () => {
    setSelectedFilters(filters);
  };

  const handleSaveFilters = () => {
    onClose();
    onSaveFilters(selectedFilters);
  };

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent
        className="flex h-1/2 max-h-[800px] w-3/4 max-w-[1200px] flex-col"
        overlayStyles="bg-white bg-opacity-[0.1] backdrop-blur-[1px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="flex justify-between text-2xl">
            <span>Filters</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex h-full flex-col justify-between gap-2 overflow-auto">
          <div className="flex flex-col gap-10 overflow-auto">
            {Object.entries(displayedFilters).map(([key, filtersObj], i) => {
              const filterLabelKey = key as keyof DisplayedFilters;
              return (
                <div
                  className="flex flex-col gap-2"
                  key={`${filterLabelKey}-${i}`}
                >
                  <h3>{StockStrings[filterLabelKey].title}</h3>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(filtersObj).map(
                      ([filtersKey, label], i) => {
                        const isSelected =
                          selectedFilters[filterLabelKey].includes(
                            filtersKey,
                          ) ||
                          (selectedFilters[filterLabelKey].length === 0 &&
                            filtersKey === "");

                        return (
                          <button
                            onClick={() =>
                              handleSelectFilter(filterLabelKey, filtersKey)
                            }
                            key={`${filtersKey}-${i}`}
                          >
                            <Badge
                              className={`flex items-center justify-center border border-slate-800 bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-slate-50 ${isSelected && "bg-slate-800 text-slate-50"}`}
                            >
                              {isSelected && (
                                <Check
                                  className="mr-2"
                                  width={15}
                                  height={15}
                                />
                              )}
                              {label}
                            </Badge>
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-end gap-4">
            <Button
              className="h-8 bg-slate-100 text-slate-800 hover:bg-slate-200 md:h-10"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
            <Button
              onClick={handleSaveFilters}
              className="h-8 hover:bg-blue-500 hover:text-slate-50 md:h-10"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
