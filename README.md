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

---

## 🛠️ Tecnologías utilizadas

* React Native
* Expo (Expo Router)
* TypeScript
* AsyncStorage (persistencia local)
* Expo Notifications (recordatorios)
* Context API (estado global)

---

## 📁 Estructura del proyecto

```
app/
  (tabs)/
    index.tsx        → Pantalla principal (CRUD)
    explore.tsx      → Dashboard / resumen
    layout.tsx       → Navegación Tabs

  layout.tsx         → Provider global + configuración

components/
  ui/                → Componentes reutilizables (Button, Card, Input)

context/
  MedicationContext.tsx → Estado global de pastillas

hooks/
  useNotifications.ts → Configuración global de notificaciones

utils/
  notifications.ts   → Funciones de notificación

styles/
  homeStyles.ts      → Estilos de la pantalla principal

theme/
  colors.ts          → Colores globales
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

## 💾 Persistencia

* Se utiliza AsyncStorage
* Los datos se guardan automáticamente al modificar el estado
* Se cargan al iniciar la app

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

## 🚧 Mejoras futuras

* 🔔 Notificaciones interactivas (botón "Tomar")
* 🌙 Dark mode automático
* 📆 Historial de consumo
* ☁️ Backend con usuarios
* 📱 Publicación en Play Store

---

## 🧑‍💻 Autor

Desarrollado por:
**Tomás Corvalán**

---

## 📌 Notas finales

Este proyecto fue desarrollado como práctica para:

* Manejo de estado global
* Persistencia de datos
* Integración de notificaciones
* Arquitectura escalable en React Native

---

🔥 Proyecto ideal para portafolio junior / semi senior.
