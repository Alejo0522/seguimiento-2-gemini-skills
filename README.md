# Desarrollo e Integración de Skills de Gemini aplicados a la Ingeniería Informática
> **Proyecto Académico Universitario • Seguimiento 2 • Ingeniería de Software y Sistemas**

Este proyecto presenta el diseño, desarrollo y documentación de una **Landing Page interactiva** y su plataforma conceptual para la integración de **Skills de Google Gemini AI** en flujos de trabajo avanzados de la **Ingeniería Informática** (arquitectura de microservicios, seguridad perimetral de redes, optimización de bases de datos y testing automatizado).

El proyecto fue construido bajo un requerimiento estricto: **simular una Arquitectura por Capas en el Frontend (Client-Side)** mediante JavaScript modular (ES6 Modules), separando rígidamente la presentación, la lógica de negocio y el acceso a datos.

---

## 📋 1. Descripción de la Actividad y los 7 Entregables

La actividad académica consiste en conceptualizar, estructurar, implementar y documentar la aplicación de agentes inteligentes basados en LLM (Large Language Models) en problemas del ejercicio profesional de la informática. 

A continuación se detalla el cumplimiento de los **7 entregables requeridos**:

| Entregable | Nombre | Descripción Técnica | Ubicación / Estado |
| :--- | :--- | :--- | :--- |
| **Entregable 1** | **Definición del Problema y Justificación** | Análisis de la sobrecarga operativa en tareas de ingeniería de software (scaffolding repetitivo, depuración de reglas firewall y tuning SQL) y justificación de las Skills de Gemini como aceleradores de productividad. | Documentado en el Hero y Sección de Arquitectura |
| **Entregable 2** | **Infografía Conceptual del Flujo** | Diagrama visual de 4 fases (Requerimiento ➔ Prompt & Reasoning ➔ Generación Técnica ➔ Validación QA) generado con asistencia de ChatGPT / DALL-E. | [infografia-conceptual.svg](presentation/assets/infografia-conceptual.svg) • `id="infografia"` |
| **Entregable 3** | **Video Explicativo Producido con Flow** | Contenedor audiovisual que expone la solución técnica, justificación arquitectónica y la integración de la API, producido mediante Flow. | [video-thumbnail.svg](presentation/assets/video-thumbnail.svg) • Sección Video |
| **Entregable 4** | **Cuaderno de Datos (Data Notebook)** | Entorno de experimentación (Jupyter / Colab) para diseño de prompts de ingeniería, evaluación de tokens, latencias y fine-tuning conceptual. | Enlace referenciado en el Footer del proyecto |
| **Entregable 5** | **Arquitectura por Capas en el Cliente** | Diseño estructural en 3 niveles desacoplados (`presentation`, `business_logic`, `data_access`) aplicando el principio de responsabilidad única. | Código fuente en carpetas independientes |
| **Entregable 6** | **Landing Page Interactiva y Consola** | Aplicación web funcional con simulador interactivo de Skills, pipeline visual de trazabilidad y panel de métricas de ingeniería. | `/presentation/index.html` |
| **Entregable 7** | **Repositorio GitHub y Documentación** | Versionamiento del proyecto y redacción del manual técnico exhaustivo para despliegue y evaluación docente. | Archivo `README.md` actual |

---

## 🏛️ 2. Arquitectura por Capas (Client-Side Layered Architecture)

Tradicionalmente, la arquitectura por capas se implementa en el backend. En este proyecto se adaptó dicho patrón al **lado del cliente (Frontend)** para garantizar bajo acoplamiento, alta cohesión y testeabilidad sin depender de dependencias externas.

### 📐 Diagrama de Flujo entre Capas

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CAPA DE PRESENTACIÓN (UI)                                │
│    Ruta: /presentation                                      │
│    Archivos: index.html, styles.css                         │
│    • Renderizado del DOM y variables CSS                    │
│    • Captura de eventos del usuario (clics, inputs)         │
│    • Actualización de estados visuales y terminal           │
└──────────────────────────────┬──────────────────────────────┘
                               │ Dispara evento
                               ▼ (Invoca servicio)
