# PHASE 0 OPTIMIZATION PLAN — Audit & Foundation

> Dự án: **Ôn tập Tiếng Hàn Trung cấp 3**  
> Nhánh review: `feature/audit_and_foundation`  
> Mục tiêu: hoàn thiện Phase 0 ở mức **merge-ready**, khóa nền tảng kỹ thuật và quy trình trước khi bước sang Phase 1.

---

## 1. Mục tiêu tối ưu Phase 0

Phase 0 hiện đã hoàn thành phần lớn nền tảng kỹ thuật quan trọng:

- Vite + React + TypeScript đã chạy ổn.
- Dữ liệu monolith đã được tách khỏi UI.
- 15 bài học đã được chia thành file riêng.
- Quiz / Reading / Writing đã tách thành data bank.
- Có Zod schema cho legacy data và target schema.
- Router mới đã thay thế mô hình `currentTab`.
- Có unit test cho routing.
- Có script `validate:content`.
- Có script `audit:data`.
- CI hiện tại đã chạy thành công qua install, typecheck, lint, test, validate content, data audit và build.
- Có `architecture.md`, `component-inventory.md`, `data-audit.md`.

Phần tối ưu còn lại **không phải rewrite Phase 0** mà là:

1. khóa source of truth;
2. làm rõ contract giữa Dev / Design / Data;
3. hoàn thiện các invariant validation;
4. chuẩn hóa workflow branch/PR;
5. xóa technical debt nhỏ có thể ảnh hưởng Phase 1;
6. hoàn thiện deliverable Design còn thiếu;
7. xác nhận Phase 0 bằng một PR chính thức vào `develop`.

---

## 2. Trạng thái tổng thể

| Nhóm | Trạng thái | Hành động |
|---|---|---|
| Project scaffold | ✅ Đạt | Giữ nguyên |
| Data extraction | ✅ Đạt | Giữ nguyên |
| Legacy compatibility | ✅ Đạt | Giữ nguyên |
| Runtime validation | ✅ Đạt cơ bản | Bổ sung invariant |
| Router foundation | ✅ Đạt | Fix nhỏ navigation |
| Unit test | ✅ Đạt cơ bản | Giữ, mở rộng sau |
| CI | ✅ Chạy xanh | Chuyển thành merge gate |
| Data audit | ✅ Có baseline | Tránh stale report |
| Architecture | ✅ Có | Chỉnh wording nhỏ |
| UX audit / Figma IA | ⚠️ Chưa đủ bằng chứng | Hoàn thiện |
| Package manager convention | ⚠️ Lệch guide | Chốt npm |
| Branch protection | ❌ Chưa có | Bắt buộc cấu hình |
| PR Phase 0 → develop | ❌ Chưa có | Bắt buộc trước khi đóng Phase |

---

# 3. Các hạng mục bắt buộc trước khi merge

## P0-01 — Chuẩn hóa package manager thành npm

### Hiện trạng

Repo hiện đang dùng:

```text
package-lock.json
npm ci
npm run ...
```

Trong khi tài liệu Phase 0 cũ vẫn hướng dẫn `pnpm`.

Nếu giữ cả hai hướng dẫn, team có thể vô tình sinh thêm `pnpm-lock.yaml`, làm dependency tree và CI không còn một source of truth.

### Quyết định

**Chốt npm là package manager chính thức của dự án.**

Không cần đổi repo về pnpm vì npm hiện đã:

- có lockfile;
- được dùng trong CI;
- build/test thành công;
- không tạo thêm giá trị nếu migrate ngược lại.

### Việc cần sửa

Trong các file tài liệu:

```text
phase-0-dev-guide.md
README.md
system-design.md      nếu có command liên quan
docs/*
```

thay các command pnpm bằng:

```bash
npm ci
npm run dev
npm run build
npm run typecheck
npm run lint
npm test
npm run validate:content
npm run audit:data
```

### Bổ sung `packageManager`

Trong `package.json` nên khai báo:

```json
{
  "packageManager": "npm@<version-team-chốt>"
}
```

Không bắt buộc pin patch version nếu chưa cần, nhưng nên ghi rõ package manager được support.

### Acceptance Criteria

- Repo chỉ còn `package-lock.json`.
- Không có `pnpm-lock.yaml`, `yarn.lock`.
- README và dev guide không còn command pnpm.
- CI tiếp tục dùng `npm ci`.

