import * as alphaTab from '@coderline/alphatab';

export interface AnacrusisCheckResult {
  hasAnacrusis: boolean;
  expectedDurationTicks: number;
  actualDurationTicks: number;
}

export class AnacrusisGuard {
  /**
   * Examina o primeiro compasso da partitura para identificar se a soma das notas
   * é menor que a duração total exigida pela fórmula de compasso (Anacruse).
   */
  public static inspect(score: alphaTab.model.Score): AnacrusisCheckResult {
    if (!score.tracks.length || !score.tracks[0].staves.length) {
      return { hasAnacrusis: false, expectedDurationTicks: 0, actualDurationTicks: 0 };
    }

    const firstMeasure = score.tracks[0].staves[0].bars[0];
    if (!firstMeasure || !firstMeasure.masterBar) {
      return { hasAnacrusis: false, expectedDurationTicks: 0, actualDurationTicks: 0 };
    }

    // Fórmula de compasso obtida do MasterBar associado
    const numerator = firstMeasure.masterBar.timeSignatureNumerator;
    const denominator = firstMeasure.masterBar.timeSignatureDenominator;

    // Cálculo da duração total esperada em ticks (padrão AlphaTab: Quarter = 960 ticks)
    const quarterTicks = 960;
    const expectedDurationTicks = (numerator * (4 / denominator)) * quarterTicks;

    // Soma da duração de todos os eventos/notas presentes na primeira voz do primeiro compasso
    let actualDurationTicks = 0;
    const firstVoice = firstMeasure.voices[0];

    if (firstVoice && firstVoice.beats) {
      for (const beat of firstVoice.beats) {
        actualDurationTicks += beat.playbackDuration;
      }
    }

    const hasAnacrusis = actualDurationTicks < expectedDurationTicks;

    return {
      hasAnacrusis,
      expectedDurationTicks,
      actualDurationTicks
    };
  }
}