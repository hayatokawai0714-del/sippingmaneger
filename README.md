# shippingmaneger

GitHub Pages で動作する静的な出荷・予定管理アプリ (React + Vite)。

## セットアップ

```bash
npm install
npm run dev
```

## ルーティング

- `#/` カレンダー
- `#/today` 今日の予定
- `#/register` 出荷登録
- `#/destinations` 出荷先管理
- `#/units` 単位設定
- `#/data` データ入出力
- `#/about` About

## データ運用

- 初期データ: `public/data.json`
- ローカル編集: `Local Storage (shipping-app:draft-data)`
- Excel 入出力: `xlsx`