---

## P0-02 — Fix navigation SPA trong `AppShell`

### Hiện trạng

Brand đang dùng:

```tsx
<a href="/">...</a>
```

Điều này gây full browser reload.

Phase 0 chưa bị ảnh hưởng nhiều, nhưng Phase 1 sẽ có progress state, persistence và app-level providers. Giữ `<a href="/">` sẽ tạo hành vi không nhất quán với React Router.

### Sửa thành

```tsx
import { Link, NavLink, Outlet } from 'react-router-dom';

<Link
  className="brand"
  to="/"
  aria-label="Ôn tiếng Hàn Trung cấp 3, trang chủ"
>
  ...
</Link>
```

### Acceptance Criteria

- Click logo không reload document.
- Navigation vẫn hoạt động bằng History API.
- Router test vẫn pass.

---

## P0-03 — Bổ sung invariant cho content validation

Script hiện tại đã kiểm tra duplicate quiz/writing, duplicate reading passage/question, lesson 1–15 có mặt và schema parse.

Cần bổ sung các invariant nền tảng.

### 3.1. `COURSE_STRUCTURE` phải có đúng 15 bài

```ts
if (COURSE_STRUCTURE.length !== 15) {
  issues.push(
    `course.ts: expected 15 lessons, got ${COURSE_STRUCTURE.length}`,
  );
}
```

### 3.2. Không được trùng lesson ID

```ts
checkDuplicateIds(COURSE_STRUCTURE, 'course.ts');
```

### 3.3. Không cho ID ngoài phạm vi 1–15

```ts
for (const lesson of COURSE_STRUCTURE) {
  if (lesson.id < 1 || lesson.id > 15) {
    issues.push(`course.ts: invalid lesson id ${lesson.id}`);
  }
}
```

### 3.4. Validate key của `READING_BANK`

Schema legacy hiện chấp nhận `z.record(z.string(), ...)`, do đó các key như `"0"`, `"16"`, `"foo"`, `"01"` vẫn có thể lọt qua.

```ts
for (const key of Object.keys(READING_BANK)) {
  const lessonId = Number(key);

  if (!Number.isInteger(lessonId) || lessonId < 1 || lessonId > 15) {
    issues.push(`reading-bank.ts: invalid lesson key "${key}"`);
  }

  if (String(lessonId) !== key) {
    issues.push(`reading-bank.ts: non-canonical lesson key "${key}"`);
  }
}
```

### 3.5. Validate lesson reference của bank

```ts
const validLessonIds = new Set(COURSE_STRUCTURE.map((lesson) => lesson.id));

for (const q of QUIZ_BANK) {
  if (!validLessonIds.has(q.lessonId)) {
    issues.push(
      `quiz-bank.ts: question ${q.id} points to missing lesson ${q.lessonId}`,
    );
  }
}

for (const prompt of WRITING_BANK) {
  if (!validLessonIds.has(prompt.lessonId)) {
    issues.push(
      `writing-bank.ts: prompt ${prompt.id} points to missing lesson ${prompt.lessonId}`,
    );
  }
}
```

### Acceptance Criteria

`npm run validate:content` phải fail khi cố tình:

- thêm lesson trùng ID;
- xóa một lesson;
- thêm reading key `16`;
- thêm quiz trỏ sang lesson không tồn tại.

Sau khi revert test data, command phải pass.

---

## P0-04 — Chuyển CI từ “có chạy” thành Merge Gate

### Hiện trạng

CI đã chạy thành công trên branch, nhưng branch protection hiện chưa khóa merge.

### Workflow đề xuất

```text
feature/*
   │
   ▼
Pull Request
   │
   ├── typecheck
   ├── lint
   ├── unit test
   ├── validate content
   ├── data audit
   └── build
   │
   ▼
develop
   │
   ▼
release / milestone
   │
   ▼
main
```

### Cấu hình `develop`

Bật branch protection / ruleset với tối thiểu:

- Require a pull request before merging.
- Require status checks to pass.
- Required check: CI job `validate`.
- Block force push.
- Block deletion.
- Require branch up to date before merge nếu team thường làm nhiều nhánh song song.

