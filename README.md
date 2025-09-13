# Gestión de Pacientes

Aplicación full‑stack para gestionar pacientes.
- Backend: Node.js + Express + PostgreSQL
- Frontend: React (Vite)
- Autenticación con JWT cookies HTTP‑Only, CRUD de pacientes.

## Configuración rápida

1) Clonar
```bash
git clone https://github.com/ManguinhoEXE/Gestion-de-Usuarios.git
```

2) Backend (server)
```powershell
cd server
# crea .env desde el ejemplo (PowerShell)
Copy-Item .env.example .env
npm install
npm run dev   # o: node index.js
```

Crear base de datos (psql):
```sql
CREATE DATABASE gestion_pacientes;
```

3) Frontend (client)
```powershell
cd ../client
# crea .env.local desde el ejemplo
Copy-Item .env.example .env.local
npm install
npm run dev
```

Ejemplo de .env.local (client):
```env
# URL base del backend
VITE_API_URL=http://localhost:3000/api
```

## Estructura
```
gestion-pacientes/
├─ server/               
│  ├─ index.js
│  ├─ routes/
│  ├─ controllers/
│  ├─ db/                
│  ├─ .env.example
│  └─ .gitignore         
└─ client/              
   ├─ src/
   │  ├─ components/     
   │  ├─ pages/         
   │  └─ services/       
   ├─ .env.example
   └─ .gitignore         
```


## API

Usa cookies para mantener sesión:
- Guarda cookies con `-c cookies.txt` y reutilízalas con `-b cookies.txt`.

Base URL:
```bash
API=http://localhost:3000/api
```

Postman Link
```bash
https://solar-astronaut-516626.postman.co/workspace/My-Workspace~ceb6d6d9-f113-4c57-81ce-d0a5a374cc06/collection/25526723-3155ee19-bedf-400e-9a38-5d66c91433f3?action=share&creator=25526723&active-environment=25526723-9620fa5f-1d5d-435d-94df-3f743d640107
```
## Vista Previa
### Pantalla de Login

<img width="1920" height="945" alt="Vite-React-09-12-2025_03_14_PM" src="https://github.com/user-attachments/assets/dbfd273b-e724-47e1-89a3-db7034fb54aa" />

### Pantala de registro

<img width="1920" height="945" alt="Vite-React-09-12-2025_03_15_PM" src="https://github.com/user-attachments/assets/c9bb6bc7-b6f5-4793-ad77-9b952791bbd6" />

### Pantala de Gestion de Pacientes

<img width="1920" height="945" alt="Vite-React-09-12-2025_03_15_PM (1)" src="https://github.com/user-attachments/assets/2fdd7667-332b-4e91-8df3-2ebfff4ec724" />

### Pantala de listar pacientes

<img width="1920" height="945" alt="Vite-React-09-12-2025_03_16_PM" src="https://github.com/user-attachments/assets/a4952b20-cfd9-42b4-881f-4af3cadc7128" />






