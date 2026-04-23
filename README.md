# 💊 Pastillas Track App

Aplicación móvil desarrollada con React Native + Expo para gestionar el consumo de medicamentos diarios, incluyendo recordatorios automáticos mediante notificaciones.

---

## 🚀 Descripción

Pastillas Track App permite a los usuarios:

* Registrar medicamentos con nombre, cantidad y horario
* Marcar medicamentos como tomados
* Editar o eliminar registros
* Recibir notificaciones diarias en la hora indicada
* Visualizar un resumen del estado diario (tomadas / pendientes)
* Crear cuenta e iniciar sesión (SaaS)
* Sincronizar datos entre dispositivos con Supabase
* Gestionar plan Free/Pro con Stripe

---

## 🛠️ Tecnologías utilizadas

* React Native
* Expo (Expo Router)
* TypeScript
* AsyncStorage (persistencia local)
* Expo Notifications (recordatorios)
* Context API (estado global)
* Supabase (Auth + Postgres + RLS)
* Stripe (suscripciones)

---

## 📁 Estructura del proyecto

```
app/
  (tabs)/
    index.tsx        → Pantalla principal (CRUD medicamentos)
    create.tsx        → Crear nuevo medicamento
    profile.tsx       → Perfil de usuario
    account.tsx       → Cuenta y configuración
    stats.tsx         → Estadísticas (placeholder)
    _layout.tsx       → Navegación Tabs

  _layout.tsx         → Provider global + configuración
  sign-in.tsx         → Inicio de sesión
  sign-up.tsx         → Registro
  edit-profile.tsx    → Editar perfil
  delete-account.tsx  → Eliminar cuenta
  legal.tsx           → Información legal
  terms.tsx           → Términos y condiciones
  modal.tsx           → Componente modal
  paywall.tsx         → Muro de pago

components/
  ui/                 → Componentes reutilizables
    collapsible.tsx   → Componente plegable
    icon-symbol.tsx   → Iconos simbólicos
  themed-text.tsx     → Texto con tema
  themed-view.tsx     → Vista con tema
  MedicationEditModal.tsx → Modal edición medicamentos
  external-link.tsx   → Enlaces externos
  haptic-tab.tsx      → Tabs hápticos
  hello-wave.tsx      → Componente ejemplo
  parallax-scroll-view.tsx → Scroll con paralaje

context/
  AuthContext.tsx     → Estado global de autenticación
  MedicationContext.tsx → Estado global de medicamentos

hooks/
  use-styles.ts       → Gestión de estilos
  use-color-scheme.ts → Esquema de colores
  use-theme-color.ts  → Color del tema
  use-terms-agreement.ts → Acuerdo de términos

utils/
  notification.ts     → Funciones de notificación
  notification.js     → Versión JS de notificaciones
  medication-form.ts  → Formulario medicamentos

services/
  medicationService.ts → Lógica de medicamentos
  account.ts          → Servicios de cuenta
  payments.ts         → Servicios de pagos
  loadRemotePastillas.js → Carga remota
  observability.ts    → Observabilidad

styles/
  homeStyles.ts       → Estilos pantalla principal
  globalStyles.ts     → Estilos globales

constants/
  theme.ts            → Constantes de tema

lib/
  supabase.ts         → Configuración Supabase
  env.ts              → Variables de entorno

assets/
  sounds/             → Sonidos de notificación
  images/             → Imágenes de la app
```

---

