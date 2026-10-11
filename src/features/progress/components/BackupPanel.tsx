import { useState } from 'react';
import { useProgressRepository } from '../../../app/providers/ProgressRepositoryProvider';
import {
  serializeBackup,
  parseBackup,
  MAX_BACKUP_BYTES,
  type ProgressSnapshot,
} from '../../../domain/progress/backup';
import { Button } from '../../../components/ui/Button';
import { resetLessonSnapshot } from '../../../domain/progress/reset-lesson-snapshot';
import { clearWritingDraftCache } from '../../practice/state/use-writing-draft';

function download(snapshot: ProgressSnapshot) {
  const url = URL.createObjectURL(
    new Blob([serializeBackup(snapshot)], { type: 'application/json' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = `tc3-backup-${new Date().toISOString().replaceAll(':', '-')}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function BackupPanel() {
  const { repository, retryStorage } = useProgressRepository();
  const [preview, setPreview] = useState<ProgressSnapshot | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetLesson, setResetLesson] = useState(1);
  async function exportBackup() {
    setBusy(true);
    setError(null);
    try {
      download(await repository.getSnapshot());
      setMessage('Đã tạo file sao lưu. Hãy giữ file ở nơi an toàn.');
    } catch (error) {
      setError(
        error instanceof Error && error.message === 'Backup exceeds 10 MiB.'
          ? 'Bản sao vượt 10 MiB. Chưa tạo file có thể khôi phục; dữ liệu hiện tại vẫn được giữ.'
          : 'Không xuất được dữ liệu. Hãy thử kết nối lại bộ nhớ.',
      );
    } finally {
      setBusy(false);
    }
  }
  async function readFile(file: File | undefined) {
    setPreview(null);
    setError(null);
    setMessage(null);
    if (!file) return;
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error('File lớn hơn 10 MiB.');
      setPreview(parseBackup(await file.text()));
    } catch {
      setError('File sao lưu không hợp lệ hoặc vượt 10 MiB. Dữ liệu hiện tại chưa thay đổi.');
    }
  }
  async function replace(
    snapshot: ProgressSnapshot | ((current: ProgressSnapshot) => ProgressSnapshot),
    resetting: false | number | 'all' = false,
  ) {
    if (busy) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const current = await repository.getSnapshot();
      const replacement = typeof snapshot === 'function' ? snapshot(current) : snapshot;
      download(current);
      if (
        !window.confirm(
          'Đã yêu cầu tải bản sao hiện tại. Hãy kiểm tra đã lưu được file, đóng các tab học khác rồi xác nhận thay dữ liệu trên trình duyệt này?',
        )
      )
        return;
      if (
        resetting &&
        !window.confirm(
          resetting === 'all'
            ? 'Xác nhận lần cuối: xóa toàn bộ tiến độ, bài viết và lịch sử trên trình duyệt này?'
            : `Xác nhận lần cuối: xóa tiến độ, bản nháp và lượt luyện tập riêng của bài ${resetting}?`,
        )
      )
        return;
      await repository.restoreSnapshot(replacement, current);
      clearWritingDraftCache(repository);
      setPreview(null);
      setMessage(
        resetting ? 'Đã xóa dữ liệu. Có thể khôi phục từ file sao lưu.' : 'Đã khôi phục dữ liệu.',
      );
      await retryStorage();
    } catch (error) {
      setError(
        error instanceof Error && error.message === 'Backup exceeds 10 MiB.'
          ? 'Bản sao hiện tại vượt 10 MiB; thao tác thay hoặc xóa đã bị chặn để giữ dữ liệu.'
          : 'Không thay được dữ liệu. Nếu một tab khác vừa cập nhật, hãy sao lưu lại rồi thử lại.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="review-section" aria-labelledby="backup-title">
      <h2 id="backup-title">Sao lưu & dữ liệu cá nhân</h2>
      <p>
        Dữ liệu học và bài viết nằm trên trình duyệt hiện tại, không tự đồng bộ giữa các máy. Xóa dữ
        liệu trình duyệt có thể làm mất tiến độ. File sao lưu chứa bài viết của bạn; hãy tự bảo
        quản.
      </p>
      <div className="practice-controls">
        <Button disabled={busy} onClick={() => void exportBackup()}>
          Xuất bản sao lưu JSON
        </Button>
        <label>
          Chọn file khôi phục
          <input
            type="file"
            accept="application/json,.json"
            disabled={busy}
            onChange={(event) => void readFile(event.target.files?.[0])}
          />
        </label>
      </div>
      {preview ? (
        <div className="card">
          <p>
            Xem trước: {preview.lessons.length} bài, {preview.results.length} lượt luyện tập,{' '}
            {preview.reviewItems.length} mục ôn,{' '}
            {preview.settings.filter((item) => item.key.startsWith('writing-draft:')).length} bản
            nháp.
          </p>
          <p>Khôi phục sẽ thay dữ liệu hiện tại. Ứng dụng tạo bản sao trước khi thay.</p>
          <Button disabled={busy} onClick={() => void replace(preview)}>
            Khôi phục và thay dữ liệu
          </Button>
        </div>
      ) : null}
      <Button
        variant="danger"
        disabled={busy}
        onClick={() =>
          void replace(
            { lessons: [], results: [], reviewItems: [], receipts: [], settings: [] },
            'all',
          )
        }
      >
        Xóa toàn bộ dữ liệu học
      </Button>
      <div className="practice-controls">
        <label>
          Bài cần xóa
          <select
            value={resetLesson}
            disabled={busy}
            onChange={(event) => setResetLesson(Number(event.target.value))}
          >
            {Array.from({ length: 15 }, (_, index) => (
              <option key={index} value={index + 1}>
                Bài {index + 1}
              </option>
            ))}
          </select>
        </label>
        <Button
          variant="danger"
          disabled={busy}
          onClick={() =>
            void replace((current) => resetLessonSnapshot(current, resetLesson), resetLesson)
          }
        >
          Xóa dữ liệu của bài đã chọn
        </Button>
      </div>
      {message ? <p role="status">{message}</p> : null}
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
