import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6 sm:px-10">
      <main className="md:w-fit text-center sm:text-left flex flex-col items-center sm:items-start gap-8 max-w-2xl bg-white/70 backdrop-blur-md p-10 rounded-2xl shadow-lg border border-blue-100">
        <Image
          src="/authentic.png"
          alt="an image"
          width={120}
          height={120}
          className="flex flex-row md:justify-center"
        />
        <h1 className="text-2xl sm:text-5xl md:w-full md:text-center font-extrabold text-blue-700 leading-tight">
          Staff Management App
        </h1>
        
        <p className="md:text-center text-gray-600 text-lg">
          Streamline your organization’s employee records and manage staff details efficiently.
        </p>
        
        <Link
          href="/staff"
          className="md:w-full md:text-center bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white text-lg font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg"
        >
          View Staff Details
        </Link>
      </main>
    </div>
  );
}
