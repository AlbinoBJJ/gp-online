import { useEffect, useRef } from 'react';
import * as alphaTab from '@coderline/alphatab';
import { AnacrusisGuard, type AnacrusisCheckResult } from '@gp-online/core';

interface PlayerProps {
  soundFontUrl: string;
  onApiReady: (api: alphaTab.AlphaTabApi) => void;
  onScoreLoaded: (score: alphaTab.model.Score, anacrusisResult: AnacrusisCheckResult) => void;
  onPlayerStateChanged: (isPlaying: boolean) => void;
  onRenderStatusChange: (isLoading: boolean) => void;
}

export function PlayerCanvas({
  soundFontUrl,
  onApiReady,
  onScoreLoaded,
  onPlayerStateChanged,
  onRenderStatusChange
}: PlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<alphaTab.AlphaTabApi | null>(null);
  
  // Armazena a última partitura carregada em buffer para re-renderizar ao trocar o soundfont
  const lastScoreBufferRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return;

    const api = new alphaTab.AlphaTabApi(containerRef.current, {
      core: {
        fontDirectory: `${import.meta.env.BASE_URL}font/`,
        scriptFile: `${import.meta.env.BASE_URL}assets/alphaTab.worker.mjs`,
        engine: 'svg'
      },
      player: {
        enablePlayer: true,
        enableCursor: true,
        scrollElement: wrapperRef.current,
        soundFont: soundFontUrl
      }
    });

    apiRef.current = api;

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

    // Intercepta o carregamento de arquivos para salvar o buffer na referência
    const originalLoad = api.load.bind(api);
    api.load = (data: Uint8Array) => {
      lastScoreBufferRef.current = data;
      return originalLoad(data);
    };

    onApiReady(api);

    return () => {
      api.destroy();
      apiRef.current = null;
    };
  }, [soundFontUrl]); // Recria a API de forma limpa quando o SoundFont muda, restaurando a música em seguida

  // Se houver uma música carregada e o soundFontUrl mudar, re-carrega o buffer automaticamente
  useEffect(() => {
    if (apiRef.current && lastScoreBufferRef.current) {
      apiRef.current.load(lastScoreBufferRef.current);
    }
  }, [soundFontUrl]);

  return (
    <div
      ref={wrapperRef}
      className="alphaTab"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        minHeight: '500px',
        height: 'calc(100vh - 160px)',
        overflowY: 'auto',
        overflowX: 'auto',
        position: 'relative'
      }}
    >
      <div ref={containerRef} style={{ width: '100%', minHeight: '100%' }} />
    </div>
  );
}