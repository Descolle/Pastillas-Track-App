<div align="center">

# 💊 RecuerdaMed

**App móvil SaaS para gestionar medicamentos diarios: recordatorios inteligentes, sincronización en la nube y suscripciones Pro.**

![React Native](https://img.shields.io/badge/React_Native-0.81-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo_SDK-54-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

</div>

---

## 🎯 El problema

Olvidar una dosis es más común de lo que parece, y las apps existentes suelen ser complejas o no funcionan bien sin conexión. **RecuerdaMed** resuelve esto con una experiencia simple: registrar un medicamento, recibir un aviso a la hora exacta y ver de un vistazo qué falta por tomar hoy.

## ✨ Función

| | |
|---|---|
| 🔔 **Recordatorios diarios** | Notificaciones locales programadas automáticamente, con sonidos personalizados y canal Android de máxima prioridad |
| ✅ **Seguimiento del día** | Marca medicamentos como tomados y consulta el resumen de tomadas vs. pendientes |
| 🗂️ **CRUD completo** | Crear, editar y eliminar medicamentos con nombre, cantidad y horario |
| ☁️ **Sincronización multi-dispositivo** | Tus datos te siguen entre dispositivos gracias a Supabase |
| 📴 **Offline-first** | Funciona sin conexión con caché local y sincroniza al reconectar |
| 💳 **Plan Free / Pro** | Suscripciones con Stripe: checkout, portal de cliente y webhooks |
| 🔐 **Cuentas seguras** | Registro, inicio de sesión, términos y condiciones, y eliminación de cuenta |

## 📦 Más que un prototipo: pensado para producción

El proyecto no se queda en el código; cubre lo necesario para llevar una app a una tienda:

- **Cumplimiento de Google Play:** [política de privacidad](https://descolle.github.io/Pastillas-Track-App/privacy-policy.html) y [página de eliminación de cuenta](https://descolle.github.io/Pastillas-Track-App/account-deletion.html) publicadas en GitHub Pages.
- **Documentación de lanzamiento:** ficha de tienda, guía de clasificación de contenido y piezas gráficas en [`docs/`](./docs) y [`QUICK_START_GUIDE.md`](./QUICK_START_GUIDE.md).
- **Builds reproducibles:** perfiles EAS para APK (pruebas internas) y AAB (Google Play).
- **Multiplataforma:** configurada para Android, iOS y Web con una sola base de código.
- **Desarrollo sostenido:** más de 60 commits de evolución del producto.

## 🏗️ Arquitectura

```
┌──────────────────────┐        ┌───────────────────────┐
│  App móvil           │        │  Billing API (Node)   │
│  React Native + Expo │───────▶│  Stripe Checkout      │
│  TypeScript          │        │  Portal + Webhooks    │
└─────────┬────────────┘        └──────────┬────────────┘
          │                                │
          │ Auth + Sync                    │ actualiza plan
          ▼                                ▼
┌──────────────────────────────────────────────────────┐
│  Supabase: Auth · PostgreSQL · Row Level Security    │
└──────────────────────────────────────────────────────┘
```

## 🧩 Decisiones técnicas destacadas

- **Offline-first:** AsyncStorage como caché local y sincronización automática con Supabase al iniciar sesión, incluyendo migración de datos locales a la nube en el primer login.
- **Seguridad multi-tenant:** cada fila de `medications` y `medication_events` lleva `user_id`, y las políticas **RLS** de PostgreSQL impiden que un usuario lea o escriba datos de otro.
- **Monetización real:** el plan vive en `profiles.plan_tier` y se actualiza vía **webhooks de Stripe**; el backend es la fuente de verdad, no el cliente.
- **Estado global ordenado:** Context API separado para autenticación y medicamentos.
- **Código modular:** capas diferenciadas de UI, contexto, hooks, servicios y utilidades, con TypeScript y ESLint configurados.
- **Pila moderna:** Expo SDK 54, React 19, React Native 0.81 y Expo Router para navegación basada en archivos.

## 🛠️ Stack

| Capa | Tecnologías |
|---|---|
| **Mobile** | React Native 0.81, Expo SDK 54, Expo Router, Expo Notifications, Reanimated |
| **Lenguaje** | TypeScript 5.9, React 19 |
| **Estado y persistencia** | Context API, AsyncStorage |
| **Backend / BaaS** | Supabase (Auth, PostgreSQL, RLS) |
| **Pagos** | Stripe (Checkout, Customer Portal, Webhooks) |
| **API de billing** | Node.js |
| **Distribución** | EAS Build (APK / AAB), GitHub Pages para páginas legales |
| **Calidad** | ESLint (config Expo), TypeScript |

## 📁 Estructura del proyecto

```
app/            → Pantallas y rutas (Expo Router): tabs, auth, paywall, perfil
components/     → Componentes reutilizables y UI temática
context/        → AuthContext y MedicationContext
hooks/          → Tema, estilos y acuerdo de términos
services/       → Medicamentos, cuenta, pagos y observabilidad
utils/          → Notificaciones y formularios
lib/            → Cliente Supabase y variables de entorno
types/          → Tipos TypeScript compartidos
supabase/       → Esquema SaaS (RLS) y funciones de billing
backend/        → Billing API (Stripe)
docs/           → Documentación de publicación en Google Play
android/        → Proyecto nativo Android
```

## 🚀 Cómo probarlo

```bash
# 1. Clonar e instalar
git clone https://github.com/Descolle/Pastillas-Track-App.git
cd Pastillas-Track-App
npm install

# 2. Configurar variables en app.json → expo.extra
#    EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY,
#    EXPO_PUBLIC_BILLING_API_URL, EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY

# 3. Ejecutar en Supabase: supabase/sql/001_saas_schema.sql y 002_billing_helpers.sql

# 4. Iniciar la app
npx expo start
```

> 📱 Recomendado: escanear el QR con **Expo Go** en un dispositivo físico (las notificaciones pueden fallar en emuladores).

<details>
<summary><b>Billing API (opcional en local)</b></summary>

```bash
cd backend/billing-api
npm install
npm run dev
```

Variables requeridas: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PRO`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y las URLs de retorno (`STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL`, `STRIPE_PORTAL_RETURN_URL`).
</details>

<details>
<summary><b>Builds Android (APK / AAB)</b></summary>

```bash
npm run build:android:apk   # APK para instalar en celulares de prueba
npm run build:android:aab   # AAB para Google Play Store
```

Perfiles EAS: `preview` (APK, distribución interna) y `production` (AAB). Guía completa de publicación en [`QUICK_START_GUIDE.md`](./QUICK_START_GUIDE.md).
</details>

## 🗺️ Roadmap

- [x] Autenticación, sincronización y modelo multi-tenant con RLS
- [x] Planes Free / Pro con Stripe
- [x] Builds Android (APK / AAB) y documentación de publicación
- [ ] Publicación en Google Play Store
- [ ] Notificaciones interactivas (botón "Tomar")
- [ ] Historial de consumo y estadísticas
- [ ] Dark mode automático
- [ ] Selección de idioma (Español / Inglés)
- [ ] Protección con PIN

---

## 👨‍💻 Sobre el autor

**Tomás Corvalán** · Full Stack Developer en Valparaíso, Chile

Desarrollo aplicaciones de punta a punta, desde la app móvil hasta la base de datos, la seguridad y los pagos. Este proyecto muestra cómo llevo una idea a un producto SaaS real, incluyendo la preparación para su lanzamiento.

**Stack principal:** React · React Native · Node.js · TypeScript · PostgreSQL · Supabase · Stripe · Expo

🗣️ Inglés C1

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/tomas-c-0893b120b)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Descolle)
[![Portafolio](https://img.shields.io/badge/Portafolio-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://portafolio-ten-alpha-63.vercel.app)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:tomascorvalan14@gmail.com)

> 💼 **Abierto a oportunidades como desarrollador Full Stack / Mobile.**