## ⚙️ Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/Descolle/Pastillas-Track-App.git
```

2. Entrar al proyecto:

```bash
cd Pastillas-Track-App
```

3. Instalar dependencias:

```bash
npm install
```

4. Configurar variables públicas en `app.json` dentro de `expo.extra`:

```json
{
  "EXPO_PUBLIC_SUPABASE_URL": "https://YOUR_PROJECT.supabase.co",
  "EXPO_PUBLIC_SUPABASE_ANON_KEY": "YOUR_SUPABASE_ANON_KEY",
  "EXPO_PUBLIC_BILLING_API_URL": "https://YOUR_BILLING_API_URL",
  "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY": "pk_test_xxx"
}
```

5. Ejecutar SQL de Supabase:

* `supabase/sql/001_saas_schema.sql`
* `supabase/sql/002_billing_helpers.sql`

6. (Opcional en local) Billing API:

```bash
cd backend/billing-api
npm install
npm run dev
```

---

## ▶️ Cómo ejecutar la app

Iniciar el servidor de desarrollo:

```bash
npx expo start
```

Opciones:

* Presionar `a` → abrir en Android
* Presionar `w` → abrir en navegador
* Escanear QR con Expo Go (recomendado)

---

## 🔔 Notificaciones

La app utiliza notificaciones locales:

* Se solicitan permisos automáticamente
* Se programan al crear una pastilla
* Se repiten diariamente
* Se eliminan al borrar la pastilla

⚠️ Importante:

* Probar en dispositivo físico (emuladores pueden fallar)

---

## 📦 Builds Android (APK y AAB)

La app puede generarse en dos formatos distintos:

* `APK` → para instalar manualmente en celulares de prueba
* `AAB` → para subir a Google Play Store

Comandos:

```bash
npm run build:android:apk
npm run build:android:aab
```

Perfiles EAS usados:

* `preview` → genera APK (`distribution: internal`, `buildType: apk`)
* `production` → genera AAB (`buildType: app-bundle`)

Notas importantes:

* El archivo `AAB` no se instala directo en el teléfono.
* Para instalar manualmente en Android necesitas un `APK`.
* Si instalas una APK nueva encima de la anterior (misma firma y package), la app se actualiza sin perder datos.

---

## 💾 Persistencia

* Cache local con AsyncStorage (offline-first)
* Sincronización automática con Supabase al iniciar sesión
* Migración local -> nube en primer login

---

## 🔐 Multi-tenant y seguridad

* Cada fila de `medications` y `medication_events` incluye `user_id`
* Las políticas RLS impiden leer/escribir datos de otros usuarios
* El plan de suscripción vive en `profiles.plan_tier`

---

## 💳 Billing Stripe

* Checkout para upgrade a `pro`
* Portal de cliente para gestionar suscripción
* Webhook para actualizar `plan_tier` y estado en `profiles`

Configurar en backend `billing-api`:

* `STRIPE_SECRET_KEY`
* `STRIPE_PRICE_PRO`
* `STRIPE_WEBHOOK_SECRET`
* `SUPABASE_URL`
* `SUPABASE_SERVICE_ROLE_KEY`
* URLs de retorno (`STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL`, `STRIPE_PORTAL_RETURN_URL`)

---

## ✅ Release checklist (SaaS)

* Variables `expo.extra` configuradas por entorno (dev/prod)
* SQL de Supabase aplicado y RLS validado
* Billing API desplegada con webhook activo
* Prueba de login, CRUD, sync y upgrade/downgrade de plan
* Build Android con entorno correcto

---

## 🧠 Funcionalidades principales

* ➕ Crear medicamento
* ✏️ Editar medicamento
* ❌ Eliminar medicamento
* ✅ Marcar como tomado
* 🔔 Notificación automática diaria
* 📊 Dashboard con resumen

---

## 🎨 UI

* Diseño basado en cards
* Componentes reutilizables
* Colores centralizados en theme
* Estructura modular escalable

---

## � Sonidos de Notificación

La app utiliza sonidos personalizados para recordatorios de medicamentos:

### Archivos Requeridos:
```
assets/sounds/
├── pill_reminder_1.wav  - Recordatorio fuerte
├── pill_reminder_2.wav  - Alternativa fuerte  
└── pill_reminder_3.wav  - Otra opción fuerte
```

### Requisitos de Audio:
* **Formato**: WAV o MP3
* **Duración**: 1-3 segundos
* **Volumen**: Alta calidad, salida fuerte
* **Tamaño**: Menos de 100KB cada uno

### Fuentes de Sonidos Gratuitos:
* [Zapsplat](https://www.zapsplat.com/)
* [Freesound](https://freesound.org/)
* [Mixkit](https://mixkit.co/)

### Implementación:
* Selección aleatoria entre los 3 sonidos
* Configuración de canal Android con máxima importancia
* Vibración y LED incluidos para mayor atención

---

## �� Mejoras futuras

* 🔔 Notificaciones interactivas (botón "Tomar")
* 🌙 Dark mode automático
* 📆 Historial de consumo
* ☁️ Backend con usuarios
* 📱 Publicación en Play Store
* 🔐 Protección con PIN para configuración
* 🌍 Selección de idioma (Español/Inglés)
* 🎛️ Selector personalizado de sonidos de notificación

---

## 🧑‍💻 Autor

Desarrollado por:
**Tomás Corvalán**

---
