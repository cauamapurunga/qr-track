# 📌 QRTrack – Sistema Inteligente de Criação e Rastreamento de QR Codes

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.12">
  <img src="https://img.shields.io/badge/FastAPI-High%20Performance-009485?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL 16">
  <img src="https://img.shields.io/badge/Docker-26-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Poetry-Dependency%20Manager-60A5FA?style=for-the-badge&logo=poetry&logoColor=white" alt="Poetry">
  <img src="https://img.shields.io/badge/ipgeolocation-API-FF6B6B?style=for-the-badge&logo=googlemaps&logoColor=white" alt="ipgeolocation API">
  <img src="https://img.shields.io/badge/ETL-Real%20Time-F97316?style=for-the-badge&logo=apacheairflow&logoColor=white" alt="ETL Real-Time">
  <img src="https://img.shields.io/badge/Architecture-Monolith-8B5CF6?style=for-the-badge&logo=serverfault&logoColor=white" alt="Monolithic Architecture">
  <img src="https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT Authentication">
</p>

## 📖 Visão Geral

O **QRTrack** é um sistema completo para **criação, gerenciamento e rastreamento de QR Codes dinâmicos** com pipeline **ETL em tempo real**. Ele atua como um *porteiro digital*, interceptando o acesso ao link original para coletar dados valiosos (IP, User-Agent, geolocalização) antes de redirecionar o usuário final.

Construído como um **monolito em Python**, utilizando **FastAPI**, o QRTrack integra criação de QR Codes, redirecionamento inteligente, análise de acessos e persistência dos dados no PostgreSQL.

---

## 🏗 Arquitetura de Fluxo e Integração

O QRTrack opera em **dois fluxos principais** que se conectam via API + banco de dados.

---

### 🔹 1. Fluxo de Criação e Gestão (Front-End → API)

| Componente | Ação | Integração |
|-----------|------|------------|
| Front-End | Envia a URL de destino | `POST /qr` |
| Back-End | Gera QR Code binário + short URL | FastAPI |
| Back-End | Salva metadados no PostgreSQL | Banco |
| Back-End | Retorna imagem + short URL | Resposta HTTP |

---

### 🔹 2. Fluxo de Rastreamento (Pipeline ETL em Tempo Real)

1. **Ingestão:** usuário acessa o short URL → captura IP e User-Agent  
2. **Transformação:**  
   - IP → *ipgeolocation API*  
   - User-Agent → bibliotecas Python  
3. **Carregamento:** dados registrados na tabela `scan_analytics`  
4. **Redirecionamento:** resposta HTTP 302 para o link final  

---

## 🔌 Endpoints da API (FastAPI)

### `POST /qr`
Cria um QR Code, gera short URL e salva dados.  
🔒 **Requer autenticação (JWT).**

### `GET /r/{short_code}`
Executa o pipeline ETL + redireciona o usuário.  
Captura: IP, navegador, device, geolocalização.

### `GET /analytics/{short_code}`
Retorna todas as informações analíticas de acessos.  
🔒 **Requer autenticação (JWT).**

---

## 🛠 Ferramentas e Tecnologias Utilizadas

| Categoria | Ferramenta | Detalhe |
|----------|------------|---------|
| Back-End | Python 3.12 | Linguagem principal |
| Framework | FastAPI | Alta performance para APIs e ETL |
| Banco de Dados | PostgreSQL 16 | Armazenamento analítico robusto |
| Containerização | Docker / Docker Compose | Ambientes reprodutíveis |
| Dependências | Poetry | Gerenciamento isolado de pacotes |
| Serviço Externo | ipgeolocation API | Enriquecimento de dados |
| Arquitetura | Monolito | Simplicidade e performance |

---

## ⚙️ Execução e Implantação

### 1️⃣ Pré-requisitos

- Python 3.x  
- Poetry  
- Docker / Docker Compose  

---

### 2️⃣ Instalar dependências

```bash
git clone URL_DO_SEU_REPOSITORIO
cd qrtrack
poetry install
```

---

### 3️⃣ Configurar o Banco de Dados (Local)
Crie o arquivo .env:

```ini
Copiar código
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=senha
DB_NAME=qrtrack
```
Suba o PostgreSQL:
```bash
Copiar código
docker-compose up -d postgres
```

---

### 4️⃣ Rodar a Aplicação
```bash
Copiar código
poetry shell
uvicorn main:app --reload
```

---

## 🧠 Informações Adicionais
### 🔸 Implementação ETL
O ETL é executado de forma síncrona no endpoint /r/{short_code}, garantindo que os dados sejam processados e salvos antes do redirecionamento.
Isso oferece baixa latência e alta consistência nos registros.

---

### 🔸 Autenticação
As rotas:

### `POST /qr`
### `GET /analytics/{short_code}`
🔒 **exigem JWT, garantindo que apenas o criador do QR Code tenha acesso aos dados e aos relatórios.**

---

### 🔸 Implantação
O projeto é facilmente implantável em serviços como:
- Render
- Heroku
- Usando a imagem Docker + PostgreSQL gerenciado.
