# MathQuest — Ôn luyện Toán

App ôn tập Toán hằng ngày cho học sinh tiểu học (lớp 1–5), tham khảo kiến trúc BrainQuest.

## Tính năng

- **10 câu trắc nghiệm/ngày** — tự generate theo lớp học của profile
- **Module theo lớp** — mỗi lớp có bộ chủ đề trọng tâm riêng
- **Adaptive difficulty** — tự điều chỉnh độ khó theo kết quả từng chủ đề
- **Lộ trình cá nhân hóa** — ưu tiên module yếu nhất
- **Dashboard & phụ huynh** — theo dõi tiến độ, PIN bảo vệ

## Chạy local

```bash
cd math-web
npm install
npm run dev
```

Mở http://localhost:3000

## Routes

| Route | Màn hình |
|-------|----------|
| `/` | Trang chủ + đề ôn hôm nay |
| `/play` | Làm 10 câu trắc nghiệm |
| `/modules` | Danh sách chủ đề theo lớp |
| `/profiles` | Quản lý hồ sơ học sinh (lớp 1–5) |
| `/dashboard` | Tiến độ theo chủ đề |
| `/parent` | Báo cáo phụ huynh (PIN: 1234) |
| `/reward` | Hoàn thành đề |

## Module theo lớp

| Lớp | Chủ đề (10 câu/ngày) |
|-----|----------------------|
| 1 | Cộng/trừ trong 10, so sánh số, hình học |
| 2 | Cộng/trừ trong 100, bảng nhân, so sánh |
| 3 | Cửu chương, chia, cộng 1000, phân số |
| 4 | Nhân/chia lớn, phân số, chu vi/diện tích, lời văn |
| 5 | Phân số, thập phân, %, hình học, lời văn |

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind 4 · Zustand
