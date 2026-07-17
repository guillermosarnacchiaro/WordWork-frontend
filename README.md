# WordWork — Frontend

Frontend de WordWork, una aplicación web de mensajería desarrollada como trabajo integrador final de la Diplomatura en Desarrollo Web de UTN.

Permite registrarse, verificar el correo electrónico, iniciar sesión y conversar con otros usuarios mediante chats privados o grupales. Se integra con una API REST propia desarrollada con Express y MongoDB.

## Funcionalidades

- Registro de usuarios y verificación por correo electrónico.
- Reenvío del enlace de verificación.
- Inicio de sesión mediante JWT.
- Rutas privadas para usuarios autenticados.
- Listado y búsqueda de usuarios verificados.
- Conversaciones privadas.
- Creación y administración de grupos.
- Roles de administrador y miembro.
- Envío, recepción y búsqueda de mensajes.
- Indicadores de enviado, entregado y leído.
- Perfil con nombre, biografía, foto, disponibilidad y última conexión.
- Tema claro y oscuro.
- Diseño responsive entre 320 y 2000 px.

## Tecnologías

- React 19
- Vite 7
- React Router
- Fetch API
- Lucide React
- Inter Variable
- ESLint

## Requisitos

- Node.js 24 recomendado (Vite 7 requiere una versión moderna de Node).
- npm.
- Backend de WordWork en ejecución.

## Instalación

```bash
git clone <URL_DEL_REPOSITORIO_FRONTEND>
cd trabajo-final-wsap
npm install
```

Copiar `.env.example` como `.env`:

```env
VITE_API_URL=http://localhost:3000
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible normalmente en `http://localhost:5173`.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia Vite en modo desarrollo |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Previsualiza localmente la compilación |
| `npm run lint` | Ejecuta ESLint |

## Rutas del frontend

| Ruta | Acceso | Pantalla |
|---|---|---|
| `/` | Público | Inicio de sesión |
| `/registro` | Público | Registro de usuario |
| `/chat` | JWT | Listado de conversaciones y usuarios |
| `/chat/:id` | JWT | Conversación seleccionada |
| `/profile` | JWT | Perfil del usuario |

Las rutas privadas son controladas por `ProtectedRoute`. El JWT y los datos básicos de la sesión se conservan en `localStorage`.

## Estructura

```text
src/
├── components/   # Componentes reutilizables y modales
├── context/      # Estado global del chat
├── pages/        # Login, registro, chat y perfil
├── services/     # Comunicación con la API REST
├── App.jsx       # Definición de rutas
├── index.css     # Estilos globales y responsive
└── main.jsx      # Punto de entrada
```

## Integración con la API

La URL base se obtiene de `VITE_API_URL`. Las solicitudes privadas incluyen:

```http
Authorization: Bearer <JWT>
Content-Type: application/json
```

Cuando el backend responde con un error, el frontend muestra el mensaje correspondiente sin exponer información técnica.

## Responsive

La interfaz fue preparada para resoluciones entre 320 y 2000 px:

- En escritorio se muestran el panel lateral y la conversación simultáneamente.
- Por debajo de 900 px se muestra una vista móvil con navegación entre listado y chat.
- Los modales se transforman en paneles inferiores en pantallas pequeñas.
- Se usa `100dvh` para adaptarse correctamente a navegadores móviles.

## Verificación antes de entregar

```bash
npm run lint
npm run build
```

## Despliegue

El frontend puede desplegarse en Vercel. Debe configurarse esta variable en el proyecto desplegado:

```env
VITE_API_URL=https://URL-DEL-BACKEND
```

El archivo `vercel.json` incluye la reescritura necesaria para que React Router resuelva `/chat/:id`, `/profile` y las demás rutas al recargar la página.

## Enlaces de entrega

- Frontend desplegado: pendiente.
- Backend desplegado: pendiente.
- Repositorio backend: carpeta [`backend`](./backend/README.md) durante el desarrollo local.

## Usuario de prueba

Las credenciales del usuario verificado se agregarán después de crear la base de datos de producción.

```text
Correo: pendiente
Contraseña: pendiente
```

No se deben publicar secretos, contraseñas SMTP, cadenas de MongoDB ni valores de `JWT_SECRET`.
