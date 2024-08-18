type Props = {
  children: React.ReactNode;
};

export const StockBadgeListLayout = ({ children }: Props) => {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
};
