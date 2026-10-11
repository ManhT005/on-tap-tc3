# Storage failure and recovery

Production uses IndexedDB with fail-closed operations. A failed read rejects instead of substituting an empty memory store. A failed write rejects instead of reporting an ephemeral save as durable. Every route displays the storage warning and a retry action. Successful retry probes the same database and refreshes mounted progress/lesson views. It does not merge divergent stores or delete the database.

`storageHealth` exposes status, the last confirmed persisted timestamp in this process, and the last operation error. Before the first successful operation status is unavailable. A successful probe establishes access; individual writes can still reject if quota remains exhausted. Memory is an explicitly injected adapter for tests, not an automatic production fallback.

Open failures clear the cached connection promise so retry can succeed. A blocked upgrade reports an actionable error. If its old request later opens, the connection closes rather than leaking. Existing application connections close on version change. Migration errors abort the upgrade and preserve the previous version; transaction completion rejections are handled.

Recovery: close tabs using older app versions, check browser storage permissions/capacity, press retry, then repeat the failed action. Use backups once the database is readable. Never clear browser storage as a default repair.

Evidence: unavailable initial read, quota failure after saved data, successful retry retaining original records, blocked upgrade with old-tab close, failed migration retaining both original records.
