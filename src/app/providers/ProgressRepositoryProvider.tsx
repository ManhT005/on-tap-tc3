import { createContext, useContext, useState, type ReactNode } from 'react';
import { IndexedDbProgressRepository } from '../../repositories/indexeddb/indexeddb-progress.repository';
import { MemoryProgressRepository } from '../../repositories/memory-progress.repository';
import type { ProgressRepository } from '../../repositories/progress.repository';
import {
  withMemoryFallback,
  type StorageStatus,
} from '../../repositories/resilient-progress.repository';

export type ProgressRepositoryContextValue = {
  repository: ProgressRepository;
  storageStatus: StorageStatus;
  /** Non-null only when storage failed and data is session-only. */
  storageError: string | null;
};

const defaultRepository = new MemoryProgressRepository();
const ProgressRepositoryContext = createContext<ProgressRepositoryContextValue>({
  repository: defaultRepository,
  storageStatus: 'unavailable',
  storageError: null,
});

export type ProgressRepositoryProviderProps = {
  children: ReactNode;
  repository?: ProgressRepository;
  storageStatus?: StorageStatus;
};

export function ProgressRepositoryProvider({
  children,
  repository: repositoryOverride,
  storageStatus: storageStatusOverride,
}: ProgressRepositoryProviderProps) {
  const [internalStatus, setInternalStatus] = useState<StorageStatus>('unavailable');
  const [storageError, setStorageError] = useState<string | null>(null);
  const [defaultRepository] = useState(() =>
    withMemoryFallback(new IndexedDbProgressRepository(), new MemoryProgressRepository(), {
      onError: () =>
        setStorageError('Không thể lưu tiến độ lâu dài. Dữ liệu phiên này chỉ được giữ tạm thời.'),
      onStatusChange: setInternalStatus,
    }),
  );
  const repository = repositoryOverride ?? defaultRepository;
  const storageStatus =
    storageStatusOverride ??
    (repositoryOverride && 'storageStatus' in repositoryOverride
      ? (repositoryOverride as { storageStatus: StorageStatus }).storageStatus
      : internalStatus);

  return (
    <ProgressRepositoryContext.Provider value={{ repository, storageStatus, storageError }}>
      {children}
    </ProgressRepositoryContext.Provider>
  );
}

export function useProgressRepository() {
  return useContext(ProgressRepositoryContext);
}
