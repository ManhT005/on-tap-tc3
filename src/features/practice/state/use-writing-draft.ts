import { useEffect, useRef, useState } from 'react';
import type { WritingDraft } from '../../../domain/progress/backup';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';
import type { ProgressRepository } from '../../../repositories/progress.repository';

const sessionDrafts = new WeakMap<ProgressRepository, Map<string, WritingDraft>>();
export function clearWritingDraftCache(repository: ProgressRepository) {
  sessionDrafts.get(repository)?.clear();
}

type DraftState = {
  key: string;
  response: string;
  loading: boolean;
  status: 'saved' | 'pending' | 'saving' | 'error';
  error: string | null;
  loadFailed?: boolean;
};

export function useWritingDraft(lessonId: number, promptId: string) {
  const { repository, storageRevision } = useProgressRepository();
  if (!sessionDrafts.has(repository)) sessionDrafts.set(repository, new Map());
  const key = `${lessonId}:${promptId}`;
  const cache = useRef(sessionDrafts.get(repository)!);
  const dirtyKeys = useRef(new Set<string>());
  const [retryKey, setRetryKey] = useState(0);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const writes = useRef(new Map<string, Promise<void>>());
  const [state, setState] = useState<DraftState>({
    key,
    response: '',
    loading: true,
    status: 'saved',
    error: null,
  });

  useEffect(() => {
    let active = true;
    repository
      .getWritingDraft(lessonId, promptId)
      .then((draft) => {
        if (!active) return;
        const current = cache.current.get(key) ?? draft;
        if (current) cache.current.set(key, current);
        setState({
          key,
          response: current?.response ?? '',
          loading: false,
          status: current && current.response !== draft?.response ? 'pending' : 'saved',
          error: null,
        });
      })
      .catch(() => {
        if (active)
          setState({
            key,
            response: cache.current.get(key)?.response ?? '',
            loading: false,
            status: 'error',
            loadFailed: !cache.current.has(key),
            error: 'Không tải được bản nháp. Hãy thử lại trước khi chỉnh sửa.',
          });
      });
    return () => {
      active = false;
    };
  }, [key, lessonId, promptId, repository, retryKey, storageRevision]);

  async function persist(targetKey: string) {
    const timer = timers.current.get(targetKey);
    if (timer) clearTimeout(timer);
    timers.current.delete(targetKey);
    const draft = cache.current.get(targetKey);
    if (!draft) return;
    setState((current) =>
      current.key === targetKey ? { ...current, status: 'saving', error: null } : current,
    );
    const previous = writes.current.get(targetKey) ?? Promise.resolve();
    const operation = previous
      .catch(() => undefined)
      .then(() => repository.saveWritingDraft(draft));
    writes.current.set(targetKey, operation);
    try {
      await operation;
      if (cache.current.get(targetKey)?.response === draft.response)
        dirtyKeys.current.delete(targetKey);
      setState((current) =>
        current.key === targetKey && current.response === draft.response
          ? { ...current, status: 'saved', error: null }
          : current,
      );
    } catch (error) {
      setState((current) =>
        current.key === targetKey
          ? {
              ...current,
              status: 'error',
              error: 'Bản nháp chưa được xác nhận lưu. Nội dung vẫn giữ ở đây; hãy bấm lưu lại.',
            }
          : current,
      );
      throw error;
    } finally {
      if (writes.current.get(targetKey) === operation) writes.current.delete(targetKey);
    }
  }

  useEffect(() => {
    const draftTimers = timers.current;
    const drafts = cache.current;
    const onUnload = (event: BeforeUnloadEvent) => {
      if (draftTimers.size || writes.current.size || dirtyKeys.current.size) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('beforeunload', onUnload);
      for (const [draftKey, timer] of draftTimers) {
        clearTimeout(timer);
        const draft = drafts.get(draftKey);
        if (draft) void repository.saveWritingDraft(draft).catch(() => undefined);
      }
      draftTimers.clear();
    };
  }, [repository]);

  function changeResponse(response: string) {
    const updatedAt = new Date().toISOString();
    cache.current.set(key, { lessonId, promptId, response, updatedAt });
    dirtyKeys.current.add(key);
    setState({ key, response, loading: false, status: 'pending', error: null });
    const previous = timers.current.get(key);
    if (previous) clearTimeout(previous);
    timers.current.set(
      key,
      setTimeout(() => {
        void persist(key).catch(() => undefined);
      }, 400),
    );
  }

  return {
    response: state.key === key ? state.response : '',
    loading: state.key !== key || state.loading,
    status: state.key === key ? state.status : 'saved',
    error: state.key === key ? state.error : null,
    changeResponse,
    flushDraft: () => persist(key),
    loadFailed: state.key === key && state.loadFailed === true,
    retryDraft: () => setRetryKey((value) => value + 1),
  };
}
