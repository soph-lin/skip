import Game from "@/lib/components/game/Game";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <main className="w-full h-full flex items-center justify-center">
        <Game />
      </main>
    </div>
  );
}
