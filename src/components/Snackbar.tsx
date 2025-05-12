import "./Snackbar.css";

interface SnackbarProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Snackbar({ message, isOpen, onClose }: SnackbarProps) {
  return (
    <div className={`snackbar ${isOpen ? "show" : "hide"}`}>
      <div className="snackbar-content">
        <p>{message}</p>
        <button onClick={onClose}>×</button>
      </div>
    </div>
  );
}