Với team nhỏ có thể chưa cần 2 reviewers, signed commits hoặc CODEOWNERS bắt buộc.

### Cấu hình `main`

Mức bảo vệ ít nhất bằng `develop`, tốt hơn là chỉ merge từ PR, CI bắt buộc và không direct push.

### Acceptance Criteria

Không thể merge PR khi CI đỏ.

---

# 4. Các hạng mục nên hoàn thành trong Phase 0

## P1-01 — Hoàn thiện UX Audit thay vì gộp vào Architecture

`architecture.md` hiện phù hợp với góc nhìn kỹ thuật nhưng chưa thay thế được Design Audit.

Tạo:

```text
docs/ux-audit.md
```

### Nội dung tối thiểu

```md
# UX Audit — Phase 0

## Current IA

9 tab cũ:
- Roadmap
- Learn
- Vocab Lab
- Reading
- Quiz
- Wrong Notebook
- Writing
- Exam
- Plan

## Problems

### Navigation
- Quá nhiều entry ngang hàng.
- Không thể hiện flow học.
- Feature học và feature review bị trộn.

### Visual hierarchy
- Nhiều card cạnh tranh nhau.
- Gradient/màu accent được dùng quá rộng.
- Primary action không nổi bật.

### Recall experience
- Chưa có entry point rõ cho "Hôm nay cần ôn gì?"
- User phải tự quyết định mode học.
- Wrong Notebook chưa kết nối thành review loop.

## Target IA

Home
Learn
Review
Practice
Progress
```

### Bổ sung bảng mapping

| Old | New | UX Reason |
|---|---|---|
| Roadmap | Home | Tổng quan / resume learning |
| Learn | Learn | Core knowledge |
| Vocab Lab | Learn + Review | Browse và recall là hai intent khác nhau |
| Reading | Practice | Skill practice |
| Quiz | Practice | Skill practice |
| Wrong Notebook | Review | Error-driven recall |
| Writing | Practice | Production skill |
| Exam | Practice | Assessment mode |
| Plan | Home + Progress | Không cần top-level route |

### Deliverable Design

Bắt buộc có link:

```md
## Design Resources

- Figma IA: <link>
- Component inventory: ./component-inventory.md
```

Nếu chưa có high-fidelity design, chỉ cần FigJam / Figma IA đúng 5 khu vực.

---

## P1-02 — Tách rõ Architecture Decision và Design Decision

Trong `docs/architecture.md`, giữ:

- layered architecture;
- router architecture;
- data/schema strategy;
- local-first persistence;
- strangler migration;
- feature-based folder structure.

Không dùng `architecture.md` để thay UX audit.

### Sửa wording legacy

Nên mô tả:

```md
`legacy/App.legacy.tsx` được giữ như behavioral/data reference trong quá trình
migration. File này không được import vào application mới và không nằm trong
runtime bundle.
```

---

## P1-03 — Chỉnh scope Phase 1 trong `data-audit.md`

Phase 1 không nên vừa build Design System, AppShell, normalize toàn bộ quiz, thêm reading, writing, listening, persistence và review engine.

Scope này quá lớn và khiến contract data thay đổi song song với UI.

### Scope đề xuất

#### Phase 1 — Design System + Shell + Persistence Foundation

```text
Design tokens
      ↓
Shared UI primitives
      ↓
Responsive AppShell
      ↓
Home shell
      ↓
Learn shell
      ↓
Progress repository interface
      ↓
Local persistence foundation
```

#### Phase 2 — Lesson / Vocabulary / Grammar

```text
Normalize lesson schema
Normalize vocabulary
Normalize grammar
Learn detail UI
Vocabulary recall MVP
```

#### Phase 3 — Review Engine

```text
Review status
Spaced repetition
Wrong notebook migration
Daily review queue
Mastery
```

#### Phase 4 — Practice Content Expansion

```text
Quiz
Reading
Listening
Writing
Exam
```

### Sửa trong `data-audit.md`

```md
Phase 1 sử dụng audit này làm baseline nhưng chưa mở rộng hàng loạt content.
Ưu tiên Design System, App Shell và persistence foundation.

Các gap Quiz / Reading / Listening / Writing được giữ làm backlog cho Phase 4,
sau khi content contract đã được chuẩn hóa.
```

---

## P1-04 — Tránh `data-audit.md` bị stale

