# 🎨 QRTrack Frontend

Interface moderna e responsiva para o sistema de rastreamento de QR Codes.

## ✨ Funcionalidades Implementadas

- ✅ Sistema de autenticação completo (Login/Registro)
- ✅ Validação de formulários
- ✅ Proteção de rotas
- ✅ Design system consistente
- ✅ Componentização e boas práticas
- ✅ Integração com backend via API REST
- ✅ Gerenciamento de estado com Context API
- ✅ Animações e transições suaves

## 🛠 Stack Tecnológica

- **React 19** - Biblioteca UI
- **Vite** - Build tool
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilização

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   └── PrivateRoute.jsx
│   ├── pages/             # Páginas da aplicação
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── services/          # Serviços de API
│   │   ├── api.js
│   │   └── authService.js
│   ├── context/           # Context API
│   │   └── AuthContext.jsx
│   ├── App.jsx           # Configuração de rotas
│   ├── main.jsx          # Entry point
│   └── index.css         # Estilos globais
```

## 🎨 Design System

### Cores
- **Primary**: `#00BFA6` (Verde Turquesa)
- **Black**: `#000000`
- **White**: `#FFFFFF`
- **Gray Scale**: 100-900

### Componentes
- **Button**: 3 variantes (primary, secondary, outline)
- **Input**: Com validação e mensagens de erro
- **Card**: Container com sombra e hover effects

## 🚀 Como Executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar servidor de desenvolvimento
```bash
npm run dev
```

O app estará disponível em: **http://localhost:5173**

### 3. Build para produção
```bash
npm run build
```

## 🔌 Integração com Backend

O frontend se conecta com o backend em `http://localhost:8000`

**Certifique-se de que o backend está rodando:**
```bash
cd ../backend
uvicorn app.main:app --reload
```

## 📋 Endpoints Utilizados

- `POST /users/register` - Criar nova conta
- `POST /users/login` - Fazer login
- `GET /users/me` - Dados do usuário autenticado

## 🔐 Autenticação

O sistema usa **JWT (JSON Web Tokens)**:
- Token salvo em `localStorage`
- Enviado automaticamente em todas as requisições
- Redirecionamento automático quando token expira

## 📱 Responsividade

O design é totalmente responsivo e funciona em:
- 📱 Mobile (< 768px)
- 💻 Desktop (> 768px)

## 🎯 Próximos Passos

- [ ] Implementar dashboard com QR Codes
- [ ] Adicionar criação de QR Codes
- [ ] Visualização de analytics
- [ ] Página de perfil do usuário
- [ ] Dark mode

---

Desenvolvido com ❤️ e ⚛️ React
