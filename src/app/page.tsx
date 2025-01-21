import PixiApp from "@/lib/components/PixiApp";
import { GameProvider } from "@/lib/components/GameProvider";

export default function Home() {
  return (
    <div className="min-h-screen items-center justify-items-center gap-16 p-4">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <GameProvider>
          <PixiApp />
        </GameProvider>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6"></footer>
    </div>
  );
}
