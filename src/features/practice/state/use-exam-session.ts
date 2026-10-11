import { useCallback, useEffect, useRef, useState } from 'react';
import type { ExamAttempt, ExamMutation } from '../../../domain/exam/exam.types';
import {
  CORE_EXAM_BLUEPRINT,
  MIXED_EXAM_BLUEPRINT,
  createExamAttempt,
  isExamExpired,
} from '../../../domain/exam/exam-engine';
import { getExamBank } from '../../../domain/exam/exam-bank';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';

export function useExamSession() {
  const { repository, storageRevision } = useProgressRepository();
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now);
  const lock = useRef(false);
  const nextAutoRetry = useRef(0);
  const load = useCallback(async () => {
    try {
      setAttempt(await repository.getActiveExamAttempt());
      setError(null);
    } catch {
      setError('Không tải được đề đang làm. Hãy thử lại trước khi tạo đề mới.');
    } finally {
      setLoading(false);
    }
  }, [repository]);
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load, storageRevision]);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = window.setInterval(tick, 1000);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', tick);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);

  const finish = useCallback(async () => {
    if (!attempt || attempt.status !== 'IN_PROGRESS' || lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(null);
    try {
      setAttempt((await repository.submitExamAttempt(attempt.id)).attempt);
    } catch {
      setError('Kết quả chưa được xác nhận lưu. Đề và đáp án đã lưu vẫn được giữ; hãy nộp lại.');
      nextAutoRetry.current = Date.now() + 10_000;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }, [attempt, repository]);
  useEffect(() => {
    if (
      !attempt ||
      attempt.status !== 'IN_PROGRESS' ||
      !isExamExpired(attempt, new Date(now)) ||
      now < nextAutoRetry.current
    )
      return;
    const timer = setTimeout(() => {
      void finish();
    }, 0);
    return () => clearTimeout(timer);
  }, [attempt, now, finish]);

  async function start(timed: boolean, withListening: boolean) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(null);
    try {
      const blueprint = { ...(withListening ? MIXED_EXAM_BLUEPRINT : CORE_EXAM_BLUEPRINT), timed };
      const created = createExamAttempt(
        crypto.randomUUID(),
        blueprint,
        getExamBank(),
        crypto.randomUUID(),
        new Date(),
      );
      setAttempt(await repository.createExamAttempt(created));
      nextAutoRetry.current = 0;
      setNow(Date.now());
    } catch {
      setError('Không tạo được đề. Kiểm tra bộ nhớ và ngân hàng câu hỏi rồi thử lại.');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function mutate(mutation: ExamMutation) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(null);
    try {
      setAttempt(await repository.mutateExamAttempt(mutation));
    } catch {
      setError('Thao tác chưa được lưu hoặc đề đã hết giờ. Hãy thử lại hoặc nộp bài.');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return { attempt, loading, busy, error, now, load, start, mutate, finish };
}
