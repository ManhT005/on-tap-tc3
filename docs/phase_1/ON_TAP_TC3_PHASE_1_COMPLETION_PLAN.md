# ON-TAP-TC3 — PHASE 1 COMPLETION PLAN

**Repository:** `ManhT005/on-tap-tc3`  
**Mục tiêu:** Hoàn tất, ổn định và merge Phase 1 trước khi mở Phase 2  
**Trạng thái hiện tại:** Phase 1 đã triển khai đáng kể nhưng chưa close-out hoàn chỉnh

---

# 1. MỤC TIÊU PHASE 1 COMPLETION

Phase 1 phải kết thúc với một baseline frontend ổn định, có:

- AppShell hoàn chỉnh;
- navigation chuẩn SPA;
- responsive;
- design tokens;
- UI primitives cơ bản;
- các page shell tách khỏi router;
- CI xanh;
- Playwright smoke test;
- branch Phase 1 đồng bộ với `main`;
- merge sạch vào `main`.

Phase 1 **không** bao gồm:

- IndexedDB persistence thật;
- review engine;
- practice engine hoàn chỉnh;
- progress thật;
- content expansion lớn;
- listening;
- AI.

---

# 2. TRẠNG THÁI HIỆN TẠI

## Đã có

- Vite + React + TypeScript.
- React Router.
- Zod.
- Vitest + Testing Library.
- ESLint / Prettier / Husky.
- GitHub Actions CI.
- `idb` dependency đã được chuẩn bị.
- Data 15 bài.
- Design tokens.
- Global styles.
- AppShell.
- Home shell.
- Learn shell.
- Lesson Detail shell.
- Review shell.
- Practice shell.
- Progress shell.
- Button.
- Card.
- Badge.
- Skip-link.
- Router test cơ bản.

## Vấn đề còn lại

Branch:

```text
feature/phase-1-design-system-app-shell
```

đang:

```text
ahead 4 commits
behind 3 commits
```

so với `main`.

Ngoài ra:

- page markup còn nằm trong `router.tsx`;
- UI primitives chưa đủ;
- navigation nội bộ còn chỗ dùng `<a href>`;
- chưa có E2E gate;
- README quá ngắn;
- chưa có release checklist rõ cho Phase 1.

---

# 3. PHASE 1 COMPLETION GATE

## P1-01 — Rebase / Sync branch

```bash
git checkout feature/phase-1-design-system-app-shell
git fetch origin
git rebase origin/main
```

Nếu conflict/history khó xử lý:

```text
feature/phase-1-closeout
```

tạo từ `main`, sau đó cherry-pick phần Phase 1 cần giữ.

### Acceptance Criteria

- branch không còn behind `main`;
- không mất tokens/styles/pages;
- build được;
- test pass;
- lint pass;
- content validation pass.

---

# 4. TÁCH PAGE KHỎI ROUTER

## Cấu trúc mục tiêu

```text
src/
├── app/
│   ├── App.tsx
│   ├── AppShell.tsx
│   └── router.tsx
│
└── pages/
    ├── HomePage.tsx
    ├── LearnPage.tsx
    ├── LessonPage.tsx
    ├── ReviewPage.tsx
    ├── PracticePage.tsx
    └── ProgressPage.tsx
```

## Router target

```tsx
{
  path: '/',
  element: <AppShell />,
  children: [
    { index: true, element: <HomePage /> },
    { path: 'learn', element: <LearnPage /> },
    { path: 'learn/:lessonId', element: <LessonPage /> },
    { path: 'review', element: <ReviewPage /> },
    { path: 'practice', element: <PracticePage /> },
    { path: 'progress', element: <ProgressPage /> },
  ],
}
```

### Acceptance Criteria

- `router.tsx` chỉ giữ route config;
- page component test độc lập được;
- route tests vẫn pass;
- không có duplicated route UI logic.

---

# 5. HOÀN THIỆN UI PRIMITIVES

## Bắt buộc trong Phase 1

```text
Button
Card
Badge
PageHeader
EmptyState
StatTile
LessonCard
Skeleton
Toast
```

## Có thể đưa sang Phase 2 nếu chưa cần

```text
Flashcard
QuizCard
ReviewQueueItem
TextField nâng cao
Modal
```

### Mục tiêu

Không để page mới tự dựng lại:

- card;
- header;
- empty state;
- stat block;
- loading state.

---

# 6. NAVIGATION CLEANUP

Thay internal:

```html
<a href="/learn">
```

bằng:

```tsx
<Link to="/learn">
```

hoặc:

```tsx
<NavLink to="/learn">
```

### Acceptance Criteria

- không reload toàn app;
- browser back/forward hoạt động;
- deep-link hoạt động;
- route active state đúng.

---

# 7. LESSON ROUTE VALIDATION

