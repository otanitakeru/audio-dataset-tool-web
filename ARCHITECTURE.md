# Audio Dataset Tool - アーキテクチャガイド

このドキュメントは、Record アプリと Cut アプリを別の Web アプリとして開発するためのベストプラクティスとアーキテクチャガイドラインを提供します。

## 目次

- [アーキテクチャ概要](#アーキテクチャ概要)
- [フォルダ構造](#フォルダ構造)
- [ルーティング戦略](#ルーティング戦略)
- [命名規則](#命名規則)
- [型定義](#型定義)
- [環境設定](#環境設定)
- [状態管理](#状態管理)
- [開発ワークフロー](#開発ワークフロー)

---

## アーキテクチャ概要

本プロジェクトは **Feature-Based Monolith** アーキテクチャを採用しています。Record アプリと Cut アプリを完全に分離しながら、共通コードを効率的に再利用できる構造になっています。

### 主要な設計原則

1. **アプリケーション分離**: 各アプリ（Record/Cut）は独立したモジュールとして管理
2. **共通コードの再利用**: `shared`ディレクトリで共通コンポーネント・ユーティリティを集約
3. **型安全性**: TypeScript の厳格な型定義とパスエイリアスの活用
4. **パフォーマンス最適化**: Code splitting、Lazy loading、Manual chunks の設定
5. **スケーラビリティ**: 将来的な機能追加に対応できる拡張可能な構造

---

## フォルダ構造

```
src/
├── apps/                          # 各アプリケーション
│   ├── record/                    # 録音アプリ
│   │   ├── components/
│   │   │   ├── ui/               # Record固有のUIコンポーネント
│   │   │   ├── features/         # 機能別コンポーネント
│   │   │   │   ├── AudioRecorder/
│   │   │   │   ├── Transcription/
│   │   │   │   └── TextSegmentation/
│   │   │   └── layout/
│   │   ├── pages/
│   │   │   ├── RecordPage/
│   │   │   ├── HistoryPage/
│   │   │   └── SettingsPage/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── constants/
│   │   ├── services/             # API通信など
│   │   ├── store/                # 状態管理（必要な場合）
│   │   └── router.tsx            # Recordアプリのルーティング
│   │
│   └── cut/                       # カットアプリ
│       ├── components/
│       │   ├── ui/
│       │   ├── features/
│       │   │   ├── AudioEditor/
│       │   │   ├── Timeline/
│       │   │   └── Waveform/
│       │   └── layout/
│       ├── pages/
│       │   ├── EditorPage/
│       │   ├── LibraryPage/
│       │   └── ExportPage/
│       ├── hooks/
│       ├── utils/
│       ├── types/
│       ├── constants/
│       ├── services/
│       ├── store/
│       └── router.tsx
│
├── shared/                        # 共通モジュール
│   ├── components/
│   │   ├── ui/                   # 共通UIコンポーネント
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── Card/
│   │   ├── layout/               # 共通レイアウト
│   │   │   ├── AppLayout/
│   │   │   ├── Header/
│   │   │   └── Sidebar/
│   │   └── common/               # その他共通コンポーネント
│   ├── hooks/                    # 共通フック
│   │   ├── useAudioContext.ts
│   │   ├── useLocalStorage.ts
│   │   └── useMediaDevices.ts
│   ├── utils/                    # 共通ユーティリティ
│   │   ├── audio/
│   │   │   ├── audioProcessor.ts
│   │   │   └── formatConverter.ts
│   │   ├── validation/
│   │   └── formatters/
│   ├── types/                    # 共通型定義
│   │   ├── audio.ts
│   │   ├── common.ts
│   │   └── api.ts
│   ├── constants/                # 共通定数
│   │   ├── audio.ts
│   │   └── config.ts
│   ├── services/                 # 共通サービス
│   │   ├── api/
│   │   └── storage/
│   └── theme/                    # テーマ設定
│       ├── theme.ts
│       └── tokens.ts
│
├── router.tsx                     # ルートルーター
└── main.tsx                      # エントリーポイント
```

### ディレクトリの役割

#### `src/apps/`

各アプリケーション（Record/Cut）を完全に独立したモジュールとして管理。アプリ固有のコンポーネント、ページ、ロジックを含む。

#### `src/shared/`

両アプリで共有される再利用可能なコード。UI コンポーネント、フック、ユーティリティ、型定義などを含む。

---

## ルーティング戦略

### 1. メインルーター（`src/router.tsx`）

```typescript
import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

// Lazy load各アプリケーション
const RecordApp = lazy(() => import("./apps/record/router"));
const CutApp = lazy(() => import("./apps/cut/router"));

// ローディングコンポーネント
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* ルートパスはrecordにリダイレクト */}
        <Route path="/" element={<Navigate to="/record" replace />} />

        {/* Recordアプリケーション */}
        <Route path="/record/*" element={<RecordApp />} />

        {/* Cutアプリケーション */}
        <Route path="/cut/*" element={<CutApp />} />

        {/* 404ページ */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
```

### 2. Record アプリルーター（`src/apps/record/router.tsx`）

```typescript
import { lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import RecordLayout from "./components/layout/RecordLayout";

// Lazy load各ページ
const RecordPage = lazy(() => import("./pages/RecordPage/RecordPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage/HistoryPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage/SettingsPage"));

const RecordRouter = () => {
  return (
    <RecordLayout>
      <Routes>
        {/* デフォルトルート */}
        <Route index element={<Navigate to="record" replace />} />

        {/* 録音ページ */}
        <Route path="record" element={<RecordPage />} />

        {/* 履歴ページ */}
        <Route path="history" element={<HistoryPage />} />

        {/* 設定ページ */}
        <Route path="settings" element={<SettingsPage />} />

        {/* デモページ（開発時のみ） */}
        {import.meta.env.DEV && (
          <Route path="demo">
            <Route
              path="button"
              element={lazy(() => import("./pages/demo/ButtonDemo"))}
            />
            <Route
              path="text-viewer"
              element={lazy(() => import("./pages/demo/TextViewer"))}
            />
          </Route>
        )}
      </Routes>
    </RecordLayout>
  );
};

export default RecordRouter;
```

### 3. Cut アプリルーター（`src/apps/cut/router.tsx`）

```typescript
import { lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import CutLayout from "./components/layout/CutLayout";

const EditorPage = lazy(() => import("./pages/EditorPage/EditorPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage/LibraryPage"));
const ExportPage = lazy(() => import("./pages/ExportPage/ExportPage"));

const CutRouter = () => {
  return (
    <CutLayout>
      <Routes>
        <Route index element={<Navigate to="editor" replace />} />
        <Route path="editor" element={<EditorPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="export" element={<ExportPage />} />
      </Routes>
    </CutLayout>
  );
};

export default CutRouter;
```

### URL 構造

```
/                           → /record（リダイレクト）
/record                     → /record/record（リダイレクト）
/record/record              → 録音ページ
/record/history             → 履歴ページ
/record/settings            → 設定ページ
/record/demo/button         → ボタンデモ（開発時のみ）
/record/demo/text-viewer    → テキストビューワーデモ（開発時のみ）

/cut                        → /cut/editor（リダイレクト）
/cut/editor                 → エディターページ
/cut/library                → ライブラリページ
/cut/export                 → エクスポートページ
```

---

## 命名規則

### ファイル・フォルダ命名

```typescript
// ✅ Good
src / apps / record / components / features / AudioRecorder / AudioRecorder.tsx;
src /
  apps /
  record /
  components /
  features /
  AudioRecorder /
  useAudioRecorder.ts;
src /
  apps /
  record /
  components /
  features /
  AudioRecorder /
  AudioRecorder.styles.ts;
src / apps / record / components / features / AudioRecorder / index.ts;

// ✅ Good - Index export
// src/apps/record/components/features/AudioRecorder/index.ts
export { AudioRecorder } from "./AudioRecorder";
export { useAudioRecorder } from "./useAudioRecorder";
export type { AudioRecorderProps } from "./AudioRecorder";

// ❌ Bad
src / record - audio - recorder.tsx;
src / audioRecorder.component.tsx;
```

### 命名規則一覧

| 種類           | 命名規則                              | 例                                          |
| -------------- | ------------------------------------- | ------------------------------------------- |
| コンポーネント | PascalCase                            | `Button.tsx`, `AudioRecorder.tsx`           |
| ページ         | PascalCase + "Page"                   | `RecordPage.tsx`, `EditorPage.tsx`          |
| フック         | camelCase + "use" prefix              | `useAudioRecorder.ts`, `useMediaDevices.ts` |
| ユーティリティ | camelCase                             | `audioProcessor.ts`, `formatters.ts`        |
| 型定義         | PascalCase (types), camelCase (files) | `audio.ts` (file), `AudioMetadata` (type)   |
| 定数ファイル   | camelCase                             | `audio.ts`, `config.ts`                     |
| 定数変数       | UPPER_SNAKE_CASE                      | `MAX_FILE_SIZE`, `DEFAULT_BUFFER_SIZE`      |
| フォルダ       | kebab-case                            | `audio-recorder/`, `text-viewer/`           |

### コンポーネント命名

```typescript
// ✅ Good - 明確で説明的
<AudioRecorder />
<TranscriptionPanel />
<WaveformVisualizer />
<RecordButton />

// ❌ Bad - 曖昧
<Component1 />
<Audio />
<Panel />
```

### Hook 命名

```typescript
// ✅ Good
useAudioRecorder();
useMediaDevices();
useTranscription();
useWaveformData();

// ❌ Bad
audioRecorder();
getDevices();
transcribe();
```

### 定数命名

```typescript
// src/apps/record/constants/audio.ts
export const AUDIO_CONSTANTS = {
  SAMPLE_RATE: 44100,
  BIT_DEPTH: 16,
  CHANNELS: 2,
  MAX_DURATION: 3600, // 1 hour in seconds
} as const;

export const SUPPORTED_FORMATS = ["mp3", "wav", "ogg", "flac"] as const;
export type AudioFormat = (typeof SUPPORTED_FORMATS)[number];

// ✅ UPPER_SNAKE_CASE for constants
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const DEFAULT_BUFFER_SIZE = 4096;
```

---

## 型定義

### 共通型定義（`src/shared/types/audio.ts`）

```typescript
export interface AudioMetadata {
  duration: number;
  sampleRate: number;
  channels: number;
  bitDepth: number;
  format: AudioFormat;
}

export interface AudioSegment {
  id: string;
  startTime: number;
  endTime: number;
  text?: string;
  speaker?: string;
}

export interface RecordingSession {
  id: string;
  startedAt: Date;
  endedAt?: Date;
  audioData: Blob;
  metadata: AudioMetadata;
  segments: AudioSegment[];
}
```

### アプリ固有の型定義（`src/apps/record/types/record.ts`）

```typescript
export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  level: number; // Audio level 0-1
}

export interface RecorderConfig {
  deviceId?: string;
  sampleRate: number;
  channels: number;
  autoStop?: number; // Auto-stop after N seconds
}
```

### 型定義のベストプラクティス

1. **共通型は`shared/types/`に配置**
2. **アプリ固有の型は各アプリの`types/`に配置**
3. **インターフェースを優先**（拡張性のため）
4. **`as const`で定数配列から型を生成**
5. **Utility Types を活用**（`Partial`, `Pick`, `Omit`など）

---

## 環境設定

### Vite 設定（`vite.config.ts`）

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@record": path.resolve(__dirname, "./src/apps/record"),
      "@cut": path.resolve(__dirname, "./src/apps/cut"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-mui": ["@mui/material", "@emotion/react", "@emotion/styled"],
          "app-record": ["./src/apps/record/router.tsx"],
          "app-cut": ["./src/apps/cut/router.tsx"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### TypeScript 設定（`tsconfig.json`）

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["./src/shared/*"],
      "@record/*": ["./src/apps/record/*"],
      "@cut/*": ["./src/apps/cut/*"]
    }
  },
  "include": ["src"]
}
```

### package.json スクリプト

```json
{
  "scripts": {
    "dev": "vite",
    "dev:record": "vite --open /record",
    "dev:cut": "vite --open /cut",
    "build": "tsc -b && vite build",
    "build:analyze": "tsc -b && vite build --mode analyze",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

### パスエイリアスの使用例

```typescript
// ✅ Good - パスエイリアス使用
import { Button } from "@shared/components/ui/Button";
import { useAudioRecorder } from "@record/hooks/useAudioRecorder";
import { AudioProcessor } from "@shared/utils/audio/audioProcessor";

// ❌ Bad - 相対パス
import { Button } from "../../../shared/components/ui/Button";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";
```

---

## 状態管理

### オプション 1: Context API（シンプルなアプリ向け）

```typescript
// src/apps/record/store/RecordContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { RecordingSession } from "@shared/types/audio";

interface RecordContextValue {
  sessions: RecordingSession[];
  currentSession: RecordingSession | null;
  startRecording: () => void;
  stopRecording: () => void;
  pauseRecording: () => void;
}

const RecordContext = createContext<RecordContextValue | undefined>(undefined);

export const RecordProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<RecordingSession[]>([]);
  const [currentSession, setCurrentSession] = useState<RecordingSession | null>(
    null
  );

  const startRecording = () => {
    // Implementation...
  };

  const stopRecording = () => {
    // Implementation...
  };

  const pauseRecording = () => {
    // Implementation...
  };

  return (
    <RecordContext.Provider
      value={{
        sessions,
        currentSession,
        startRecording,
        stopRecording,
        pauseRecording,
      }}
    >
      {children}
    </RecordContext.Provider>
  );
};

export const useRecord = () => {
  const context = useContext(RecordContext);
  if (!context) {
    throw new Error("useRecord must be used within RecordProvider");
  }
  return context;
};
```

### オプション 2: Zustand（中規模アプリ向け）

```typescript
// src/apps/record/store/useRecordStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface RecordStore {
  isRecording: boolean;
  sessions: RecordingSession[];
  startRecording: () => void;
  stopRecording: () => void;
  addSession: (session: RecordingSession) => void;
}

export const useRecordStore = create<RecordStore>()(
  devtools(
    persist(
      (set) => ({
        isRecording: false,
        sessions: [],
        startRecording: () => set({ isRecording: true }),
        stopRecording: () => set({ isRecording: false }),
        addSession: (session) =>
          set((state) => ({ sessions: [...state.sessions, session] })),
      }),
      { name: "record-store" }
    )
  )
);
```

### 状態管理の選択基準

| 状況                                 | 推奨          |
| ------------------------------------ | ------------- |
| シンプルなアプリ、少ない状態         | Context API   |
| 中規模アプリ、複雑な状態             | Zustand       |
| 大規模アプリ、複雑なビジネスロジック | Redux Toolkit |

---

## 共通コンポーネントの実装

### Button コンポーネント

```typescript
// src/shared/components/ui/Button/Button.tsx
import {
  ButtonProps as MuiButtonProps,
  Button as MuiButton,
} from "@mui/material";
import { forwardRef } from "react";

export interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading, disabled, children, ...props }, ref) => {
    return (
      <MuiButton ref={ref} disabled={disabled || loading} {...props}>
        {loading ? "Loading..." : children}
      </MuiButton>
    );
  }
);

Button.displayName = "Button";

// src/shared/components/ui/Button/index.ts
export { Button } from "./Button";
export type { ButtonProps } from "./Button";
```

### ナビゲーションコンポーネント

```typescript
// src/shared/components/layout/AppNavigation/AppNavigation.tsx
import { Link, useLocation } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import ContentCutIcon from "@mui/icons-material/ContentCut";

export const AppNavigation = () => {
  const location = useLocation();
  const currentApp = location.pathname.split("/")[1];

  return (
    <Tabs value={currentApp}>
      <Tab
        label="Record"
        value="record"
        icon={<MicIcon />}
        component={Link}
        to="/record"
      />
      <Tab
        label="Cut"
        value="cut"
        icon={<ContentCutIcon />}
        component={Link}
        to="/cut"
      />
    </Tabs>
  );
};
```

---

## 開発ワークフロー

### Git ブランチ戦略

```
main                    # 本番環境
├── develop            # 開発環境
    ├── feature/record-* # Record機能
    └── feature/cut-*    # Cut機能
```

### ブランチ命名規則

```bash
feature/record-audio-recording
feature/cut-waveform-editor
fix/record-microphone-permission
refactor/shared-button-component
docs/architecture-guide
test/record-audio-processor
```

### コミットメッセージ規約

```
feat(record): add audio recording functionality
fix(cut): resolve waveform rendering issue
refactor(shared): improve button component
docs(readme): update architecture documentation
test(record): add unit tests for audio processor
chore(deps): update dependencies
style(record): format code with prettier
perf(cut): optimize waveform rendering
```

### 開発コマンド

```bash
# 開発サーバー起動
npm run dev                # 通常起動
npm run dev:record         # Recordアプリを開いて起動
npm run dev:cut           # Cutアプリを開いて起動

# ビルド
npm run build             # 本番ビルド
npm run build:analyze     # バンドルサイズ分析付きビルド

# コード品質
npm run lint              # Lint実行
npm run lint:fix          # Lint自動修正
npm run type-check        # 型チェック

# テスト
npm run test              # テスト実行
npm run test:ui           # テストUIで実行
```

---

## ベストプラクティスチェックリスト

### コンポーネント開発

- [ ] コンポーネントは単一責任の原則に従っている
- [ ] 適切な型定義がされている
- [ ] props にデフォルト値が設定されている
- [ ] `forwardRef`を使用している（必要な場合）
- [ ] `displayName`を設定している
- [ ] `index.ts`でエクスポートしている

### ルーティング

- [ ] Lazy loading を使用している
- [ ] ローディングフォールバックを設定している
- [ ] 404 ページを設定している
- [ ] リダイレクトが適切に設定されている

### 状態管理

- [ ] アプリ固有の状態は各アプリ内で管理
- [ ] 共通の状態は適切に共有されている
- [ ] 不要な再レンダリングを避けている

### パフォーマンス

- [ ] Code splitting を活用している
- [ ] Lazy loading を適切に使用している
- [ ] バンドルサイズを監視している
- [ ] 不要な依存関係を含めていない

### 型安全性

- [ ] すべての props に型定義がある
- [ ] `any`型を使用していない
- [ ] 型アサーションは最小限
- [ ] 厳格な TypeScript 設定を使用

### コード品質

- [ ] Lint エラーがない
- [ ] 型チェックが通る
- [ ] 命名規則に従っている
- [ ] 適切なコメントがある
- [ ] テストが書かれている（重要な機能）

---

## トラブルシューティング

### パスエイリアスが解決できない

**解決策**: `tsconfig.json`と`vite.config.ts`の両方でパスを設定

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["./src/shared/*"]
    }
  }
}

// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
});
```

### Lazy loading でエラーが発生

**解決策**: `Suspense`でラップし、適切なフォールバックを設定

```typescript
<Suspense fallback={<LoadingSpinner />}>
  <Routes>{/* routes */}</Routes>
</Suspense>
```

### バンドルサイズが大きい

**解決策**: `vite.config.ts`で`manualChunks`を設定

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom'],
        'vendor-mui': ['@mui/material'],
      },
    },
  },
}
```

---

## 参考リンク

- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)

---

## まとめ

このアーキテクチャガイドに従うことで、以下のメリットが得られます：

1. **保守性**: 明確な構造により、コードの理解と保守が容易
2. **スケーラビリティ**: 新機能の追加が容易な拡張可能な設計
3. **再利用性**: 共通コードの効率的な再利用
4. **型安全性**: TypeScript による堅牢なコード
5. **パフォーマンス**: 最適化されたビルドとロード時間
6. **開発体験**: 明確なガイドラインによる効率的な開発

質問や追加の情報が必要な場合は、開発チームに相談してください。
