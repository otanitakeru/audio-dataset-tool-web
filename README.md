# Audio Dataset Tool

オーディオファイルのデータセット管理ツール

## 環境構築

本プロジェクトでは、Node.js のバージョン管理に `nodenv` (および `anyenv`) を使用することを推奨しています。

### 1. 前提ツールのインストール

まだ `anyenv` や `nodenv` を導入していない場合は、以下の記事などを参考に環境をセットアップしてください。

- [anyenv + nodenv で Node.js 環境を構築する](https://zenn.dev/ryuu/articles/use-anyversions)
- [nodenv を使って Node.js を管理する](https://qiita.com/ksh-fthr/items/274880429822c8e3836d)

### 2. Node.js のセットアップ

本プロジェクトで指定されている Node.js のバージョン（v24.11.1）をインストールし、適用します。

```bash
# 指定バージョンのインストール
nodenv install 24.11.1

# バージョンの適用
# 注: プロジェクト内のみで有効にする場合は global ではなく local を推奨します
nodenv global 24.11.1
nodenv rehash
```

#### 補足

特定のディレクトリ（このプロジェクト内）だけでバージョンを有効にしたい場合は、`global` の代わりに `local` を使用してください。

```bash
nodenv local 24.11.1
```

### 3. 依存パッケージのインストール

Node.js のセットアップ後、プロジェクトに必要なライブラリをインストールします。

```bash
npm install
# または yarn install / pnpm install
```

## 起動方法

環境構築完了後、以下のコマンドでアプリケーションを起動します。

```bash
bash scripts/run.sh
```

## 技術スタック

- React 19
- TypeScript
- Vite
- Material-UI (MUI)
- React Router
- ESLint

## 利用可能なコマンド

```bash
# 開発サーバーの起動
npm run dev

# 本番ビルド
npm run build

# ESLintの実行
npm run lint

# ビルド結果のプレビュー
npm run preview
```

## ライセンス

MIT License

詳細は [LICENSE](LICENSE) ファイルを参照してください。
