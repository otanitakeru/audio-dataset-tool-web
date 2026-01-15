import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface AudioBlobData {
  blob: Blob;
  url: string;
  mimeType: string;
  createdAt: Date;
}

interface AudioBlobContextValue {
  /** 現在保存されているオーディオBlob */
  audioBlob: AudioBlobData | null;
  /** オーディオBlobを保存する */
  setAudioBlob: (blob: Blob, mimeType?: string) => void;
  /** オーディオBlobをクリアする */
  clearAudioBlob: () => void;
  /** オーディオBlobが存在するか */
  hasAudioBlob: boolean;
}

const AudioBlobContext = createContext<AudioBlobContextValue | null>(null);

interface AudioBlobProviderProps {
  children: ReactNode;
}

export const AudioBlobProvider = ({ children }: AudioBlobProviderProps) => {
  const [audioBlob, setAudioBlobState] = useState<AudioBlobData | null>(null);
  const previousUrlRef = useRef<string | null>(null);

  const setAudioBlob = useCallback((blob: Blob, mimeType?: string) => {
    // 前のURLがあれば解放
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
    }

    const url = URL.createObjectURL(blob);
    previousUrlRef.current = url;

    setAudioBlobState({
      blob,
      url,
      mimeType: mimeType || blob.type || "audio/webm",
      createdAt: new Date(),
    });
  }, []);

  const clearAudioBlob = useCallback(() => {
    if (audioBlob?.url) {
      URL.revokeObjectURL(audioBlob.url);
    }
    if (previousUrlRef.current && previousUrlRef.current !== audioBlob?.url) {
      URL.revokeObjectURL(previousUrlRef.current);
    }
    previousUrlRef.current = null;
    setAudioBlobState(null);
  }, [audioBlob]);

  const value = useMemo<AudioBlobContextValue>(
    () => ({
      audioBlob,
      setAudioBlob,
      clearAudioBlob,
      hasAudioBlob: audioBlob !== null,
    }),
    [audioBlob, setAudioBlob, clearAudioBlob]
  );

  return (
    <AudioBlobContext.Provider value={value}>
      {children}
    </AudioBlobContext.Provider>
  );
};

export const useAudioBlob = (): AudioBlobContextValue => {
  const context = useContext(AudioBlobContext);
  if (!context) {
    throw new Error("useAudioBlob must be used within an AudioBlobProvider");
  }
  return context;
};
