import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Usuário ou email é obrigatório';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.detail 
        ? (typeof error.detail === 'string' ? error.detail : 'Usuário ou senha incorretos')
        : 'Erro ao fazer login. Verifique suas credenciais.';
      setErrors({
        submit: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <h1>
            Bem-vindo ao <span className="text-primary">QRTrack</span>
          </h1>
          <p>Faça login para acessar sua conta</p>
        </div>

        <Card className="auth-card">
          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Usuário ou Email"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="Digite seu usuário ou email"
              fullWidth
              disabled={loading}
            />

            <Input
              label="Senha"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Digite sua senha"
              fullWidth
              disabled={loading}
            />

            {errors.submit && (
              <div className="error-message">
                {errors.submit}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className="auth-footer">
              <p>
                Não tem uma conta?{' '}
                <Link to="/register" className="auth-link">
                  Registre-se
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
