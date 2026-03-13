# SOP — Estándares de Repositorio para Proyectos Web

## ¿Qué es este documento?

Este documento explica, en lenguaje sencillo, todas las herramientas y prácticas
que se configuraron en el repositorio de Grupo Alista. Sirve como guía para
replicar estos mismos estándares en futuros proyectos web.

Cada sección describe **qué hace** la herramienta, **por qué importa** y **qué
archivo la configura**.

---

## 1. Estructura de Archivos

El proyecto sigue una organización clara y predecible:

```
mi-proyecto/
├── index.html              ← Página principal
├── assets/
│   ├── css/                ← Hojas de estilo separadas por responsabilidad
│   │   ├── tokens.css      ← Colores, tipografía, espaciado (variables)
│   │   ├── base.css        ← Estilos base y reset
│   │   ├── layout.css      ← Estructura y navegación
│   │   ├── components.css  ← Tarjetas, botones, formularios
│   │   ├── utilities.css   ← Animaciones y clases auxiliares
│   │   └── responsive.css  ← Adaptación a móvil, tablet, escritorio
│   ├── js/
│   │   └── main.js         ← Toda la interactividad
│   ├── images/             ← Imágenes organizadas por sección
│   └── fonts/              ← Tipografías personalizadas
├── tests/                  ← Pruebas automatizadas
├── .github/                ← Configuración de GitHub (CI, plantillas)
└── [archivos de config]    ← Herramientas de calidad (ver abajo)
```

**¿Por qué importa?** Cuando cualquier persona abre el proyecto, sabe
exactamente dónde encontrar cada cosa. No hay que adivinar.

---

## 2. Consistencia del Editor — EditorConfig

**Archivo:** `.editorconfig`

Asegura que todos los editores de código (VS Code, Sublime, etc.) usen las
mismas reglas básicas:

- Indentación con 2 espacios (no tabuladores)
- Archivos terminan con una línea en blanco
- Codificación UTF-8
- Fin de línea tipo Unix (LF)

**¿Por qué importa?** Evita diferencias innecesarias entre colaboradores que
usan distintos editores. Sin esto, un archivo puede verse diferente en cada
computadora.

---

## 3. Formateo Automático — Prettier

**Archivo:** `.prettierrc` y `.prettierignore`

Prettier es un formateador automático. Toma el código y lo reorganiza para que
siempre se vea igual, sin importar quién lo escribió.

Reglas principales:

- Comillas simples (`'texto'` en vez de `"texto"`)
- Punto y coma al final de cada línea
- Líneas de máximo 100 caracteres (120 para HTML)
- Sin comas al final de listas

**¿Por qué importa?** Elimina discusiones sobre estilo. El código siempre se ve
igual, lo que facilita revisar cambios reales.

**Comandos:**

- `npm run format` — Formatea todos los archivos automáticamente
- `npm run format:check` — Verifica sin modificar (útil en CI)

---

## 4. Validación de HTML — HTMLHint

**Archivo:** `.htmlhintrc`

Revisa que el HTML esté bien escrito:

- Etiquetas en minúsculas y correctamente cerradas
- Atributos con comillas dobles
- IDs únicos en la página
- Imágenes con texto alternativo (`alt`)
- Documento con `<!DOCTYPE html>`

**¿Por qué importa?** HTML mal escrito puede causar que la página se vea
diferente en distintos navegadores o que los lectores de pantalla no funcionen
correctamente.

**Comando:** `npm run lint:html`

---

## 5. Validación de CSS — Stylelint

**Archivo:** `.stylelintrc.json`

Revisa que las hojas de estilo sigan buenas prácticas:

- Colores hexadecimales completos (`#ffffff`, no `#fff`)
- Sin propiedades duplicadas o desconocidas
- Sin uso de prefijos de navegador innecesarios
- Máximo 4 niveles de anidamiento
- No usar `border: none` (usar `border: 0` en su lugar)

**¿Por qué importa?** CSS desordenado es difícil de mantener y puede causar
errores visuales difíciles de detectar.

**Comando:** `npm run lint:css`

---

## 6. Validación de JavaScript — ESLint

**Archivo:** `.eslintrc.json`

Revisa que el JavaScript siga buenas prácticas:

- Sin variables sin usar
- Sin `console.log` en producción
- Sin `eval()` ni funciones peligrosas
- Comparaciones estrictas (`===` en vez de `==`)
- Punto y coma obligatorio

