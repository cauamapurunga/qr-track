# 📌 QRTrack – Sistema de Rastreamento de QR Codes com Analytics em Tempo Real

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.11">
  <img src="https://img.shields.io/badge/FastAPI-0.121-009485?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI 0.121">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.9">
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL 16">
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT Authentication">
</p>

## 📖 Visão Geral

O **QRTrack** é um sistema completo e moderno para **criação, gerenciamento e rastreamento de QR Codes** com analytics avançados em tempo real. O sistema captura automaticamente dados de cada acesso (IP, navegador, dispositivo, geolocalização) antes de redirecionar para o destino final, funcionando como um "porteiro digital".

**Principais funcionalidades:**
- 🔐 **Autenticação JWT** - Segurança com tokens JWT
- 📊 **Analytics Avançados** - Browsers, OS, dispositivos, países, cidades
- 🌍 **Geolocalização** - Integração com ipgeolocation.io
- 📅 **Filtros por Período** - Análise de dados por intervalo de tempo
- 🎨 **Geração de QR Codes** - Imagens PNG de alta qualidade
- 🗺️ **Mapa de Calor** - Visualização geográfica dos acessos
- 🔄 **Redirecionamento Inteligente** - Captura de dados antes do redirect
- ⚡ **Performance** - FastAPI + React para máxima velocidade
- 📱 **Responsivo** - Interface adaptada para todos os dispositivos

## 📁 Estrutura do Projeto

```
qr-track/
├── backend/                    # API FastAPI + PostgreSQL
│   ├── app/
│   │   ├── main.py            # Aplicação principal
│   │   ├── routes.py          # Rotas de usuários
│   │   ├── qr_routes.py       # Rotas de QR Codes
│   │   ├── auth_user.py       # Lógica de autenticação
│   │   ├── qr_code_use_cases.py  # Use cases de QR
│   │   ├── schemas.py         # Schemas Pydantic
│   │   ├── depends.py         # Dependências FastAPI
│   │   └── db/
│   │       ├── models.py      # Modelos SQLAlchemy
│   │       ├── connection.py  # Conexão DB
│   │       └── base.py        # Base SQLAlchemy
│   ├── migrations/            # Migrations Alembic
│   ├── requirements.txt       # Dependências Python
│   ├── docker-compose.yml     # PostgreSQL + config
│   ├── alembic.ini           # Config Alembic
│   └── .env                  # Variáveis de ambiente
│
└── frontend/                  # Interface React + TypeScript
    ├── src/
    │   ├── main.tsx          # Entry point
    │   ├── App.tsx           # Componente principal
    │   ├── index.css         # Estilos globais
    │   ├── components/       # Componentes reutilizáveis
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Modal.tsx
    │   │   ├── MapHeatMap.tsx
    │   │   ├── HeatMap.tsx
    │   │   ├── DeleteModal.tsx
    │   │   ├── Input.tsx
    │   │   ├── Logo.tsx
    │   │   └── PrivateRoute.tsx
    │   ├── pages/            # Páginas principais
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── Dashboard.tsx
    │   │   └── Analytics.tsx
    │   ├── services/         # Serviços HTTP
    │   │   ├── api.ts        # Configuração Axios
    │   │   ├── authService.ts
    │   │   ├── qrService.ts
    │   │   └── analyticsService.ts
    │   └── context/          # Context API
    │       └── AuthContext.tsx
    ├── public/               # Assets estáticos
    ├── package.json          # Dependências Node
    ├── vite.config.js        # Config Vite
    ├── tsconfig.json         # Config TypeScript
    └── .env                  # Variáveis de ambiente
```

## 🛠️ Stack Tecnológico

### Backend
- **FastAPI** 0.121.3 - Framework web de alta performance
- **PostgreSQL** 16 - Banco de dados relacional
- **SQLAlchemy** 2.0 - ORM Python
- **Alembic** 1.17 - Migrações de banco de dados
- **JWT** - Autenticação segura
- **bcrypt** - Hash de senhas
- **qrcode + Pillow** - Geração de imagens QR
- **user-agents** - Parser de User-Agent
- **requests** - Cliente HTTP
- **ipgeolocation.io** - API de geolocalização

