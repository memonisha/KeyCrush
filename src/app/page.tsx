export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-gray-900 flex flex-col items-center justify-center text-white text-center p-6">
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
  <h1 className="text-5xl font-bold mb-8 heading-font text-yellow-400 text-center">
   🔥 Welcome to KeyCrush ⌨️
  </h1>

  <p className="mb-6 max-w-xl text-center text-white text-lg">
    Improve your typing speed with fun coding quotes and motivational phrases.
  </p>

 <a
        href="/game"
        className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
      >
        Start Typing Challenge
      </a>
</div>

      
      
    </main>
  );
}
