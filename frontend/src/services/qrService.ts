import api from './api';

export interface QRCode {
  id: number;
  code: string;
  destination_url: string;
  created_at: string;
  scan_count: number;
}

export interface CreateQRCodeData {
  destination_url: string;
}

export const qrService = {
  // Criar novo QR Code
  create: async (data: CreateQRCodeData): Promise<QRCode> => {
    const response = await api.post('/qr', data);
    return response.data;
  },

  // Listar QR Codes do usuário
  list: async (): Promise<QRCode[]> => {
    const response = await api.get('/qr');
    return response.data;
  },

  // Obter URL da imagem do QR Code
  getImageUrl: (code: string): string => {
    return `http://127.0.0.1:8000/qr/image/${code}`;
  },

  // Obter URL de redirecionamento
  getRedirectUrl: (code: string): string => {
    return `http://127.0.0.1:8000/r/${code}`;
  },

  // Deletar QR Code
  delete: async (code: string): Promise<void> => {
    await api.delete(`/qr/${code}`);
  }
};