Hiện `npm run audit:data` chỉ in bảng ra terminal.

Nếu data thay đổi nhưng developer quên update `docs/data-audit.md`, documentation sẽ sai.

### Phương án khuyến nghị

Cho script hỗ trợ:

```bash
npm run audit:data
npm run audit:data:write
```

Ví dụ:

```json
{
  "scripts": {
    "audit:data": "tsx scripts/data-audit.ts",
    "audit:data:write": "tsx scripts/data-audit.ts --write"
  }
}
```

Khi có `--write`, script cập nhật một section generated trong `docs/data-audit.md`.

### Cách đơn giản hơn

Nếu chưa muốn generate file tự động, thêm header:

```md
> Generated from repository data.
> Last verified commit: <sha>
```

và checklist PR:

```text
[ ] Data changed → rerun npm run audit:data
[ ] data-audit.md updated
```

### Nâng cấp CI sau

Phase 1 có thể thêm:

```bash
npm run audit:data:write
git diff --exit-code docs/data-audit.md
```

---

# 5. README cần đủ để team onboarding

README hiện chưa đủ cho một repo Dev + Design + Data.

Tối thiểu nên có:

```md
# Ôn tập Tiếng Hàn Trung cấp 3

## Tech Stack

React
TypeScript
Vite
React Router
Zod
Vitest
Testing Library

## Requirements

Node.js 20+
npm

## Setup

npm ci
npm run dev

## Quality Checks

npm run typecheck
npm run lint
npm test
npm run validate:content
npm run audit:data
npm run build

## Project Structure

src/app
src/components
src/features
src/data
src/services
legacy
docs

## Branching

main
develop
feature/*

## Documentation

docs/architecture.md
docs/ux-audit.md
docs/component-inventory.md
docs/data-audit.md

## Current Status

Phase 0 — Audit & Foundation
```

Không cần README dài, nhưng phải đủ để người mới clone repo và chạy trong vài phút.

---

# 6. Không mở rộng scope trong Phase 0

Các việc sau **không làm trong Phase 0 optimization**:

- normalize toàn bộ vocabulary item;
- thêm ID mới hàng loạt;
- rewrite quiz schema;
- tạo 180 quiz;
- tạo listening dataset;
- tạo 30 writing prompt;
- implement spaced repetition;
- implement IndexedDB repository hoàn chỉnh;
- redesign high-fidelity toàn app;
- implement dashboard mới;
- implement exam engine mới.

Các việc này thuộc Phase 1–4.

Nguyên tắc:

> Phase 0 phải làm cho foundation đáng tin cậy, không phải biến Phase 0 thành một feature phase.

---

# 7. Kế hoạch commit đề xuất

Không gom mọi thay đổi thành một commit lớn.

## Commit 1 — Tooling consistency

```text
chore: standardize project tooling on npm
```

Bao gồm:

- docs pnpm → npm;
- README setup;
- package manager convention.

## Commit 2 — Navigation cleanup

```text
fix: keep app navigation inside react router
```

Bao gồm:

- `<a href="/">` → `<Link to="/">`;
- update test nếu cần.

## Commit 3 — Content validation hardening

```text
test: strengthen content integrity validation
```

Bao gồm:

- duplicate course IDs;
- exact lesson count;
- reading key validation;
- lesson reference validation.

## Commit 4 — Phase 0 docs alignment

```text
docs: align phase 0 architecture data and ux deliverables
```

Bao gồm:

- `ux-audit.md`;
- Figma link;
- fix architecture wording;
- fix Phase 1 scope;
- README docs links.

## Commit 5 — CI / repo governance

```text
ci: enforce phase 0 merge quality gates
```

Có thể không có code nếu branch rules được cấu hình trực tiếp trên GitHub.

Trong PR description ghi rõ ruleset đã được bật.

---

# 8. Pull Request cuối Phase 0

Tạo PR:

```text
feature/audit_and_foundation
                ↓
             develop
```

## PR title

```text
refactor: complete phase 0 audit and foundation
```

## PR description

