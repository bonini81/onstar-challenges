# OnStar Negocios Challenge — Contexto del Proyecto

## Descripción
Web App para evento corporativo de OnStar (marca automotriz).

- **Dispositivo**: Tablet (modo vertical, 10 pulgadas recomendado — por confirmar)
- **Navegador**: Chrome en tablet
- **Usuarios**: 3 equipos simultáneos
- **Duración de uso**: Día del evento + ~4 días posteriores
- **Deadline**: Lunes al mediodía (desarrollo part-time desde martes)

## Tech Stack
- **Frontend**: React + Vite
- **Estilos**: CSS Modules (NO Tailwind — decisión actualizada)
- **Routing**: React Router
- **Teclado virtual**: react-simple-keyboard (solo pantalla de registro)
- **Backend/DB**: Firebase Firestore (plan Spark gratuito)
- **Hosting**: Firebase Hosting
- Sin backoffice — reset y monitoreo directo desde consola de Firebase

## Estilos — CSS Modules

**Decisión**: CSS Modules en vez de Tailwind o CSS global puro.

**Por qué:**
1. 17 pantallas con layouts parecidos pero no idénticos → CSS Modules evita colisiones de nombres de clase sin necesidad de prefijos largos.
2. Soporte nativo en Vite, cero configuración extra.
3. Desarrollo en solitario → evita perder el hilo de qué clase ya está usada en otra pantalla.
4. Editar el CSS de una pantalla no rompe otras (scope local por archivo).

**Lo que sí es global**: variables de marca (colores, tipografía, spacing) en un archivo de tokens consumido por todos los módulos vía `var(--...)`. Esto permite actualizar assets de marca de OnStar en un solo lugar cuando lleguen.

### Estructura de carpetas sugerida
```
src/
  styles/
    variables.css   (tokens de marca: colores, fuentes, spacing)
    global.css      (reset, box-sizing, body)
  components/
    Welcome/
      Welcome.jsx
      Welcome.module.css
    Registro/
      Registro.jsx
      Registro.module.css
    ...
```

### Ejemplo de variables.css
```css
:root {
  --color-primary: #...;
  --color-bg: #...;
  --font-family: ...;
  --spacing-unit: 8px;
  /* ajustar cuando lleguen assets reales de OnStar */
}
```

Cada `.module.css` consume estas variables con `var(--color-primary)`, etc.

## Dinámica del Evento
- 3 equipos, cada uno con una tablet
- 6 business cases disponibles, asignados aleatoriamente sin repetición
- El equipo tiene 3 minutos para leer su business case y preparar su pitch
- Al terminar el timer → pantalla TIEMPO CUMPLIDO → entregan tablet al facilitador
- El facilitador califica al equipo (8 criterios, escala 1-5, total 40 pts)
- Al terminar los 3 equipos → se desbloquea el Ranking final

## Arquitectura Firestore

### Colecciones

**gameState** (documento único)
```
availableCases: [1, 2, 3, 4, 5, 6]   // pool de casos disponibles
rankingsUnlocked: false
```

**teams/{teamId}**
```
name: "Los Duros"
status: "registered" | "reading" | "locked" | "scoring" | "completed"
assignedCase: 3
readingStartedAt: timestamp
```

**scores/{teamId}**
```
criteria1: 4
criteria2: 5
...
criteria8: 3
total: 32
```

Los 6 business cases van hardcodeados en el frontend (no en Firestore).

### Asignación atómica de business case
Al confirmar nombre del equipo → transacción Firestore:
1. Lee `gameState.availableCases`
2. Elige uno al azar del array
3. Lo elimina del array (para que no se repita)
4. Guarda equipo con `assignedCase`

### Sesión
`localStorage` guarda el `teamId` generado al registrarse. Si recargan la tablet, recupera estado desde Firestore y retoma donde estaba.

### Timer
`readingStartedAt` se guarda en Firestore al presionar "Iniciar Misión Ahora". El frontend calcula tiempo restante desde ese timestamp — no desde estado local. Al llegar a 0 → pantalla TIEMPO CUMPLIDO (pantallas anteriores quedan bloqueadas). Sin timer de 15 minutos — el facilitador controla el flujo presionando "Acceso facilitador".

## Flujo de Pantallas (17 en total)

| # | Pantalla | Notas |
|---|----------|-------|
| 1 | Welcome | Steps: Conoce / Detecta / Vende. Botón "Iniciar" |
| 2 | Criterios de Evaluación | Lista los 8 criterios. Botón "Entendido" |
| 3 | Registro | Input + teclado virtual embebido. Botón "Listo" |
| 4 | Confirmación | "¿El nombre es correcto? Los Duros". Atrás / Confirmar |
| 5 | La Misión | Nombre equipo, foto cliente, pasos del challenge, botón "¡Iniciar Misión Ahora!" → arranca timer |
| 6 | Perfil de Cliente | Timer visible. Datos del cliente. Siguiente |
| 7 | Problema del Cliente | Timer. Atrás / Siguiente |
| 8 | Misión del Equipo | Timer. Atrás / Siguiente |
| 9 | Funciones Recomendadas | Timer. Atrás / Siguiente |
| 10 | Puntos Obligatorios | Timer. Atrás / Siguiente |
| 11 | Cierre Sugerido | Timer. Atrás (última pantalla antes de timeout) |
| 12 | TIEMPO CUMPLIDO | Texto grande. "Acceso facilitador" button |
| 13 | Calificación Parte 1 | Facilitador. 4 criterios × radio 1-5. Siguiente |
| 14 | Calificación Parte 2 | Facilitador. 4 criterios × radio 1-5. Siguiente |
| 15 | Score Final | "Equipo: Los Duros — Puntaje: 32/40". Botón "Ver Ranking" |
| 16 | Ranking — Espera | "Cargando resultados, esperando otros equipos..." |
| 17 | Ranking — Final | 1°/2°/3° con puntos. Accesible también por URL directa `/ranking` |