┌─────────────────────────────────────────────────────────────┐
│ 2. CAPA DE LÓGICA DE NEGOCIO (BLL)                          │
│    Ruta: /business_logic                                    │
│    Archivo: skillService.js                                 │
│    • Validaciones de reglas de negocio                      │
│    • Orquestación y cálculo de métricas (costo, ahorro)     │
│    • Auditoría de trazabilidad y normalización DTO          │
│    • Desacoplada 100% del DOM (sin acceso a `document`)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ Solicita datos
                               ▼ (Promesa asíncrona)
┌─────────────────────────────────────────────────────────────┐
│ 3. CAPA DE ACCESO A DATOS (DAL)                             │
│    Ruta: /data_access                                       │
│    Archivo: apiMock.js                                      │
│    • Abstracción del cliente HTTP / SDK de Google Gemini    │
│    • Simulación de latencia de red (600ms - 1100ms)         │
│    • Control de códigos de respuesta (200 OK, 400, 404)     │
│    • Base de conocimiento de presets de ingeniería          │
└─────────────────────────────────────────────────────────────┘
```

### 🧩 Detalle de Responsabilidades por Capa

#### 1. Capa de Presentación (`/presentation`)
- **`index.html`**: Define la semántica del documento, accesibilidad, jerarquía de encabezados (`h1`, `h2`, `h3`), contenedores multimedia y los elementos interactivos con identificadores únicos (`#btn-ejecutar-skill`, `#infografia`, `#custom-prompt`).
- **`styles.css`**: Sistema de diseño basado en CSS Custom Properties, modo oscuro tecnológico con acentos Gemini (índigo, cian, púrpura), efectos de cristal esmerilado (*glassmorphism*), micro-animaciones fluidas y diseño adaptable (*responsive layout*).
- **Controlador UI (Script en `index.html`)**: Escucha los eventos del usuario, actualiza el pipeline gráfico de capas y delega la ejecución **exclusivamente** a `skillService.js`. **Nunca** accede directamente a la capa de datos.

#### 2. Capa de Lógica de Negocio (`/business_logic/skillService.js`)
- Implementa la clase `GeminiSkillService` bajo el patrón Singleton.
- **Validaciones:** Comprueba que las entradas cumplan con los requerimientos técnicos (longitud máxima de caracteres, parámetros de entrada válidos).
- **Métricas de Ingeniería:** Calcula el costo estimado en dólares (`USD`) basado en la tarifa oficial de tokens de Gemini y proyecta el tiempo ahorrado en horas de desarrollo.
- **Trazabilidad:** Genera identificadores únicos de traza (`traceId`) y valida los estados de la petición en cada capa.
- **Independencia del DOM:** No contiene ninguna referencia a `document` o `window`, lo que permite someterla a pruebas unitarias automatizadas en cualquier entorno (ej. Jest, Vitest o Node.js).

#### 3. Capa de Acceso a Datos (`/data_access/apiMock.js`)
- Implementa el objeto `GeminiApiMock` simulando el cliente REST de la API generativa de Google.
- Retorna **Promesas nativas de JavaScript** con simulación de retardo de red mediante `setTimeout`.
- Emula códigos de estado HTTP estándar (`200 OK`, `400 Bad Request`, `404 Not Found`).
- Provee un catálogo de conocimiento técnico preconfigurado:
  - `microservices`: Arquitectura de microservicios con Go, Docker y JWT.
  - `network`: Script de hardening de seguridad y configuración de firewall en Linux (UFW/iptables).
  - `sql`: Optimización de planes de consulta PostgreSQL con índices B-Tree compuestos.
  - `testing`: Suite de pruebas unitarias y de integración con Vitest/Jest.

---

## 📁 3. Estructura de Archivos del Proyecto

