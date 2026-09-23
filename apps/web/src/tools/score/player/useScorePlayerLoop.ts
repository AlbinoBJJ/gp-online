import { useState } from 'react';
import * as alphaTab from '@coderline/alphatab';

export function useScorePlayerLoop(api: alphaTab.AlphaTabApi | null, setPlaybackSpeed: (speed: number) => void) {
  const [isLoopEnabled, setIsLoopEnabled] = useState<boolean>(false);
  const [isLoopModalOpen, setIsLoopModalOpen] = useState<boolean>(false);
  const [loopStartBar, setLoopStartBar] = useState<number>(1);
  const [loopEndBar, setLoopEndBar] = useState<number>(4);
  const [totalBars, setTotalBars] = useState<number>(1);
  const [autoAccelerate, setAutoAccelerate] = useState<boolean>(false);
  const [startSpeed, setStartSpeed] = useState<number>(0.6);
  const [targetSpeed, setTargetSpeed] = useState<number>(1.0);
  const [speedStep, setSpeedStep] = useState<number>(0.05);

  const applyLoopSettings = () => {
    if (!api || !api.score) return;

    if (isLoopEnabled) {
      api.isLooping = true;
      const startBarIndex = Math.max(0, loopStartBar - 1);
      const endBarIndex = Math.min(api.score.masterBars.length - 1, loopEndBar - 1);

      const startTick = api.score.masterBars[startBarIndex]?.start || 0;
      const endBar = api.score.masterBars[endBarIndex];
      const endTick = endBar ? endBar.start + endBar.calculateDuration() : 0;

      api.playbackRange = { startTick, endTick };

      if (autoAccelerate) {
        setPlaybackSpeed(startSpeed);
        api.playbackSpeed = startSpeed;
      }
    } else {
      api.isLooping = false;
      api.playbackRange = null;
    }
  };

  const toggleLoop = () => {
    const nextState = !isLoopEnabled;
    setIsLoopEnabled(nextState);
    if (api) {
      api.isLooping = nextState;
      if (!nextState) {
        api.playbackRange = null;
      } else {
        applyLoopSettings();
      }
    }
  };

  return {
    isLoopEnabled,
    setIsLoopEnabled,
    isLoopModalOpen,
    setIsLoopModalOpen,
    loopStartBar,
    setLoopStartBar,
    loopEndBar,
    setLoopEndBar,
    totalBars,
    setTotalBars,
    autoAccelerate,
    setAutoAccelerate,
    startSpeed,
    setStartSpeed,
    targetSpeed,
    setTargetSpeed,
    speedStep,
    setSpeedStep,
    toggleLoop,
    applyLoopSettings
  };
}