# 📌 QRTrack Backend – API REST com FastAPI

## 📖 Visão Geral

Backend do **QRTrack** - API completa para **criação, gerenciamento e rastreamento de QR Codes** com analytics avançados em tempo real.

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

---

## ⚙️ Configuração e Execução

### 1️⃣ Pré-requisitos

- Python 3.11+
- Docker & Docker Compose
- Conta na [ipgeolocation.io](https://ipgeolocation.io) (plano free: 1000 requests/dia)

---

### 2️⃣ Instalação

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

---

### 3️⃣ Configuração

Crie o arquivo `.env` na raiz do backend:

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

## 📁 Estrutura do Backend

```
backend/
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
│   ├── routes.py               # Rotas de usuários
│   └── schemas.py              # Pydantic schemas
├── migrations/                 # Alembic migrations
├── .env                        # Variáveis de ambiente
├── alembic.ini                 # Config do Alembic
├── docker-compose.yml          # PostgreSQL container
└── requirements.txt            # Dependências Python
```

---

## 📝 Licença

MIT License
