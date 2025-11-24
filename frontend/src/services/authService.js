import api from './api';

export const authService = {
  async register(userData) {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erro ao registrar usuário' };
    }
  },

  async login(credentials) {
    try {
      // O backend espera form data, não JSON
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await api.post('/users/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { access_token } = response.data;
      
      // Salvar token no localStorage
      localStorage.setItem('token', access_token);
      
      // Buscar dados do usuário
      const user = await this.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token: access_token, user };
    } catch (error) {
      throw error.response?.data || { detail: 'Erro ao fazer login' };
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erro ao buscar usuário' };
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