**¿Por qué importa?** JavaScript con errores puede romper la interactividad de
la página. ESLint detecta problemas antes de que lleguen al usuario.

**Comando:** `npm run lint:js`

---

## 7. Validación de Texto — Vale

**Archivo:** `.vale.ini`

Revisa la calidad del texto escrito en HTML y Markdown. Detecta errores de
redacción, jerga innecesaria y problemas de claridad.

Configuración actual: desactivada la revisión ortográfica (el contenido es en
español).

**¿Por qué importa?** El texto es parte del producto. Errores de redacción
afectan la imagen profesional.

**Comando:** `npm run lint:prose`

---

## 8. Accesibilidad — Pa11y CI

**Archivo:** `.pa11yci.json`

Verifica que la página cumpla con el estándar WCAG 2.0 nivel AA. Esto significa
que personas con discapacidades visuales, motoras o cognitivas puedan usar el
sitio.

Revisa cosas como:

- Contraste de colores suficiente
- Etiquetas en formularios
- Navegación por teclado
- Textos alternativos en imágenes

**¿Por qué importa?** Además de ser lo correcto, en muchos países es un
requisito legal. Un sitio accesible llega a más personas.

---

## 9. Seguridad — Detección de Secretos

**Archivos:** `.gitleaks.toml` y `.secrets.baseline`

Dos herramientas trabajan juntas para evitar que contraseñas, llaves de API u
otra información sensible se suba al repositorio por accidente:

- **Gitleaks** — Escanea el historial de Git buscando secretos
- **detect-secrets** — Mantiene una línea base de falsos positivos conocidos

**¿Por qué importa?** Una contraseña publicada en GitHub puede ser explotada en
minutos. Estas herramientas son la última línea de defensa.

---

## 10. Verificaciones Antes de Cada Commit — Pre-commit Hooks

**Archivo:** `.pre-commit-config.yaml`

Cada vez que un desarrollador intenta guardar cambios en Git, se ejecutan
automáticamente estas verificaciones:

1. **Higiene de archivos** — Elimina espacios en blanco sobrantes, asegura
   líneas finales, verifica que no haya conflictos de merge
2. **Seguridad** — Busca llaves privadas, credenciales de AWS, secretos
3. **HTML** — Valida con HTMLHint
4. **CSS** — Valida y corrige con Stylelint
5. **JavaScript** — Valida y corrige con ESLint
6. **Formato** — Aplica Prettier automáticamente
7. **Texto** — Revisa prosa con Vale
8. **Mensajes de commit** — Valida que sigan un formato estándar (Commitizen)

**¿Por qué importa?** Previene que código con problemas llegue al repositorio.
Es como un control de calidad automático antes de cada entrega.

---

## 11. Verificaciones en Cada Pull Request — CI con GitHub Actions

**Archivo:** `.github/workflows/ci.yml`

Cuando alguien propone cambios (Pull Request), GitHub ejecuta automáticamente:

| Verificación        | Qué hace                                      |
| ------------------- | --------------------------------------------- |
| Seguridad           | Escanea secretos con Gitleaks y vulnerabilidades con Trivy |
| Linting             | Ejecuta HTMLHint, Stylelint, ESLint y Prettier |
| Prosa               | Valida texto con Vale                         |
| Accesibilidad       | Verifica WCAG 2.0 AA con Pa11y                |
| HTML                | Valida contra el estándar W3C                 |
| Enlaces             | Busca enlaces rotos con Lychee                |

**¿Por qué importa?** Aunque alguien se salte las verificaciones locales, el CI
las atrapa antes de que los cambios se mezclen con el código principal.

---

## 12. Despliegue Automático

**Archivo:** `.github/workflows/deploy.yml`

Cuando los cambios llegan a la rama `main`, se despliegan automáticamente:

1. Se ejecutan todas las validaciones (linting, formato, seguridad)
2. Si pasan, los archivos se sincronizan al servidor
3. Se limpia la caché para que los usuarios vean la versión más reciente

El despliegue excluye automáticamente archivos de desarrollo (configs, node_modules, etc.) y solo sube lo necesario para el sitio.

**¿Por qué importa?** Elimina el proceso manual de subir archivos. Cada cambio
aprobado se publica automáticamente sin intervención humana.

---

## 13. Revisión de Código — CODEOWNERS y Plantilla de PR

