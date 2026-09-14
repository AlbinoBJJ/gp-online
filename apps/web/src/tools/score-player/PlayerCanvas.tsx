import { useEffect, useRef } from 'react';
import * as alphaTab from '@coderline/alphatab';
import { AnacrusisGuard, type AnacrusisCheckResult } from '@gp-online/core';

interface PlayerProps {
  onApiReady: (api: alphaTab.AlphaTabApi) => void;
  onScoreLoaded: (score: alphaTab.model.Score, anacrusisResult: AnacrusisCheckResult) => void;
  onPlayerStateChanged: (isPlaying: boolean) => void;
  onRenderStatusChange: (isLoading: boolean) => void;
}

export function PlayerCanvas({
  onApiReady,
  onScoreLoaded,
  onPlayerStateChanged,
  onRenderStatusChange
}: PlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return;

    const api = new alphaTab.AlphaTabApi(containerRef.current, {
      core: {
        fontDirectory: '/font/',
        engine: 'svg'
      },
      player: {
        enablePlayer: true,
        enableCursor: true,
        scrollElement: wrapperRef.current,

        soundFont: '/soundfont/FluidR3_GM.sf2' 
        // Ou CDN alternativo de alta fidelidade:
        // soundFont: 'https://raw.githubusercontent.com/CoderLine/alphaTab/master/test/soundfonts/sonivox.sf2'
      }
    });

    api.scoreLoaded.on((score) => {
      const anacrusisResult = AnacrusisGuard.inspect(score);
      onScoreLoaded(score, anacrusisResult);
    });

    api.playerStateChanged.on((args) => {
      onPlayerStateChanged(args.state === 1);
    });

    api.renderStarted.on(() => {
      onRenderStatusChange(true);
    });

    api.renderFinished.on(() => {
      onRenderStatusChange(false);
    });

    onApiReady(api);

    return () => {
      api.destroy();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="alphaTab"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        minHeight: '400px',
        height: 'calc(100vh - 180px)',
        overflow: 'auto',
        position: 'relative'
      }}
    >
      <div ref={containerRef} style={{ width: '100%' }} />
    </div>
  );
}