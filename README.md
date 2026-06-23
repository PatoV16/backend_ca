backend_ca
TL;DR
Backend construido con NestJS que complementa la aplicación principal (gestión de recursos, uploads, integraciones con Cloudinary y PostgreSQL).

Características principales

NestJS + TypeORM (Postgres)
Uploads con multer + Cloudinary
Autenticación JWT
Tests con Jest
Stack técnico

Node.js, TypeScript, NestJS
PostgreSQL (pg)
Cloudinary para almacenamiento de medios
Jest, Supertest
Instalación rápida

git clone https://github.com/PatoV16/backend_ca.git
cd backend_ca
npm install
cp .env.example .env (edita valores)
npm run start:dev
Scripts

npm run start
npm run start:dev
npm run build
npm run test
Variables de entorno (ver .env.example)

Notas

Configura Cloudinary si deseas probar uploads (CLOUDINARY_URL)
Si usas Docker, el Dockerfile propuesto construye la app y ejecuta dist/main
