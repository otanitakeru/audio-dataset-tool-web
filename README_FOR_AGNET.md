# Audio Dataset Tool

オーディオファイルのデータセット管理ツール

## 環境

- Node v24.11.1
- npm 11.6.2

## 技術スタック

- React 19
- TypeScript
- Vite
- ESLint

## プロジェクト構造

```
project-root/
├── src/
│   ├── components/          # 再利用可能なコンポーネント
│   │   ├── ui/             # 基本UIコンポーネント
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   ├── layout/         # レイアウト
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── index.ts
│   │   └── common/         # 汎用コンポーネント
│   │       ├── FileUploader.tsx    # ファイルアップロード
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       └── index.ts
│   │
│   ├── pages/              # ページコンポーネント
│   │   ├── Home/
│   │   │   ├── Home.tsx
│   │   │   ├── components/        # ページ固有のコンポーネント
│   │   │   │   ├── FileList.tsx
│   │   │   │   └── FilePreview.tsx
│   │   │   └── index.ts
│   │   └── About/
│   │       ├── About.tsx
│   │       └── index.ts
│   │
│   ├── hooks/              # カスタムフック
│   │   ├── useFileReader.ts       # ファイル読み込み用
│   │   ├── useLocalStorage.ts     # ローカルストレージ
│   │   └── index.ts
│   │
│   ├── utils/              # ユーティリティ関数
│   │   ├── fileParser.ts          # ファイル解析
│   │   ├── validation.ts          # バリデーション
│   │   ├── formatters.ts          # フォーマット関数
│   │   └── index.ts
│   │
│   ├── types/              # 型定義
│   │   ├── file.ts               # ファイル関連の型
│   │   ├── common.ts             # 共通の型
│   │   └── index.ts
│   │
│   ├── constants/          # 定数
│   │   ├── fileTypes.ts          # 許可するファイル形式など
│   │   ├── config.ts             # アプリ設定
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/                 # 静的ファイル
│   ├── images/
│   └── favicon.ico
│
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
└── README.md
```

## ディレクトリ構成の説明

### `src/components/`

再利用可能なコンポーネントを格納

- **ui/**: Button、Input、Card などの基本的な UI コンポーネント
- **layout/**: Header、Footer、Layout などのレイアウトコンポーネント
- **common/**: FileUploader、LoadingSpinner、ErrorMessage などの汎用コンポーネント

### `src/pages/`

各ページコンポーネントを格納。ページ固有のコンポーネントは各ページディレクトリ内の`components/`に配置

### `src/hooks/`

カスタムフックを格納

- `useFileReader`: ファイル読み込み処理
- `useLocalStorage`: ローカルストレージの管理

### `src/utils/`

ユーティリティ関数を格納

- `fileParser`: ファイル解析ロジック
- `validation`: バリデーション関数
- `formatters`: データフォーマット関数

### `src/types/`

TypeScript の型定義を格納

- `file.ts`: ファイル関連の型
- `common.ts`: 共通で使用する型

### `src/constants/`

定数を格納

- `fileTypes.ts`: 許可するファイル形式やサイズ制限
- `config.ts`: アプリケーション設定

## 開発ガイドライン

### コンポーネント作成の原則

1. **単一責任の原則**: 各コンポーネントは 1 つの責任のみを持つ
2. **再利用性**: 汎用的なコンポーネントは`components/`に配置
3. **型安全性**: すべての props と state に適切な型を定義
4. **エクスポート**: 各ディレクトリに`index.ts`を用意してエクスポートを管理

### ファイル命名規則

- コンポーネント: PascalCase（例: `Button.tsx`）
- ユーティリティ/フック: camelCase（例: `useFileReader.ts`）
- 定数: camelCase（ファイル名）、UPPER_SNAKE_CASE（変数名）

## ライセンス

MIT
