'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nbapcspsewyxahhlgodg.supabase.co';  // your URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iYXBjc3BzZXd5eGFoaGxnb2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzQzMTQsImV4cCI6MjA2NTExMDMxNH0.6DPA6ROGR0hJ-1SCpF6R50roJ7Vur4t2sQmTmZyCw60';                    // your anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function TypingGame() {
  const allSentences = [
    // Coding
    "Code is like humor. When you have to explain it, it’s bad.",
    "Push your limits, then commit your code.",
    "Bugs are just opportunities for debugging brilliance.",
    "Write clean code as if the next person is a psychopath who knows where you live.",
    "Git happens — commit often.",
    "JavaScript is the duct tape of the internet.",
    "Stay curious. Keep coding.",
    "Typing speed grows with muscle memory and focus.",
    "Comment your code — your future self will thank you.",
    "Debugging is like being the detective of your own mistakes.",
    "Always test your assumptions, especially in code.",
    "Great software is built one thoughtful line at a time.",
    "Backend or frontend — clarity always matters.",
    "Don’t optimize prematurely — write code that works first.",
    "Code with intention, refactor with precision.",

    // DEI
    "Inclusion is not a feature — it’s a foundation.",
    "Diverse teams build better, more resilient solutions.",
    "Equity in tech starts with access and empathy.",
    "Representation creates inspiration.",
    "Be the voice that amplifies others.",
    "Diversity brings strength to innovation.",
    "Equity means fairness, not sameness.",
    "Inclusion is a daily habit, not a checklist.",
    "Respect every perspective. Value every voice.",
    "Building for everyone means listening to everyone.",
    "Empowerment thrives in diverse environments.",
    "Allyship is active, not passive.",
    "No one should have to code through bias.",
    "Accessibility benefits all, not just a few.",
    "We rise by lifting others in the room.",

    // Motivation
    "Practice makes progress, not perfection.",
    "Accuracy is speed in disguise.",
    "Your best typing is yet to come.",
    "Stay focused. One word at a time.",
    "Typing is a dance between mind and fingers.",
    "Every letter brings you closer to mastery.",
    "Type with purpose, not panic.",
    "Build speed through patience.",
    "Confidence grows key by key.",
    "Even pros miss a keystroke — keep going."
  ];

  function shuffleArray(array: string[]) {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  const [shuffledSentences] = useState(() => shuffleArray(allSentences));
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentSentence, setCurrentSentence] = useState(shuffledSentences[0]);

  const [userInput, setUserInput] = useState('');
  const [started, setStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const [correctCharsTotal, setCorrectCharsTotal] = useState(0);
  const [typedCharsTotal, setTypedCharsTotal] = useState(0);

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const [soundOn, setSoundOn] = useState(true);

  // NEW: nickname input and submission state
  const [nickname, setNickname] = useState('');
  const [scoreSaved, setScoreSaved] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const clickSound = useRef<HTMLAudioElement | null>(null);
  const sentenceSound = useRef<HTMLAudioElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{username: string; wpm: number;}[]>([]);

  useEffect(() => {
    clickSound.current = new Audio('/sounds/click.mp3');
    sentenceSound.current = new Audio('/sounds/sentence.mp3');
  }, []);

  useEffect(() => {
  fetchLeaderboard();
}, []);

  useEffect(() => {
    if (started && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => (prev === 1 ? (clearInterval(timerRef.current!), 0) : prev - 1));
      }, 1000);
    }
    return () => clearInterval(timerRef.current!);
  }, [started, isFinished]);

  useEffect(() => {
    if (timeLeft === 0 && !isFinished) finalizeGame();
  }, [timeLeft, isFinished]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!started) setStarted(true);
    setUserInput(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (soundOn && e.key.length === 1 && clickSound.current) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }
    if (e.key === 'Enter' && !isFinished) {
      calculateCurrentSentenceStats(userInput);
      moveToNextSentence();
    }
  };

  const calculateCurrentSentenceStats = (typed: string) => {
    const expected = currentSentence;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === expected[i]) correct++;
    }
    setCorrectCharsTotal(prev => prev + correct);
    setTypedCharsTotal(prev => prev + typed.length);
  };

  const moveToNextSentence = () => {
    const nextIndex = currentSentenceIndex + 1;
    if (nextIndex < shuffledSentences.length) {
      setCurrentSentenceIndex(nextIndex);
      setCurrentSentence(shuffledSentences[nextIndex]);
      setUserInput('');
      if (soundOn && sentenceSound.current) {
        sentenceSound.current.currentTime = 0;
        sentenceSound.current.play();
      }
    } else finalizeGame();
  };
  const fetchLeaderboard = async () => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('username, wpm')
    .order('wpm', { ascending: false })
    .limit(5);
  
  if (error) {
    alert('Error loading leaderboard: ' + error.message);
  } else {
    setLeaderboard(data ?? []);
  }
};

  const finalizeGame = () => {
    const expected = currentSentence;
    let correctInCurrent = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === expected[i]) correctInCurrent++;
    }

    const totalCorrect = correctCharsTotal + correctInCurrent;
    const totalTyped = typedCharsTotal + userInput.length;

    const timeSpent = 30 - timeLeft;
    const timeInMinutes = timeSpent / 60;

    const finalWPM = timeInMinutes > 0 ? Math.round((totalCorrect / 5) / timeInMinutes) : 0;
    const finalAccuracy = totalTyped > 0 ? Math.round((totalCorrect / totalTyped) * 100) : 0;

    setWpm(finalWPM);
    setAccuracy(finalAccuracy);
    setIsFinished(true);
  };

  const resetGame = () => {
    setUserInput('');
    setStarted(false);
    setIsFinished(false);
    setTimeLeft(30);
    setCorrectCharsTotal(0);
    setTypedCharsTotal(0);
    setWpm(0);
    setAccuracy(0);
    setCurrentSentenceIndex(0);
    setCurrentSentence(shuffledSentences[0]);
    setNickname('');
    setScoreSaved(false);
  };

   const saveScore = async () => {
    if (!nickname.trim()) return alert('Please add a nickname');
    setIsSaving(true);
    const { error } = await supabase.from('leaderboard').insert([{
      username: nickname.trim(),
      wpm,
      accuracy,
    }]);
    setIsSaving(false);
    if (error) alert('Error: ' + error.message);
    else {
      setScoreSaved(true);
      fetchLeaderboard(); // refresh leaderboard after save
    }
  };
  return (
  <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 py-10 text-white relative">
    <h1 className="text-5xl font-bold mb-8 heading-font text-yellow-400 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>🔥 KeyCrush ⌨️</h1>

    <div className="mb-4" style={{backgroundColor:'black',padding:'10px', borderRadius:'10px', boxShadow:'0 4px 20px rgba(0,0,0,0.5)'}}>
      <label className="mr-2 text-yellow-300" style={{ fontFamily: 'comic sans ms' }}>🔊 Typing Sound</label>
      <input type="checkbox" checked={soundOn} onChange={() => setSoundOn(!soundOn)} />
    </div>

    <div className="bg-gray-900 p-6 rounded-xl w-full max-w-3xl text-lg mb-4 shadow-lg border border-yellow-400">
      <div className="text-center text-xl font-mono mb-2 flex flex-wrap justify-center">
        {currentSentence.split('').map((char, idx) => {
          const className = idx < userInput.length
            ? (userInput[idx] === char ? 'text-green-400' : 'text-red-400')
            : 'text-gray-400';
          return (
            <span key={idx} className={className}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </div>
    </div>

    <input
      type="text"
      value={userInput}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={isFinished}
      placeholder="Type here and press Enter..."
      className="w-full max-w-3xl px-4 py-3 text-lg rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all mb-4"
    />

    <p className="text-lg text-yellow-300 mb-6" style={{ fontFamily: 'Georgia, serif' }} >
      ⏱ Time Left: <span className="font-bold" style={{ fontFamily: 'arial' }}>{timeLeft}s</span>
    </p>

    {isFinished && (
      <div className="bg-gray-800 rounded-xl p-6 shadow-md text-center space-y-4 w-full max-w-sm border border-green-400">
        <p className="text-xl font-semibold text-green-300" style={{ fontFamily: 'Georgia, serif' }}>✅ Time’s up!</p>
        <p className="text-lg" style={{ fontFamily: 'Georgia, serif' }}>🧠 WPM: <span className="text-yellow-300 font-bold">{wpm}</span></p>
        <p className="text-lg" style={{ fontFamily: 'Georgia, serif' }}>🎯 Accuracy: <span className="text-yellow-300 font-bold">{accuracy}%</span></p>

       {!scoreSaved && (
  <>
    <input
      type="text"
      placeholder="Enter your nickname"
      value={nickname}
      onChange={(e) => setNickname(e.target.value)}
      className="w-full px-3 py-2 rounded bg-[#f5f5f5] text-black focus:outline-none"
      disabled={isSaving}
    />
    <button
      onClick={saveScore}
      disabled={isSaving}
      className="mt-2 px-6 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition disabled:opacity-50"
    >
      {isSaving ? 'Saving... Please wait' : 'Save Score'}
    </button>
  </>
)}

        {scoreSaved && (
          <div className="space-y-3">
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-green-400 text-black rounded-lg font-semibold hover:bg-green-300 transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    )}

    {/* Leaderboard popup at top right */}
    <div className="fixed top-6 right-6 bg-gray-900 bg-opacity-90 border border-yellow-400 rounded-lg p-4 w-48 shadow-lg z-50 text-yellow-300">
      <h3 className="text-lg font-bold mb-2 text-yellow-400 border-b border-yellow-400 pb-1">🏆 Leaderboard</h3>
      {leaderboard.length === 0 ? (
        <p className="text-sm italic">No scores yet</p>
      ) : (
        leaderboard.map(({ username, wpm }, idx) => (
          <div key={idx} className="flex justify-between mb-1 last:mb-0">
            <span>{username}</span>
            <span className="font-bold">{wpm} WPM</span>
          </div>
        ))
      )}
    </div>
  </div>
);

}
