# フォルダ構造の理想像

このドキュメントでは、理想的なフォルダ構造と、各ディレクトリの役割・配置基準について書く。

---

## 全体構造

```
src/
├── apps/                          # アプリケーション層
│   ├── home/                      # ホームアプリ
│   │   └── ...
│   ├── record/                    # 録音アプリ（独立したWebアプリ）
│   │   ├── pages/                 # ページコンポーネント
│   │   ├── hooks/                 # アプリ固有のフック
│   │   ├── utils/                 # アプリ固有のユーティリティ
│   │   └── ...
│   ├── edit/                      # 編集アプリ（独立したWebアプリ）
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── ...
│   └── demo/                      # デモアプリ（開発時のみ）
│
├── shared/                        # 共通層（複数アプリで共有）
│   ├── components/                # 共通コンポーネント
│   ├── hooks/                     # 共通フック
│   ├── utils/                     # 共通ユーティリティ
│   └── ...
│
├── router.tsx                     # ルートルーター
├── main.tsx                       # エントリーポイント
└── theme.ts                       # テーマ設定
```

---

## アプリケーション層 (`apps/`)

### ディレクトリ構造

```
apps/
└── {app-name}/                    # アプリ名（kebab-case）
    │
    ├── pages/                     # ページコンポーネント
    │   └── {page-name}/           # ページ単位のディレクトリ
    │       ├── {PageName}Page.tsx # メインのページコンポーネント
    │       └── components/        # このページ専用のコンポーネント
    │
    ├── hooks/                     # アプリ固有のカスタムフック
    │   └── use{FeatureName}.ts
    │
    ├── utils/                     # アプリ固有のユーティリティ関数
    │   └── {utilityName}.ts
    │
    ├── types/                     # アプリ固有の型定義
    │   └── {typeName}.ts
    │
    ├── components/                # アプリ全体で使用するUIコンポーネント（ページ共通）
    │   └── {ComponentName}.tsx
    │
    ├── constants/                 # アプリ固有の定数
    │   └── {constantName}.ts
    │
    ├── services/                  # アプリ固有のサービス（API通信など）
    │   └── {serviceName}.ts
    │
    ├── store/                     # アプリ固有の状態管理（必要な場合）
    │   └── {storeName}.ts
    │
    └── router.tsx                 # アプリ内のルーティング定義
```

```
apps/
└── record/
    ├── pages/
    │   └── record-page/
    │       ├── RecordPage.tsx
    │       └── components/        # RecordPageでのみ使用するコンポーネント
    │           ├── Card.tsx
    │           ├── NavigationButton.tsx
    │           ├── Progress.tsx
    │           └── TextDisplay.tsx
    │
    ├── hooks/                     # アプリ全体で使用するフック
    │   ├── useAudioRecorder.ts
    │   └── useTextSegments.ts
    │
    ├── utils/                     # アプリ全体で使用するユーティリティ
    │   └── audioProcessor.ts
    │
    ├── types/                     # アプリ全体で使用する型定義
    │   └── textSegment.ts
    │
    ├── constants/                 # アプリ全体で使用する定数
    │   └── audio.ts
    │
    └── router.tsx
```

---

## 共通層 (`shared/`)

複数のページ（例：record と edit）で使用される、汎用的なコードを配置。

### ディレクトリ構造

```
shared/
├── components/                    # 共通コンポーネント
│   ├── ui/                        # 基本UIパーツ（ボタン、入力フォームなど）
│   │   ├── Button/
│   │   ├── Input/
│   │   └── ...
│   ├── layout/                    # 共通レイアウト（ヘッダー、フッターなど）
│   │   ├── AppLayout/
│   │   └── ...
│   └── common/                    # その他汎用コンポーネント
│
├── hooks/                         # 共通フック（ローカルストレージ、デバイス制御など）
│   ├── useLocalStorage.ts
│   └── ...
│
├── utils/                         # 共通ユーティリティ（日付操作、バリデーションなど）
│   └── ...
│
├── types/                         # 共通型定義（APIレスポンス型など）
│   └── ...
│
└── constants/                     # 共通定数（設定値など）
    └── ...
```

---

## ディレクトリ命名規則

一貫性のある命名規則を採用することで、コードの可読性を高めます。

| 種類                       | 命名規則   | 例                                         |
| -------------------------- | ---------- | ------------------------------------------ |
| アプリディレクトリ         | kebab-case | `record/`, `edit/`                         |
| ページディレクトリ         | kebab-case | `record-page/`, `edit-page/`               |
| コンポーネントディレクトリ | PascalCase | `Button/`, `AudioRecorder/`                |
| 機能・ファイル名           | camelCase  | `useAudioRecorder.ts`, `audioProcessor.ts` |
| コンポーネントファイル     | PascalCase | `Button.tsx`, `RecordPage.tsx`             |

---