## Criterios de Evaluación (8 × 5 pts = 40 pts)
1. Comprensión del cliente
2. Personalización de la propuesta
3. Precisión en la explicación de OnStar Negocios
4. Conversión de funciones en beneficios
5. Manejo de la objeción
6. Cierre comercial
7. Participación y coordinación del equipo
8. (Por confirmar con cliente — usar dummy por ahora)

## Business Cases (reales, ya cargados)

Los 6 casos reales fueron entregados por el cliente (`6 CASOS FINALES Y PERFILES ONSTAR NEGOCIOS.docx.pdf`) y viven hardcodeados en `src/data/businessCases.js`. Estructura de cada uno:

```js
{
  id: 1,
  titulo: "Cadena de frío y control de temperatura",
  clientProfile: {
    nombre: "Andrea Salazar",
    empresa: "Frío Express Ecuador",
    actividad: "...",
    flota: "12 camiones Chevrolet",
    operacion: "...",
    situacion: "..."
  },
  problema: {
    principal: "...",
    secundario: "...",
    objecion: "..."
  },
  mision: [...],                  // bullets — pantalla "Misión del Equipo"
  funcionesRecomendadas: [...],   // bullets
  puntosObligatorios: [...],      // bullets
  beneficio: "...",               // texto — no tiene pantalla propia en el wireframe, se muestra dentro de Cierre Sugerido
  cierreSugerido: "..."           // texto completo
}
```

Usar `getBusinessCaseById(id)` para resolver el caso asignado a un equipo desde `team.assignedCase`.

## Plan de Trabajo (Part-time ~4-5h/día)

| Día | Entregable |
|-----|-----------|
| Martes tarde | Setup: Firebase + Vite/React + CSS Modules + React Router + react-simple-keyboard. Estructura de rutas. Seed de `gameState` en Firestore. |
| Miércoles | Pantallas 1-5: Welcome → Criterios → Registro (teclado virtual) → Confirmación → La Misión. Transacción atómica de asignación de business case. Session recovery desde localStorage. |
| Jueves | Pantallas 6-12: 6 sub-pantallas de business case + timer persistido en Firestore + pantalla TIEMPO CUMPLIDO. |
| Viernes | Pantallas 13-15: Calificación facilitador (2 pantallas) + Score final. Lógica de desbloqueo de ranking. |
| Sábado | Pantallas 16-17: Ranking (espera + resultado). UI polish para tablet vertical. Cargar los 6 business cases (dummy). Deploy a Firebase Hosting. |
| Domingo | Pruebas en tablet real. Bug fixes. Buffer. |
| Lunes AM | Entrega con margen. |

## Decisiones Tomadas
- ✅ Sin PIN para acceso facilitador (el facilitador controla físicamente la tablet)
- ✅ Sin timer de 15 minutos (flujo directo a TIEMPO CUMPLIDO)
- ✅ Sin backoffice (reset desde consola Firebase)
- ✅ Teclado virtual con react-simple-keyboard
- ✅ Business cases hardcodeados en frontend
- ✅ Ranking accesible por URL directa `/ranking` (para revisión días posteriores)
- ✅ Criterio 8 va como placeholder editable (`criteria8`) en Calificación Parte 1, no se muestra en la pantalla de Criterios (pública) hasta tener el texto real
- ✅ Sección "Beneficio para la rentabilidad..." de cada caso se muestra dentro de Cierre Sugerido (no tiene pantalla propia en el wireframe)
- ⏳ Botón "Reiniciar" de Ranking Final: implementado sin acción por ahora, comportamiento por definir con el cliente
- ✅ Misma URL para los 3 equipos — el registro los diferencia
- ✅ CSS Modules en vez de Tailwind

## Pendientes del Cliente
- [ ] 8vo criterio de evaluación — pantallas de Calificación (13-14) ya dejan un slot placeholder (`criteria8`) listo para el texto real
- [x] 6 business cases reales — recibidos y cargados en `src/data/businessCases.js`
- [ ] Assets de marca: logo OnStar, colores, tipografía — se recibieron wireframes de alta fidelidad (`WireOnstarNegocios_OK.pdf`); paleta de `variables.css` está aproximada a partir de esas capturas, faltan hex exactos, logo vectorial y tipografía oficial
- [x] Confirmar tamaño de tablet: ¿7 o 10 pulgadas? — Confirmado: 10 pulgadas, Samsung Galaxy Tab, 800x1280px, modo portrait
- [ ] Definir qué debe hacer el botón "Reiniciar" en la pantalla de Ranking Final (nuevo en el wireframe, no estaba en el plan original) — por ahora se implementará sin acción