```text
seguimiento-2-feibert/
│
├── presentation/                  # CAPA 1: PRESENTACIÓN (UI)
│   ├── index.html                 # Estructura HTML y controlador de interfaz
│   ├── styles.css                 # Hoja de estilos con diseño moderno y tokens
│   └── assets/                    # Recursos visuales
│       ├── infografia-conceptual.svg   # Infografía conceptual generada con ChatGPT
│       └── video-thumbnail.svg         # Carátula del video producido con Flow
│
├── business_logic/                # CAPA 2: LÓGICA DE NEGOCIO
│   └── skillService.js            # Servicio orquestador, validaciones y métricas
│
├── data_access/                   # CAPA 3: ACCESO A DATOS (DAL)
│   └── apiMock.js                 # Simulación de cliente API Gemini y repositorio
│
├── package.json                   # Configuración opcional para scripts de ejecución
└── README.md                      # Documentación técnica completa del proyecto
```

---

## 🚀 4. Instrucciones de Instalación y Ejecución Local

Dado que el proyecto utiliza **Módulos nativos de JavaScript (ES6 Modules: `import` / `export`)**, los navegadores bloquean la carga modular bajo el protocolo `file://` debido a políticas de seguridad CORS. Por lo tanto, el proyecto debe ejecutarse a través de un servidor HTTP local.

Elige **cualquiera** de las siguientes opciones:

### Opción A: Usando Visual Studio Code (Live Server) — *Recomendado*
1. Abre la carpeta del proyecto en **VS Code**.
2. Instala la extensión **Live Server** (creada por *Ritwick Dey*).
3. Haz clic derecho sobre el archivo `presentation/index.html` y selecciona **"Open with Live Server"**.
4. La aplicación se abrirá automáticamente en `http://127.0.0.1:5500/presentation/index.html`.

### Opción B: Usando Node.js / NPX
Si tienes Node.js instalado en tu equipo, ejecuta en la terminal dentro de la carpeta del proyecto:
```bash
# Iniciar servidor estático sin instalar paquetes globales
npx serve .
```
Luego abre en tu navegador la URL indicada (generalmente `http://localhost:3000/presentation/index.html`).

### Opción C: Usando Python 3
Si tienes Python instalado, ejecuta en la consola:
```bash
# En Windows / Mac / Linux
python -m http.server 8000
```
Y accede desde tu navegador a `http://localhost:8000/presentation/index.html`.

---

## 🛠️ 5. Tecnologías y Herramientas Utilizadas

- **HTML5 Semántico:** Estructura limpia y accesible utilizando etiquetas modernas (`<header>`, `<section>`, `<article>`, `<footer>`).
- **CSS3 Vanilla Avanzado:** 
  - CSS Custom Properties (Variables de diseño).
  - Efectos de *Glassmorphism* con `backdrop-filter`.
  - Grid y Flexbox para layouts completamente responsivos.
  - Micro-animaciones CSS para retroalimentación de usuario.
- **Vanilla JavaScript (ES6+):**
  - Módulos nativos (`import` / `export`).
  - Programación asíncrona (`async / await` y `Promises`).
  - Patrón de diseño Singleton y Separación de Capas.
- **Google Gemini API (Conceptual):**
  - Modelado de modelos semánticos (`gemini-1.5-pro` y `gemini-1.5-flash`).
  - Ingeniería de prompts especializada en tareas de ingeniería informática.
- **Herramientas de Generación y Multimedia:**
  - **ChatGPT & DALL-E:** Asistencia en la formulación de prompts y conceptualización de la infografía.
  - **Flow:** Herramienta de producción para el guion y contenido audiovisual explicativo.

---

## 👨‍💻 Información Académica

- **Asignatura:** Ingeniería de Software / Sistemas de Información
- **Actividad:** Seguimiento 2
- **Enfoque:** Arquitectura por Capas y Asistencia de Inteligencia Artificial Generativa
- **Año Lectivo:** 2026