```md
## Scope

Complete Phase 0 foundation before Design System development.

## Included

- React/Vite/TypeScript foundation
- route-driven navigation
- extracted lesson/content data
- Zod legacy compatibility schemas
- content validator
- data audit
- CI
- architecture documentation
- UX IA audit
- component inventory

## Validation

- [ ] npm ci
- [ ] npm run typecheck
- [ ] npm run lint
- [ ] npm test
- [ ] npm run validate:content
- [ ] npm run audit:data
- [ ] npm run build

## Phase 0 exit criteria

- [ ] 15 lessons present
- [ ] content validation passes
- [ ] 6 routes reachable
- [ ] legacy app not imported into src
- [ ] npm is the only package manager
- [ ] UX IA linked
- [ ] CI required before merge
```

---

# 9. Definition of Done — Phase 0 tối ưu

Phase 0 chỉ được chuyển sang **DONE** khi toàn bộ checklist dưới đây đạt.

## Engineering

- [ ] `npm ci` pass.
- [ ] `npm run typecheck` pass.
- [ ] `npm run lint` pass.
- [ ] `npm test` pass.
- [ ] `npm run validate:content` pass.
- [ ] `npm run audit:data` pass.
- [ ] `npm run build` pass.
- [ ] Có đúng 15 lesson.
- [ ] Course lesson ID không trùng.
- [ ] Reading key chỉ nằm trong `1..15`.
- [ ] Quiz/Writing không reference lesson không tồn tại.
- [ ] `legacy/App.legacy.tsx` không được import vào runtime.
- [ ] App sử dụng React Router cho internal navigation.
- [ ] Không còn `currentTab` navigation trong app mới.

## Tooling

- [ ] Chỉ dùng npm.
- [ ] Chỉ có `package-lock.json`.
- [ ] README và guide thống nhất command.
- [ ] Node version của local guide và CI thống nhất.

## Design

- [ ] Có IA 5 khu vực: Home / Learn / Review / Practice / Progress.
- [ ] Có UX audit của 9 tab cũ.
- [ ] Có Figma/FigJam link.
- [ ] Có `component-inventory.md`.
- [ ] Component ưu tiên Phase 1 đã được xác định.

## Data

- [ ] Có `data-audit.md` đủ 15 bài.
- [ ] Audit được sinh từ data thật.
- [ ] Gap Quiz / Reading / Listening / Writing được ghi rõ.
- [ ] Không mở rộng content hàng loạt trong Phase 0.

## Process

- [ ] Có PR từ `feature/audit_and_foundation` → `develop`.
- [ ] CI chạy trên PR và xanh.
- [ ] `develop` được bảo vệ bằng required status check.
- [ ] `main` không cho direct push.
- [ ] PR được review trước merge.

---

# 10. Exit Gate sang Phase 1

Sau khi merge vào `develop`, tạo tag nội bộ hoặc milestone:

```text
phase-0-complete
```

Phase 1 chỉ bắt đầu khi:

```text
Foundation stable
        +
Data contract legacy-safe
        +
IA agreed
        +
CI enforced
        +
Repository workflow locked
```

Phase 1 sau đó tập trung đúng vào:

```text
Design System
      +
Responsive AppShell
      +
Home / Learn foundation
      +
Progress persistence foundation
```

Không quay lại sửa kiến trúc nền trừ khi phát hiện blocker thực sự.

---

# 11. Ưu tiên thực thi

Thứ tự triển khai khuyến nghị:

```text
1. Chốt npm
      ↓
2. Fix React Router Link
      ↓
3. Harden validate-content
      ↓
4. Sửa Phase roadmap/docs
      ↓
5. Hoàn thiện UX audit + Figma IA
      ↓
6. Update README
      ↓
7. Push branch
      ↓
8. Mở PR → develop
      ↓
9. Verify PR CI
      ↓
10. Enable branch protection
      ↓
11. Merge
      ↓
12. Mark Phase 0 Complete
```

---

# 12. Kết luận Tech Lead

Phase 0 hiện tại **không cần rewrite**. Kiến trúc foundation đã đủ tốt để tiếp tục.

Điểm quan trọng trước khi sang Phase 1 không nằm ở việc thêm feature, mà nằm ở việc:

- khóa conventions;
- khóa validation;
- khóa CI;
- khóa scope;
- khóa IA;
- khóa quy trình merge.

Sau các thay đổi trong tài liệu này, Phase 0 có thể được xem là một baseline ổn định để Dev, Design và Data phát triển song song mà giảm đáng kể conflict và technical debt.
