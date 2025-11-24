# 📌 QRTrack – Sistema de Rastreamento de QR Codes com Analytics em Tempo Real

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.11">
  <img src="https://img.shields.io/badge/FastAPI-High%20Performance-009485?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL 16">
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/ipgeolocation.io-API-FF6B6B?style=for-the-badge&logo=googlemaps&logoColor=white" alt="ipgeolocation API">
  <img src="https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT Authentication">
</p>

## 📖 Visão Geral

O **QRTrack** é um sistema completo para **criação, gerenciamento e rastreamento de QR Codes** com analytics avançados em tempo real. O sistema captura automaticamente dados de cada acesso (IP, navegador, dispositivo, geolocalização) antes de redirecionar para o destino final, funcionando como um "porteiro digital".

**Principais funcionalidades:**
- 🔐 Autenticação JWT
- 📊 Analytics detalhados (browsers, OS, dispositivos, países, cidades)
- 🌍 Geolocalização via ipgeolocation.io
- 🗓️ Filtros por período
- 🖼️ Geração de imagens QR Code em PNG
- 🔄 Redirecionamento inteligente com captura de dados

## 📁 Estrutura do Projeto

```
qr-track/
├── backend/          # API FastAPI + PostgreSQL
│   ├── app/         # Código da aplicação
│   ├── migrations/  # Migrations do banco
│   └── README.md    # Documentação do backend
└── frontend/        # Interface web (a ser implementado)
    └── README.md    # Documentação do frontend
```

## 🚀 Começando

Para instruções detalhadas de instalação e configuração:

- **Backend**: Veja [backend/README.md](backend/README.md)
- **Frontend**: Veja [frontend/README.md](frontend/README.md)

### Quick Start - Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
docker-compose up -d
alembic upgrade head
uvicorn app.main:app --reload
```

### Quick Start - Frontend

```bash
cd frontend
# Escolha seu framework preferido (React/Vue/Next.js)
# Veja instruções em frontend/README.md
```

---

## 📝 Licença

MIT License
