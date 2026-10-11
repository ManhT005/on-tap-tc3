import { createContext, useContext, useState, type ReactNode } from 'react';
import { IndexedDbProgressRepository } from '../../repositories/indexeddb/indexeddb-progress.repository';
import { MemoryProgressRepository } from '../../repositories/memory-progress.repository';
import type { ProgressRepository } from '../../repositories/progress.repository';
import {
  withStorageRecovery,
  type StorageStatus,
} from '../../repositories/resilient-progress.repository';

export type ProgressRepositoryContextValue = {
  repository: ProgressRepository;
  storageStatus: StorageStatus;
  /** Failed durable operation: no implicit memory writes. */
  storageError: string | null;
  storageRevision: number;
  retryStorage: () => Promise<void>;
};

const defaultRepository = new MemoryProgressRepository();
const ProgressRepositoryContext = createContext<ProgressRepositoryContextValue>({
  repository: defaultRepository,
  storageStatus: 'unavailable',
  storageError: null,
  storageRevision: 0,
  retryStorage: async () => undefined,
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
  const [storageRevision, setStorageRevision] = useState(0);
  const [defaultRepository] = useState(() =>
    withStorageRecovery(new IndexedDbProgressRepository(), {
      onError: (_error, operation) =>
        setStorageError(
          operation === 'write'
            ? 'Thao tác lưu chưa được xác nhận; hãy thử lại. Dữ liệu đã lưu không bị thay bằng bộ nhớ tạm.'
            : 'Không tải được dữ liệu trên trình duyệt. Dữ liệu cũ vẫn được giữ; hãy thử kết nối lại bộ nhớ.',
        ),
      onStatusChange: setInternalStatus,
    }),
  );
  const repository = repositoryOverride ?? defaultRepository;
  const storageStatus =
    storageStatusOverride ??
    (repositoryOverride && 'storageStatus' in repositoryOverride
      ? (repositoryOverride as { storageStatus: StorageStatus }).storageStatus
      : internalStatus);

  async function retryStorage() {
    try {
      if ('retryStorage' in repository && typeof repository.retryStorage === 'function')
        await repository.retryStorage();
      else await repository.getCourseProgress();
      setStorageError(null);
      setStorageRevision((value) => value + 1);
    } catch {
      setStorageError(
        'Chưa truy cập được dữ liệu. Hãy đóng các tab phiên bản cũ, kiểm tra quyền lưu của trình duyệt rồi thử lại.',
      );
    }
  }

  return (
    <ProgressRepositoryContext.Provider
      value={{ repository, storageStatus, storageError, storageRevision, retryStorage }}
    >
      {children}
    </ProgressRepositoryContext.Provider>
  );
}

export function useProgressRepository() {
  return useContext(ProgressRepositoryContext);
}
