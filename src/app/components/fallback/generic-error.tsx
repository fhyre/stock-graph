import { Ban } from "lucide-react";

type Props = {
  message?: string;
};

export const GenericError = ({ message }: Props) => {
  return (
    <div className="flex gap-2 text-red-500">
      <Ban width={20} />
      {message ? <p>{message}</p> : <p>An error has occurred</p>}
    </div>
  );
};
