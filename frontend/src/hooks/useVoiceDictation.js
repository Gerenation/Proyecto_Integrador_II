import { useEffect, useRef, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

/** Detiene el micrófono al desmontar (ej. al cambiar de pestaña de modo). */
function useStopListeningOnUnmount() {
  useEffect(() => {
    return () => {
      SpeechRecognition.stopListening().catch(() => {});
    };
  }, []);
}

/** Colombia por defecto; el navegador puede usar acento local. */
const REC_LANG = 'es-CO';

/**
 * Dictado por voz: actualiza el texto en tiempo real mientras escucha.
 * @param {string} value - valor actual del campo
 * @param {(next: string) => void} setValue - setter estable (ej. setState)
 */
export function useVoiceDictation(value, setValue) {
  useStopListeningOnUnmount();

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const prefixRef = useRef('');

  const startListening = useCallback(async () => {
    prefixRef.current = value.trim() ? `${value.trim()} ` : '';
    resetTranscript();
    await SpeechRecognition.startListening({
      continuous: true,
      language: REC_LANG
    });
  }, [value, resetTranscript]);

  const stopListening = useCallback(async () => {
    await SpeechRecognition.stopListening();
  }, []);

  useEffect(() => {
    if (!listening) return;
    setValue(prefixRef.current + transcript);
  }, [transcript, listening, setValue]);

  return {
    listening,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition
  };
}
