# BrainQuest Kids Web App

Đây là phần frontend Next.js cho dự án `dailyQuest`.

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Build production

```bash
npm run build
```

## Deploy GitHub Pages

Project dùng static export và workflow ở:

`../.github/workflows/deploy-pages.yml`

Yêu cầu trong repo GitHub:

1. `Settings` -> `Pages`
2. Source chọn `GitHub Actions`
3. Push lên nhánh `main`

Sau khi workflow chạy xong, site sẽ có dạng:

`https://<username>.github.io/<repo-name>/`
