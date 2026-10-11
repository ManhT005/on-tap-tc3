# Deployment runbook

Current artifact is `0.3.0-beta.1`, a preview. Full v1.0 release is blocked by content/source review, recorded audio and human UAT. No production deployment or release tag is created by this implementation.

1. Install with Node.js 24 (the tested local/CI profile): `npm ci`.
2. Run typecheck, lint, format, `npm run test:coverage`, `npm run check:manifest`, `npm run validate:content`, `npm audit --audit-level=high`, production build and `npm run check:bundle`.
3. Install Chromium/Firefox and run `npm run test:e2e`. E2E serves the production build through Vite preview with two workers. Reports/traces are in `node_modules/.cache/`; coverage is in `coverage/`.
4. Preview with `npm run preview -- --host 127.0.0.1`. Test direct/reload routes `/learn/15`, `/review`, `/practice`, `/progress`.
5. Select the real hosting environment and deploy the immutable `dist/` artifact. `deploy/nginx.conf` provides SPA fallback with real 404s for missing assets, CSP and HTML revalidation. `_redirects`/`_headers` are example rules for hosts supporting that convention; verify provider-specific behavior on the chosen host.
6. Serve over HTTPS. Keep hashed assets available during rollout; cache them long-term, revalidate HTML. Avoid mixing new HTML with deleted old route chunks. Check recorded media sources against the configured CSP before enabling them.
7. Configure branch protection in GitHub for `main`/`develop`: require `validate` and `e2e`, reviewer approval and no direct release pushes. The workflow is committed; remote protection settings require repository-admin setup and are not reported as configured.
8. For v1.0, complete approval registry and recorded audio, then run `npm run validate:release`. It currently intentionally returns nonzero. Finish `docs/qa/UAT_SIGNOFF.md`, production Web Vitals/Lighthouse and accessibility acceptance before tagging.

Rollback: retain the previous version's entire build artifact and hosting configuration; restore it atomically. Back up learning data before a migration-bearing deployment. Code rollback does not downgrade IndexedDB, and old app code may reject a newer schema. Use the tested JSON backup/recovery process rather than deleting browser storage.

The app currently has no service worker/full offline-navigation guarantee. Browser speech synthesis is provisional and may require provider connectivity. The static bundle budget is a deterministic CI check, not evidence that production LCP/CLS targets have been measured.
