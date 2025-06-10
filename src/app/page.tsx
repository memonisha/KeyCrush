export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white text-center p-6">
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
  <h1 className="text-5xl font-bold mb-8 heading-font text-yellow-400 text-center" style={{ fontFamily: 'Georgia, serif' }}>
   🔥 Welcome to KeyCrush ⌨️
  </h1>

  <p className="mb-6 max-w-xl text-center text-white text-lg" style={{ fontFamily: 'comic sans ms' }} >
    Improve your typing speed with fun coding quotes and motivational phrases.
  </p>

 <a
        href="/game"
        className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 " style={{ fontFamily: 'Georgia, serif' }}
      >
        Start Typing Challenge
      </a>

       <img
          src="/pawtype.gif" // Replace with your actual GIF path
          alt="Typing animation"
          className="mt-10 w-72 h-auto rounded-lg shadow-lg"
        />
</div>

      
      
    </main>
  );
}
