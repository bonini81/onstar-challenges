# Runbook de emergencia — Reset de base de datos (día del evento)

Guía rápida para usar desde cualquier laptop si algo falla durante el evento.
Proyecto Firebase: **onstar-challenge** → https://console.firebase.google.com/project/onstar-challenge/firestore

## 0. Antes de que arranque el día (hacer esto AHORA, preventivo)

1. Abrí Firestore en la consola → colección `gameState` → documento `current`.
2. Anotá (o hacé screenshot) el valor de `availableCases` y `eventDay` en ese momento. Es tu "estado bueno conocido" al que volver si algo se corrompe a mitad del día.
3. Confirmá que tenés acceso a la consola de Firebase con la cuenta correcta (login Google) desde la laptop nueva.
4. Si necesitás el código fuente en la laptop nueva:
   ```
   git clone https://github.com/bonini81/onstar-challenges.git
   cd onstar-challenges
   npm install
   ```
   (Solo hace falta si vas a tocar código o correr el proyecto local — para resetear datos alcanza con la consola de Firebase, no hace falta correr nada.)

## 1. Primero: ¿el reset normal alcanza?

El botón **"Reiniciar"** en la pantalla Ranking Final (`/ranking`) es el camino normal y preferido:
- Requiere que los 3 equipos del día tengan `status: 'completed'`.
- Pide confirmación antes de borrar.
- Si el evento está en su día 2 (que es el caso hoy, último día), este botón hace un **reset completo del evento**: borra `teams` y `scores`, y deja `gameState` en `{ availableCases: [1,2,3,4,5,6], rankingsUnlocked: false, eventDay: 1 }`.

**Usá este botón si la app funciona normalmente y solo necesitás cerrar/reiniciar el evento.** Los pasos manuales de abajo son solo para cuando la app está rota, colgada, o inaccesible.

## 2. Diagnóstico rápido — ¿qué tipo de falla es?

| Síntoma | Ir a |
|---|---|
| Pantalla en blanco / app no carga / error de deploy | Sección 3 |
| Un solo equipo quedó trabado (ranking gira infinito esperando ese equipo) | Sección 4 |
| Varios equipos corruptos pero querés seguir el mismo día sin perder los casos ya usados | Sección 5 |
| Todo roto / preferís arrancar de cero el evento completo | Sección 6 |

## 3. App no carga / pantalla en blanco

No es un problema de datos, así que **no borres nada en Firestore todavía**.

1. Probá recargar la tablet (F5 / recargar navegador). El estado se recupera solo desde Firestore vía `localStorage` (`teamId` guardado).
2. Si sigue en blanco, revisá el hosting: https://console.firebase.google.com/project/onstar-challenge/hosting
3. Si hace falta redeployar desde la laptop nueva:
   ```
   npm install -g firebase-tools   # si no está instalado
   firebase login
   npm run build
   firebase deploy --only hosting
   ```
4. Si después de esto la app carga bien, seguí con el diagnóstico de datos (secciones 4-6) solo si sigue habiendo un problema de estado.

## 4. Un equipo puntual quedó trabado (caso conocido, ver nota abajo)

Pasa cuando un equipo queda a mitad de calificación (facilitador lo dejó incompleto) y el Ranking espera indefinidamente a que ese equipo llegue a `completed`.

**Fix mínimo, sin tocar a los otros 2 equipos:**

1. Firestore → colección `teams` → identificá el documento del equipo trabado (por `name` o por `status` distinto a `completed`).
2. Anotá su campo `assignedCase` (ej: `3`) antes de borrar.
3. Borrá ese documento en `teams` y el documento correspondiente en `scores` (mismo ID de equipo).
4. Andá a `gameState` → documento `current` → editá el array `availableCases` y **agregá de nuevo el número de caso** que anotaste en el paso 2 (para que pueda volver a asignarse).
5. El equipo se registra de nuevo desde su tablet como si fuera la primera vez.

## 5. Reset del día completo, conservando qué casos ya se usaron

Usalo si varios equipos están corruptos pero el día no terminó y no querés perder el bloqueo de los casos ya jugados.

1. Firestore → borrá **todos** los documentos de la colección `teams`.
2. Borrá **todos** los documentos de la colección `scores`.
3. Andá a `gameState` → documento `current` → poné `rankingsUnlocked: false`.
4. **No toques `eventDay` ni `availableCases`** — dejalos como estaban (o restauralos al valor que anotaste en el paso 0 si se llegaron a tocar por error).
5. Los 3 equipos se registran de nuevo desde cero; el sistema reparte solo los casos que sigan en `availableCases`.

## 6. Reset completo del evento (arrancar de cero)

Equivalente a lo que hace el botón "Reiniciar" cuando `eventDay` ya es 2. Usalo solo si de verdad querés perder todo el progreso del evento (ambos días).

1. Firestore → borrá todos los documentos de `teams`.
2. Borrá todos los documentos de `scores`.
3. `gameState` → documento `current` → editá para que quede exactamente:
   ```
   availableCases: [1, 2, 3, 4, 5, 6]
   rankingsUnlocked: false
   eventDay: 1
   ```

## 7. Después de cualquier reset manual

- Verificá `gameState/current` en la consola: campos correctos, tipos correctos (array de números, boolean, número).
- Pedile a un equipo que se registre de prueba y confirmá que le asigna un caso y no repite uno ya usado.
- Borrá el equipo de prueba (`teams` + `scores`) antes de que el evento arranque de verdad.

---
*Nota: no existe un botón de "descartar equipo individual" en la UI — es una decisión tomada a propósito para no construir un backoffice completo. El fix de la sección 4 es manual por diseño.*
