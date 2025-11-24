import { Button } from './Button';
import './Modal.css';

export const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmar', 
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        
        <div className="modal-actions">
          <Button 
            variant="outline" 
            onClick={onClose}
            fullWidth
          >
            {cancelText}
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            fullWidth
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
