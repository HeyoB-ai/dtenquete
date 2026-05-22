export const dynamic = "force-dynamic";

export default function BedanktPage({
  searchParams,
}: {
  searchParams: { naam?: string };
}) {
  const naam = searchParams?.naam?.trim();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <div className="max-w-[520px]">
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-success-light text-3xl text-success">
          ✓
        </div>
        <h1 className="font-serif text-[2rem] text-ink">Bedankt{naam ? `, ${naam}` : ""}!</h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-2">
          We hebben uw intake ontvangen en nemen binnen 2 werkdagen contact met u op met een
          implementatieplan op maat.
        </p>
      </div>
    </main>
  );
}