### Frontend
- **React** 19.2.0 - Biblioteca UI
- **TypeScript** 5.9.3 - Tipagem JavaScript
- **Vite** 7.2.4 - Build tool rápido
- **Axios** 1.13.2 - Cliente HTTP
- **React Router** 7.9.6 - Roteamento
- **Leaflet + React Leaflet** - Mapas interativos
- **ESLint** - Linting de código

## 🚀 Início Rápido

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- npm ou yarn

### Instalação e Execução

#### 1. Clone o repositório
```bash
git clone https://github.com/cauamapurunga/qr-track.git
cd qr-track
```

#### 2. Configure o Backend

```bash
cd backend

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure o arquivo .env (veja exemplo abaixo)
# Inicie o PostgreSQL com Docker
docker-compose up -d

# Execute as migrations
alembic upgrade head

# Inicie o servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend estará disponível em: `http://localhost:8000`
Documentação interativa: `http://localhost:8000/docs`

#### 3. Configure o Frontend

```bash
cd ../frontend

# Instale as dependências
npm install

# Configure o arquivo .env
# Inicie o servidor de desenvolvimento
npm run dev
```

Frontend estará disponível em: `http://localhost:5173`

### Configuração de Variáveis de Ambiente

#### Backend (backend/.env)
```env
# PostgreSQL
POSTGRES_USER=admin
POSTGRES_PASSWORD=adminpass
POSTGRES_DB=main
DB_URL=postgresql+psycopg2://admin:adminpass@localhost:5433/main

# JWT
SECRET_KEY=sua_chave_secreta_aqui
ALGORITHM=HS256

# API Externa
IPGEOLOCATION_API_KEY=sua_api_key_aqui
```

#### Frontend (frontend/.env)
```env
VITE_API_URL=http://localhost:8000
```

## 📊 Funcionalidades Principais

### 🔐 Autenticação
- Registro de novos usuários
- Login com JWT
- Proteção de rotas
- Logout com limpeza de sessão

### 📌 Gerenciamento de QR Codes
- Criar QR Codes com URL customizada
- Visualizar lista de QR Codes
- Deletar QR Codes
- Download de imagens QR em PNG
- Código curto automático

### 📈 Analytics em Tempo Real
- Visualização de scans totais
- Dados por navegador
- Dados por sistema operacional
- Dados por dispositivo
- Geolocalização (país e cidade)
- Filtros por data
- Mapa de calor com coordenadas

### 🗺️ Visualizações
- Gráficos de distribuição
- Mapa interativo com pontos de acesso
- Heatmap visual dos acessos

## 📝 Endpoints Principais da API

### Autenticação
- `POST /users/register` - Registrar novo usuário
- `POST /users/login` - Fazer login
- `GET /users/me` - Obter dados do usuário autenticado

### QR Codes
- `POST /qr-codes/create` - Criar novo QR Code
- `GET /qr-codes/my-codes` - Listar QR Codes do usuário
- `GET /qr-codes/{code}` - Detalhes de um QR Code
- `DELETE /qr-codes/{qr_code_id}` - Deletar QR Code

### Analytics
- `GET /analytics/{code}` - Analytics de um QR Code específico
- `GET /analytics/{code}/by-browser` - Dados agrupados por navegador
- `GET /analytics/{code}/by-os` - Dados agrupados por SO
- `GET /analytics/{code}/by-device` - Dados agrupados por dispositivo
- `GET /analytics/{code}/by-country` - Dados agrupados por país

## 🧪 Testando a API

### Com cURL
```bash
# Registrar
curl -X POST http://localhost:8000/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","email":"teste@example.com","password":"senha123"}'

# Login
curl -X POST http://localhost:8000/users/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=teste&password=senha123"
```

### Documentação Interativa
Acesse `http://localhost:8000/docs` para testar todos os endpoints com a interface Swagger UI

## 🐛 Troubleshooting

### Backend não conecta ao banco
- Verifique se Docker está rodando: `docker ps`
- Reinicie o container: `docker-compose restart`
- Verifique as credenciais no `.env`

### Frontend não consegue acessar a API
- Confirme que `VITE_API_URL` está correto no `.env`
- Verifique se o backend está rodando na porta 8000
- Verifique erros no console do navegador (F12)

### Erro ao fazer migrations
- Certifique-se que o PostgreSQL está rodando
- Execute: `alembic upgrade head`
- Se persistir, resete: `docker-compose down` e `docker-compose up -d`
