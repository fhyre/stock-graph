"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h2>An unexpected error has occurred</h2>
      <button
        onClick={() => reset()}
        className="text-blue-500 transition-all duration-300 hover:text-blue-600"
      >
        Try again
      </button>
    </div>
  );
}
