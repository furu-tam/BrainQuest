# BrainQuest Kids — MVP Hybrid

Ứng dụng luyện tư duy cho trẻ 3–10 tuổi. Repo gồm **mockup HTML tĩnh** (xem nhanh UI) và **app hybrid Next.js PWA** (Phase 1–3).

## Cấu trúc

```text
dailyQuest/
├── specs              # MVP specification
├── mockup/            # HTML + CSS mockup (6 màn hình)
└── web/               # Next.js hybrid app
    └── src/
        ├── components/   # PatternGame, MemoryGame, LogicGame
        ├── services/     # questionGenerator, learningPath, voice, analytics
        ├── store/        # appStore (profiles + game state)
        ├── utils/        # adaptiveDifficulty, skillStats, achievements
        └── hooks/        # useVoice
```

## Chạy app

```bash
cd web
npm install
npm run dev
```

http://localhost:3000

| Route | Màn hình |
|-------|----------|
| `/` | Home + lộ trình cá nhân hóa |
| `/play` | 5 câu/ngày, adaptive difficulty, voice |
| `/reward` | Phần thưởng |
| `/dashboard` | Tiến độ bé (kỹ năng thật từ events) |
| `/profiles` | Quản lý hồ sơ con |
| `/parent` | Dashboard phụ huynh (PIN mặc định: **1234**) |

Mockup HTML: `cd mockup && npx serve . -p 3333`

---

## Phase 2 ✅ (đã implement)

### Adaptive Difficulty
- Độ khó 1–3 (Dễ / Trung bình / Khó) theo từng kỹ năng
- Tự tăng khi ≥80% đúng + phản hồi nhanh; giảm khi sai liên tiếp
- Khởi tạo theo tuổi bé (3–4 → Dễ, 5–7 → TB)

### Child Profiles
- Nhiều hồ sơ con (tên, tuổi, avatar)
- XP, coins, streak, events riêng từng bé
- Chuyển profile tại Home hoặc `/profiles`

### Parent Dashboard (`/parent`)
- Bảo vệ bằng PIN (đổi PIN được)
- Báo cáo: độ chính xác, thời gian phản hồi, streak, độ khó từng skill
- Gợi ý luyện tập theo kỹ năng yếu

---

## Phase 3 ✅ (đã implement)

### AI Question Generation
- Engine procedural sinh câu hỏi động (pattern ABAB/ABC/ABBC, memory 4–8 hình, logic 2–4 so sánh)
- Đã tối ưu để chạy static trên GitHub Pages (không cần API runtime)

### Personalized Learning Paths
- 5 câu/ngày (2 pattern + 2 memory + 1 logic)
- Thứ tự ưu tiên kỹ năng yếu nhất
- Gợi ý hiển thị trên Home

### Voice Guidance
- Web Speech API (TTS tiếng Việt nếu có)
- Đọc hướng dẫn + feedback đúng/sai
- Toggle 🔊/🔇 trên Home và màn chơi

---

## Phase 4 (chưa làm)

Flutter native, subscription, push notifications.

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind 4 · Zustand · PWA

## Deploy GitHub Pages

1. Push code lên nhánh `main`
2. Vào GitHub repo → `Settings` → `Pages`:
   - Source: `GitHub Actions`
3. Workflow `Deploy Web to GitHub Pages` sẽ tự chạy
4. URL page:
   - `https://<github-username>.github.io/<repo-name>/`

Lưu ý:
- App đã cấu hình static export trong `web/next.config.ts`
- Nếu đổi tên repo, đường dẫn page sẽ đổi theo tên repo mới
