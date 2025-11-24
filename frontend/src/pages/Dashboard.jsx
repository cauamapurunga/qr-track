import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Modal } from '../components';
import './Dashboard.css';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="container">
            <h1>QRTrack Dashboard</h1>
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
            <div className="welcome-section">
              <h2>Bem-vindo ao <span className="text-primary">QRTrack</span></h2>
              <p>Sistema de rastreamento de QR Codes em construção...</p>
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
    </>
  );
};
