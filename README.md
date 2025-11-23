# 📌 QRTrack – Sistema de Rastreamento de QR Codes com Analytics em Tempo Real

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.14">
  <img src="https://img.shields.io/badge/FastAPI-High%20Performance-009485?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL 16">
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/ipgeolocation.io-API-FF6B6B?style=for-the-badge&logo=googlemaps&logoColor=white" alt="ipgeolocation API">
  <img src="https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT Authentication">
</p>

## 📖 Visão Geral

O **QRTrack** é uma API completa para **criação, gerenciamento e rastreamento de QR Codes** com analytics avançados em tempo real. O sistema captura automaticamente dados de cada acesso (IP, navegador, dispositivo, geolocalização) antes de redirecionar para o destino final, funcionando como um "porteiro digital".

**Principais funcionalidades:**
- 🔐 Autenticação JWT
- 📊 Analytics detalhados (browsers, OS, dispositivos, países, cidades)
- 🌍 Geolocalização via ipgeolocation.io
- 🗓️ Filtros por período
- 🖼️ Geração de imagens QR Code em PNG
- 🔄 Redirecionamento inteligente com captura de dados

---

## 🛠 Stack Tecnológica

| Tecnologia | Uso |
|-----------|-----|
| **FastAPI** | Framework web de alta performance |
| **PostgreSQL 16** | Banco de dados relacional |
| **SQLAlchemy** | ORM para Python |
| **Alembic** | Migrations de banco de dados |
| **JWT** | Autenticação e autorização |
| **bcrypt** | Hash de senhas |
| **qrcode + Pillow** | Geração de imagens QR Code |
| **user-agents** | Parser de User-Agent |
| **requests** | Cliente HTTP para APIs externas |
| **ipgeolocation.io** | API de geolocalização por IP |
| **python-dotenv** | Gerenciamento de variáveis de ambiente |
| **Docker Compose** | Orquestração de containers |

---

## 🔌 Endpoints da API

### 🔐 **Autenticação**

#### `POST /users/register`
Registra um novo usuário.
```json
{
  "username": "user",
  "email": "user@email.com",
  "password": "senha123"
}
```

#### `POST /users/login`
Login com username ou email (form data).
```
username: user
password: senha123
```
Retorna token JWT.

#### `GET /users/me`
🔒 Retorna dados do usuário autenticado.

---

### 📊 **QR Codes**

#### `POST /qr`
🔒 Cria um novo QR Code.
```json
{
  "destination_url": "https://example.com"
}
```

#### `GET /qr`
🔒 Lista todos os QR Codes do usuário.

#### `GET /qr/image/{code}`
Retorna a imagem PNG do QR Code (público).

#### `DELETE /qr/{code}`
🔒 Deleta um QR Code e seus analytics.

---

### 🌍 **Redirect e Analytics**

#### `GET /r/{code}`
Redireciona para URL de destino e captura analytics automaticamente:
- IP address
- Browser e versão
- Sistema operacional e versão
- Tipo de dispositivo
- País, cidade, coordenadas
- Timezone e ISP

#### `GET /analytics/{code}?days=7`
🔒 Retorna analytics detalhados do QR Code.

**Parâmetros opcionais:**
- `days`: Filtro por período (ex: `?days=7` para últimos 7 dias)

**Resposta inclui:**
```json
{
  "total_scans": 100,
  "unique_visitors": 75,
  "top_browsers": [{"name": "Chrome", "count": 60}],
  "top_os": [{"name": "Android", "count": 50}],
  "top_devices": [{"name": "Mobile", "count": 80}],
  "top_countries": [
    {
      "name": "Brazil",
      "count": 60,
      "top_cities": [
        {"name": "São Paulo", "count": 30},
        {"name": "Rio de Janeiro", "count": 20}
      ]
    }
  ],
  "scans": [...]
}
```

---

## ⚙️ Configuração e Execução

### 1️⃣ Pré-requisitos

- Python 3.14+
- Docker & Docker Compose
- Conta na [ipgeolocation.io](https://ipgeolocation.io) (plano free: 1000 requests/dia)

---

### 2️⃣ Instalação

```bash
git clone https://github.com/cauamapurunga/qr-track.git
cd qr-track
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

---

### 3️⃣ Configuração

Crie o arquivo `.env` na raiz do projeto:

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=adminpass
POSTGRES_DB=main
DB_URL="postgresql+psycopg2://admin:adminpass@localhost:5433/main"
SECRET_KEY=sua_chave_secreta_aqui
ALGORITHM=HS256
IPGEOLOCATION_API_KEY=sua_api_key_aqui
```

---

### 4️⃣ Iniciar Banco de Dados

```bash
docker-compose up -d
```

---

### 5️⃣ Rodar Migrations

```bash
alembic upgrade head
```

---

### 6️⃣ Iniciar Servidor

```bash
uvicorn app.main:app --reload
```

A API estará disponível em: **http://localhost:8000**

Documentação interativa: **http://localhost:8000/docs**

---

## 📁 Estrutura do Projeto

```
qr-track/
├── app/
│   ├── db/
│   │   ├── base.py
│   │   ├── connection.py
│   │   └── models.py          # SQLAlchemy models
│   ├── auth_user.py            # Lógica de autenticação
│   ├── depends.py              # Dependências FastAPI
│   ├── main.py                 # App principal
│   ├── qr_code_use_cases.py    # Lógica de QR codes
│   ├── qr_routes.py            # Rotas de QR codes
│   ├── router.py               # Rotas de usuários
│   └── schemas.py              # Pydantic schemas
├── migrations/                 # Alembic migrations
├── .env                        # Variáveis de ambiente
├── .env.example                # Template de .env
├── alembic.ini                 # Config do Alembic
├── docker-compose.yml          # PostgreSQL container
├── requirements.txt            # Dependências Python
└── README.md
```

---

## 🚀 Deploy

O projeto pode ser deployado em:

- **Railway** (recomendado)
- **Render**
- **Heroku**
- **DigitalOcean App Platform**

**Não esqueça de:**
1. Configurar as variáveis de ambiente
2. Rodar as migrations: `alembic upgrade head`
3. Ajustar a porta se necessário

---

## 📝 Licença

MIT License
- Heroku
- Usando a imagem Docker + PostgreSQL gerenciado.