Hiện shell có nguy cơ fallback âm thầm về Lesson 1 nếu ID không hợp lệ.

Phase 1 cần sửa:

```text
/learn/999
```

không được tự mở Lesson 1.

## Target

- Not Found state;
- invalid lesson state rõ ràng;
- không silent fallback.

---

# 8. RESPONSIVE & ACCESSIBILITY

## Desktop

- header ổn;
- navigation ổn;
- content width ổn;
- grid không vỡ.

## Mobile

Target:

```text
360px
390px
430px
```

### Kiểm tra

- no horizontal overflow;
- nav usable;
- touch target hợp lý;
- button không tràn;
- card grid về 1 cột;
- spacing không quá rộng.

## Accessibility

- skip-link;
- visible focus;
- semantic heading;
- `main`;
- `nav`;
- button names;
- aria-live cho toast;
- prefers-reduced-motion.

---

# 9. PLAYWRIGHT SMOKE

## Files

```text
playwright.config.ts
e2e/app-shell.spec.ts
```

## Cases

```text
E2E-P1-001 Home loads
E2E-P1-002 Navigate Learn
E2E-P1-003 Open lesson
E2E-P1-004 Navigate Practice
E2E-P1-005 Navigate Review
E2E-P1-006 Navigate Progress
E2E-P1-007 Invalid lesson shows not found
E2E-P1-008 Mobile navigation
```

## Script

```json
{
  "scripts": {
    "test:e2e": "playwright test"
  }
}
```

---

# 10. CI UPDATE

CI hiện có:

```text
npm ci
npm run typecheck
npm run lint
npm test
npm run validate:content
npm run audit:data
npm run build
```

Phase 1 completion thêm:

```text
npm run format:check
npm run test:e2e
```

Recommended:

```yaml
jobs:
  validate:
  e2e:
```

---

# 11. README UPDATE

README cần tối thiểu:

```text
Project overview
Tech stack
Requirements
Install
Run dev
Run tests
Run content validation
Run build
Folder structure
Branch strategy
Current phase
```

Không cần viết docs quá dài.

---

# 12. PHASE 1 TEST CHECKLIST

## Build

- [ ] `npm ci`
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run format:check`
- [ ] `npm test`
- [ ] `npm run validate:content`
- [ ] `npm run audit:data`
- [ ] `npm run build`
- [ ] `npm run test:e2e`

## Route

- [ ] Home
- [ ] Learn
- [ ] Lesson
- [ ] Review
- [ ] Practice
- [ ] Progress
- [ ] Not Found

## UX

- [ ] Desktop
- [ ] 390px mobile
- [ ] Keyboard
- [ ] Focus visible
- [ ] No horizontal scroll

---

# 13. TASK BREAKDOWN

| ID | Task | Priority | Estimate |
|---|---|---:|---:|
| P1-01 | Rebase/sync branch | P0 | 0.5d |
| P1-02 | Tách pages khỏi router | P0 | 0.5d |
| P1-03 | Bổ sung UI primitives | P0 | 0.5–1d |
| P1-04 | Chuẩn hóa internal navigation | P0 | 0.25d |
| P1-05 | Invalid route handling | P0 | 0.25d |
| P1-06 | Responsive regression | P0 | 0.5d |
| P1-07 | Accessibility pass | P1 | 0.5d |
| P1-08 | Playwright smoke | P0 | 0.5d |
| P1-09 | CI E2E gate | P0 | 0.25d |
| P1-10 | README/docs cleanup | P1 | 0.25d |

---

# 14. KẾ HOẠCH 2 NGÀY

## Day 1

- rebase/sync;
- fix conflicts;
- tách pages;
- navigation cleanup;
- invalid route;
- primitives.

## Day 2

- responsive;
- accessibility;
- Playwright;
- CI;
- README;
- regression;
- merge.

---

# 15. DEFINITION OF DONE — PHASE 1

Phase 1 được coi là hoàn tất khi:

- [ ] branch không diverge;
- [ ] tất cả page tách khỏi router;
- [ ] design tokens được dùng thống nhất;
- [ ] UI primitives tối thiểu đầy đủ;
- [ ] SPA navigation chuẩn;
- [ ] responsive pass;
- [ ] accessibility baseline pass;
- [ ] unit tests pass;
- [ ] Playwright smoke pass;
- [ ] CI green;
- [ ] README update;
- [ ] merge vào `main`.

---

# 16. OUTPUT CUỐI PHASE 1

Sau khi hoàn tất:

```text
main
└── Stable UI Foundation
    ├── AppShell
    ├── Router
    ├── Pages
    ├── Design System
    ├── Responsive
    ├── Accessibility
    ├── Unit Tests
    └── E2E Smoke
```

Đây là baseline để Phase 2 bắt đầu mà không phải quay lại xử lý nợ UI/architecture.