**Archivos:** `.github/CODEOWNERS` y `.github/PULL_REQUEST_TEMPLATE.md`

- **CODEOWNERS** define quién debe aprobar los cambios (actualmente
  `@algarmat-design` para todo el repositorio)
- **Plantilla de PR** guía al desarrollador para describir sus cambios y
  verificar que probó en escritorio, móvil, enlaces e imágenes

**¿Por qué importa?** Asegura que ningún cambio llegue a producción sin
revisión humana y que la revisión sea consistente.

---

## 14. Pruebas Automatizadas — Vitest

**Archivo:** `vitest.config.js` y carpeta `tests/`

Se escriben pruebas que verifican propiedades del código automáticamente:

- Que los nombres de clases CSS sigan el patrón BEM (kebab-case)
- Que los media queries usen los breakpoints correctos (1024px, 768px, 480px)
- Que los estados interactivos (hover, focus) estén presentes
- Que no se use sintaxis de preprocesadores (Sass, Less)
- Que el JavaScript no use módulos ES (import/export)

**¿Por qué importa?** Las pruebas detectan regresiones automáticamente. Si
alguien rompe una convención, la prueba falla antes de que el código se publique.

**Comando:** `npm run test`

---

## 15. Organización del CSS — Metodología por Capas

El CSS se divide en 6 archivos, cargados en un orden específico:

| Orden | Archivo          | Contenido                                |
| ----- | ---------------- | ---------------------------------------- |
| 1     | `tokens.css`     | Variables de diseño (colores, espaciado)  |
| 2     | `base.css`       | Reset y tipografía base                  |
| 3     | `layout.css`     | Estructura, navegación, grids            |
| 4     | `components.css` | Tarjetas, botones, formularios, secciones |
| 5     | `utilities.css`  | Animaciones y clases auxiliares          |
| 6     | `responsive.css` | Adaptación a diferentes pantallas        |

**¿Por qué importa?** El orden determina qué estilos tienen prioridad. Si se
cambia el orden, el sitio puede verse diferente. Esta estructura permite agregar
nuevos componentes sin afectar los existentes.

---

## Checklist para Nuevos Repositorios

Al crear un nuevo proyecto, copiar y adaptar estos archivos:

- [ ] `.editorconfig` — Consistencia del editor
- [ ] `.prettierrc` y `.prettierignore` — Formateo automático
- [ ] `.htmlhintrc` — Validación de HTML
- [ ] `.stylelintrc.json` — Validación de CSS
- [ ] `.eslintrc.json` — Validación de JavaScript
- [ ] `.vale.ini` — Validación de texto
- [ ] `.pa11yci.json` — Accesibilidad
- [ ] `.gitleaks.toml` — Detección de secretos
- [ ] `.secrets.baseline` — Línea base de secretos
- [ ] `.pre-commit-config.yaml` — Hooks de pre-commit
- [ ] `.gitignore` — Archivos excluidos de Git
- [ ] `.github/workflows/ci.yml` — Pipeline de CI
- [ ] `.github/workflows/deploy.yml` — Pipeline de despliegue
- [ ] `.github/CODEOWNERS` — Revisores de código
- [ ] `.github/PULL_REQUEST_TEMPLATE.md` — Plantilla de PR
- [ ] `vitest.config.js` — Configuración de pruebas
- [ ] `package.json` — Scripts y dependencias

---

## Comandos Principales

| Comando                | Qué hace                                    |
| ---------------------- | ------------------------------------------- |
| `npm run lint`         | Ejecuta todas las validaciones              |
| `npm run lint:html`    | Valida solo HTML                            |
| `npm run lint:css`     | Valida solo CSS                             |
| `npm run lint:js`      | Valida solo JavaScript                      |
| `npm run lint:prose`   | Valida solo texto                           |
| `npm run format`       | Formatea todos los archivos                 |
| `npm run format:check` | Verifica formato sin modificar              |
| `npm run validate`     | Ejecuta lint + formato + prosa              |
| `npm run test`         | Ejecuta pruebas automatizadas               |

---

## Requisitos del Entorno

- **Node.js** versión 18 o superior
- **npm** (viene incluido con Node.js)
- **Python** (opcional, para pre-commit hooks nativos)
- **Git** con soporte para hooks

Para instalar las dependencias del proyecto: `npm install`

Para instalar los hooks de pre-commit: `npm run prepare`
