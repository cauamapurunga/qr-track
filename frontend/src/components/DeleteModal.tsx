import { useState } from 'react';
import { Button, Input } from './';
import './Modal.css';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  qrCode: string;
}

export const DeleteModal = ({ isOpen, onClose, onConfirm, qrCode }: DeleteModalProps) => {
  const [inputValue, setInputValue] = useState('');
  const confirmPhrase = 'EXCLUIR';

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (inputValue === confirmPhrase) {
      onConfirm();
      setInputValue('');
      onClose();
    }
  };

  const handleClose = () => {
    setInputValue('');
    onClose();
  };

  const isValid = inputValue === confirmPhrase;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Excluir QR Code</h3>
        <div className="modal-message">
          <p>Você está prestes a excluir o QR Code <strong>{qrCode}</strong></p>
          <p>Esta ação não pode ser desfeita!</p>
          <p style={{ marginTop: '16px' }}>
            Digite <strong style={{ color: 'var(--color-primary)' }}>{confirmPhrase}</strong> para confirmar:
          </p>
          <Input
            type="text"
            value={inputValue}
            onChange={(e: any) => setInputValue(e.target.value)}
            placeholder={confirmPhrase}
            style={{ marginTop: '12px' }}
          />
        </div>
        
        <div className="modal-actions">
          <Button 
            variant="outline" 
            onClick={handleClose}
            fullWidth
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirm}
            disabled={!isValid}
            fullWidth
          >
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
};
