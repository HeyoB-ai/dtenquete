import { IntakeWizard } from "@/components/intake/IntakeWizard";

export default function IntakePage() {
  return (
    <main className="min-h-screen bg-paper">
      <header className="flex items-end justify-between gap-8 bg-ink px-10 py-8 text-paper max-[600px]:flex-col max-[600px]:items-start">
        <h1 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1]">
          Digital Twin
          <br />
          <em>Intake</em>
        </h1>
        <p className="max-w-[280px] text-right text-[0.875rem] text-[#aaa] max-[600px]:text-left">
          Vul dit formulier in. Op basis van uw antwoorden stellen wij een implementatieplan op maat
          op voor uw bedrijf.
        </p>
      </header>
      <div className="px-8 py-10">
        <IntakeWizard />
      </div>
    </main>
  );
}
