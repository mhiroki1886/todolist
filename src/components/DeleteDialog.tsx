import "./AlertDialog.css";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteDialog({ isOpen, onClose, onConfirm }: DeleteDialogProps) {
  return (
    <div className={`alert-dialog ${isOpen ? "open" : "closed"}`}>
      <div className="alert-dialog-content">
        <h2>ゴミ箱を空にしますか？</h2>
        <p>※削除したタスクは復元できません。</p>
        <div className="alert-dialog-actions">
          <button className="cancel" onClick={onClose}>
            キャンセル
          </button>
          <button className="confirm" onClick={onConfirm}>
            空にする
          </button>
        </div>
      </div>
    </div>
  );
}
