import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">BK E-Banking</h1>
        <Link href="/register" className="text-blue-600 underline">
          Inscription
        </Link>
      </div>
    </main>
  );
}
