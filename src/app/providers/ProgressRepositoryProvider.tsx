import { createContext, useContext, useState, type ReactNode } from 'react';
import { IndexedDbProgressRepository } from '../../repositories/indexeddb/indexeddb-progress.repository';
import { MemoryProgressRepository } from '../../repositories/memory-progress.repository';
import type { ProgressRepository } from '../../repositories/progress.repository';
import { withMemoryFallback } from '../../repositories/resilient-progress.repository';

export type ProgressRepositoryContextValue = {
  repository: ProgressRepository;
  storageError: string | null;
};

const defaultRepository = new MemoryProgressRepository();
const ProgressRepositoryContext = createContext<ProgressRepositoryContextValue>({
  repository: defaultRepository,
  storageError: null,
});

export type ProgressRepositoryProviderProps = {
  children: ReactNode;
  repository?: ProgressRepository;
};

export function ProgressRepositoryProvider({
  children,
  repository: repositoryOverride,
}: ProgressRepositoryProviderProps) {
  const [storageError, setStorageError] = useState<string | null>(null);
  const [defaultRepository] = useState(() =>
    withMemoryFallback(new IndexedDbProgressRepository(), new MemoryProgressRepository(), {
      onError: () =>
        setStorageError('Không thể lưu tiến độ lâu dài. Dữ liệu phiên này chỉ được giữ tạm thời.'),
    }),
  );
  const repository = repositoryOverride ?? defaultRepository;

  return (
    <ProgressRepositoryContext.Provider value={{ repository, storageError }}>
      {children}
    </ProgressRepositoryContext.Provider>
  );
}

export function useProgressRepository() {
  return useContext(ProgressRepositoryContext);
}
