import React, { useEffect, useRef } from 'react';

interface SoundManagerProps {
  started: boolean;
  triggerScream?: boolean;
  onScreamComplete?: () => void;
  finalDecision?: 'YES' | 'NO' | null;
}

const AUDIO_FILE = "/meera-audio.mp3"; 

export const SoundManager: React.FC<SoundManagerProps> = ({ started, triggerScream, onScreamComplete }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (started && !audioRef.current) {
      // Create audio object
      const audio = new Audio(AUDIO_FILE);
      audio.loop = true;
      audio.volume = 0.6;
      audioRef.current = audio;

      // Attempt playback - this will work because started is only true after user interaction
      audio.play().catch(err => {
        console.error("Audio playback failed:", err);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [started]);

  // Handle scream effect
  useEffect(() => {
    if (triggerScream && audioRef.current) {
      // Temporarily lower volume for scream effect
      const originalVolume = audioRef.current.volume;
      audioRef.current.volume = 0.3;
      
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.volume = originalVolume;
        }
        if (onScreamComplete) {
          onScreamComplete();
        }
      }, 300);
    }
  }, [triggerScream, onScreamComplete]);

  return null;
};
