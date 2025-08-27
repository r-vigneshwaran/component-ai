"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <button
        className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
        onClick={() => router.push("/dynamic-component-string")}
      >
        Go to dynamic component string
      </button>{" "}
      <button
        className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
        onClick={() => router.push("/code-generator")}
      >
        Go to Code Generator
      </button>
    </div>
  );
}
