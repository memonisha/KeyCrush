'use client';

import dynamic from 'next/dynamic';

const TypingGame = dynamic(() => import('../../components/TypingGame'), { ssr: false });

export default function GamePage() {
  return <TypingGame />;
}