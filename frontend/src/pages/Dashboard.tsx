import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Modal, Input, Card, DeleteModal, Logo } from '../components';
import { qrService, QRCode } from '../services/qrService';
import './Dashboard.css';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [qrToDelete, setQrToDelete] = useState<QRCode | null>(null);
  const [destinationUrl, setDestinationUrl] = useState('');
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdQr, setCreatedQr] = useState<QRCode | null>(null);

  useEffect(() => {
    loadQrCodes();
  }, []);

  const loadQrCodes = async () => {
    try {
      const codes = await qrService.list();
      // Ordenar por scan_count (mais vistos primeiro)
      const sortedCodes = codes.sort((a, b) => b.scan_count - a.scan_count);
      setQrCodes(sortedCodes);
    } catch (err: any) {
      console.error('Erro ao carregar QR codes:', err);
    }
  };

  const handleCreateQrCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!destinationUrl.trim()) {
      setError('Por favor, insira uma URL');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const newQr = await qrService.create({ destination_url: destinationUrl });
      setCreatedQr(newQr);
      setDestinationUrl('');
      await loadQrCodes();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao criar QR Code');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQrCode = async (code: string) => {
    try {
      await qrService.delete(code);
      await loadQrCodes();
      if (createdQr?.code === code) {
        setCreatedQr(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao deletar QR Code');
    }
  };

  const handleDeleteClick = (qr: QRCode) => {
    setQrToDelete(qr);
    setShowDeleteModal(true);
  };

  const handleAnalyticsClick = (code: string) => {
    navigate(`/analytics/${code}`);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <Logo size={40} />
              <h1>QRTrack</h1>
            </div>
            <div className="user-info">
              <span>Olá, {user?.username}!</span>
              <Button variant="outline" size="sm" onClick={() => setShowLogoutModal(true)}>
                Sair
              </Button>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <div className="container">
            <div className="qr-creator-section">
              <div className="creator-header">
                <div className="creator-info">
                  <h2>Criar QR Code</h2>
                  <p>Cole a URL que deseja rastrear</p>
                </div>
              </div>

              <form onSubmit={handleCreateQrCode} className="qr-form">
                <div className="form-group">
                  <Input
                    type="url"
                    placeholder="https://seu-link.com"
                    value={destinationUrl}
                    onChange={(e: any) => setDestinationUrl(e.target.value)}
                    disabled={loading}
                  />
                  <button type="submit" disabled={loading} className="qr-create-btn">
                    {loading ? (
                      <span>Gerando...</span>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="3" width="7" height="7" fill="currentColor" stroke="currentColor" strokeWidth="1"/>
                          <rect x="14" y="3" width="7" height="7" fill="currentColor" stroke="currentColor" strokeWidth="1"/>
                          <rect x="3" y="14" width="7" height="7" fill="currentColor" stroke="currentColor" strokeWidth="1"/>
                          <rect x="5" y="5" width="3" height="3" fill="white"/>
                          <rect x="16" y="5" width="3" height="3" fill="white"/>
                          <rect x="5" y="16" width="3" height="3" fill="white"/>
                          <rect x="14" y="14" width="3" height="3" fill="currentColor"/>
                          <rect x="18" y="14" width="3" height="3" fill="currentColor"/>
                          <rect x="14" y="18" width="3" height="3" fill="currentColor"/>
                          <rect x="18" y="18" width="3" height="3" fill="currentColor"/>
                        </svg>
                        <span>Gerar</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              {error && <div className="error-message">{error}</div>}

              {createdQr && (
                <div className="qr-display-inline">
                  <div className="qr-display-content">
                    <div className="qr-display-image">
                      <img 
                        src={qrService.getImageUrl(createdQr.code)} 
                        alt="QR Code"
                        className="qr-image"
                      />
                    </div>
                    <div className="qr-display-info">
                      <h4>✓ QR Code Criado!</h4>
                      <div className="info-item">
                        <span className="label">Código:</span>
                        <code>{createdQr.code}</code>
                      </div>
                      <div className="info-item">
                        <span className="label">Destino:</span>
                        <a href={createdQr.destination_url} target="_blank" rel="noopener noreferrer" className="url-link">
                          {createdQr.destination_url}
                        </a>
                      </div>
                      <div className="info-item full-width">
                        <span className="label">Compartilhar:</span>
                        <div className="share-url-container">
                          <input 
                            type="text" 
                            readOnly 
                            value={qrService.getRedirectUrl(createdQr.code)}
                            className="share-url"
                            onClick={(e: any) => e.target.select()}
                          />
                          <button 
                            type="button"
                            className="copy-btn"
                            onClick={() => {
                              const url = qrService.getRedirectUrl(createdQr.code);
                              navigator.clipboard.writeText(url);
                              alert('URL copiada!');
                            }}
                          >
                            Copiar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="qr-list-section">
              <h2>Meus QR Codes</h2>
              {qrCodes.length === 0 ? (
                <p className="empty-message">Você ainda não criou nenhum QR Code</p>
              ) : (
                <div className="qr-grid">
                  {qrCodes.map((qr) => (
                    <Card key={qr.id} className="qr-card">
                      <div className="qr-card-image">
                        <img 
                          src={qrService.getImageUrl(qr.code)} 
                          alt={`QR Code ${qr.code}`}
                        />
                      </div>
                      <div className="qr-card-info">
                        <p className="qr-code-text">{qr.code}</p>
                        <p className="qr-destination">{qr.destination_url}</p>
                        <div className="qr-share-url-container">
                          <label>URL de compartilhamento:</label>
                          <input 
                            type="text" 
                            readOnly 
                            value={qrService.getRedirectUrl(qr.code)}
                            className="qr-share-url-small"
                            onClick={(e: any) => e.target.select()}
                          />
                        </div>
                        <p className="qr-scans">Scans: {qr.scan_count}</p>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAnalyticsClick(qr.code)}
                          >
                            Analisar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteClick(qr)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Sair da conta"
        message="Tem certeza que deseja sair?"
        confirmText="Sim, sair"
        cancelText="Cancelar"
      />

      {qrToDelete && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setQrToDelete(null);
          }}
          onConfirm={() => handleDeleteQrCode(qrToDelete.code)}
          qrCode={qrToDelete.code}
        />
      )}
    </>
  );
};
