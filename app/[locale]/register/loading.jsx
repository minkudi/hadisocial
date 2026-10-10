// Skeleton animé affiché pendant le chargement de la page d'inscription.
export default function RegisterLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f1f5f9] py-8">
      <div className="w-full max-w-[600px] mx-auto px-4">
        <div className="rounded-xl bg-white shadow-lg overflow-hidden">
          {/* Bannière photo */}
          <div className="h-44 sm:h-52 w-full bg-gray-100 animate-pulse" />

          <div className="p-8 sm:p-10">
            <div className="mb-8 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-5 w-36 rounded bg-gray-200 animate-pulse" />
            </div>

            <div className="mb-6">
              <div className="mb-3 h-8 w-2/3 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-gray-100 animate-pulse" />
            </div>

            <div className="space-y-5">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <div className="mb-2 h-3.5 w-28 rounded bg-gray-200 animate-pulse" />
                  <div className="h-12 w-full rounded-lg border border-gray-100 bg-gray-50 animate-pulse" />
                </div>
              ))}

              <div className="flex items-center gap-2 pt-1">
                <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                <div className="h-3.5 w-48 rounded bg-gray-100 animate-pulse" />
              </div>

              <div className="h-14 w-full rounded-lg bg-[#3c50e0]/20 animate-pulse" />
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-3.5 w-44 rounded bg-gray-100 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
