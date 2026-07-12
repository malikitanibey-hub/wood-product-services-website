export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
      <div className="text-center">
        <span className="mx-auto block h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />
        <p className="mt-4 font-medium text-slate-500">
          Loading Products / Wood Types...
        </p>
      </div>
    </main>
  );
}
