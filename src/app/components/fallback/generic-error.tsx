import { Ban } from "lucide-react";

export const GenericError = () => {
  return (
    <div className="flex gap-2 text-red-500">
      <Ban width={20} />
      An error has occurred
    </div>
  );
};
