export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-gray-900 flex flex-col items-center justify-center text-white text-center p-6">
      <h1 className="text-5xl font-extrabold mb-6 animate-pulse">
        🔥 Welcome to <span className="text-yellow-300">KeyCrush</span>
      </h1>
      <p className="text-lg mb-10 max-w-xl">
        Test your typing speed and accuracy in a sleek, fast-paced challenge! Can you make it to the top of the leaderboard?
      </p>
      <a
        href="/game"
        className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
      >
        Start Typing Challenge
      </a>
    </main>
  );
}
