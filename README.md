# Pre-entrega Módulo 3 — ShipNow API

## Qué hice

Esta entrega la hice con el objetivo de ordenar el manejo de errores del proyecto. Antes había errores tirados por distintos lados y la API no respondía siempre igual. Lo que busqué fue que todo pase por una misma capa, para que el cliente reciba respuestas más claras y consistentes.

En resumen, el flujo quedó así:

- el service detecta el problema
- el controller lo deriva con `next(error)`
- el middleware central toma ese error y devuelve la respuesta final

También aplique esto al módulo de mocks, porque en la anterior entrega había validaciones básicas, pero no estaban bien centralizadas.

---

## Qué aprendí sobre la arquitectura

La idea es que cada capa haga lo suyo:

- service: valida reglas de negocio y lanza errores
- controller: no hace manejo manual del error, solo lo deriva
- middleware: se encarga de transformar todo en una respuesta HTTP uniforme

Eso hace que el proyecto se vea más ordenado y más "profesional", aunque todavía lo estamos haciendo como estudiante y no como una app enorme de producción.

---

## Errores personalizados

En este proyecto armé un diccionario de errores y una clase custom para encapsular los errores del dominio. Algunos ejemplos son:

- usuario no encontrado
- producto no encontrado
- pedido no encontrado
- entrega no encontrada
- tipo de dato inválido
- cantidad inválida en mocks
- conflicto de recursos
- permisos denegados

La ventaja es que no estamos mandando mensajes random o hardcodeados por todos lados. Todo queda centralizado y más fácil de mantener.

---

## Formato de respuesta

Cuando algo sale mal, la API responde con algo así:

```json
{
  "success": false,
  "status": "error",
  "error": {
    "code": "INVALID_TYPE_ERROR",
    "message": "La cantidad de mocks debe ser un numero entero positivo mayor a cero."
  },
  "timestamp": "2026-10-01T12:00:00.000Z"
}
```

Esto se mantiene igual para todos los errores, aunque sean de distintos módulos. Eso ayuda mucho porque el frontend o quien consuma la API sabe exactamente qué esperar.

---

## Módulo de mocks

En la parte de mocks también validé entradas incorrectas. Por ejemplo:

- si `qty` no es un número
- si viene negativo
- si el valor no cumple con el rango permitido
- si no se puede generar bien la data de prueba

Eso hace que la API no se rompa ni responda con cosas raras cuando se manda un parámetro inválido.

---

## Archivos clave

Los archivos más importantes para esta entrega son:

- `src/utils/errors.js`
- `src/middlewares/errorHandler.js`
- `src/middlewares/globalErrorHandler.js`
- `src/middlewares/routeNotFoundHandler.js`
- `src/services/mock.service.js`

También están todos los services principales usando ese mismo patrón de errores para que el proyecto quede más consistente.

---

## Preparación local

Antes de levantar la API, copiate el ejemplo del entorno:

```bash
cp .env.example .env
```

Luego instalá dependencias y levantá el proyecto:

```bash
npm install
npm run dev
```

> El archivo `.env` queda ignorado por Git a través del `.gitignore` del proyecto.

---

## Cómo probarlo

### 1) Levantar el proyecto

```bash
cp .env.example .env
npm install
npm run dev
```

### 2) Probar un mock inválido

```bash
curl "http://localhost:3000/api/mocks/users?qty=abc"
```

Eso debería devolver un error 400 y un JSON con el formato uniforme.

### 3) Probar un valor negativo

```bash
curl "http://localhost:3000/api/mocks/users?qty=-5"
```

También debería devolver una respuesta controlada.

### 4) Probar una ruta que no existe

```bash
curl "http://localhost:3000/api/ruta-inexistente"
```

Esto debería responder con 404 usando el mismo sistema central.

---

## Tests

También dejé pruebas para validar esto:

- estructura del `CustomError`
- factory de errores
- middleware centralizando la respuesta
- validación de mocks con qty inválido y negativo

Para correr todo:

```bash
npm test
```

---

## Mi opinión final

Me parece que esta entrega queda mucho más ordenada que la versión anterior. La parte más importante es que el error ya no se resuelve "a mano" en varios lados, sino que se centraliza y eso ayuda mucho a mantener la API legible y clara.

No es una app gigante ni súper compleja, pero sí deja la base bien hecha para seguir creciendo. Además, al aplicarlo al módulo de mocks, quedó más completo y más acorde con lo que pide la pre-entrega.

---

## Nota para la entrega

- subir el repo sin `node_modules`
- incluir este README en la entrega
- y dejar la bitácora del proyecto también como parte del trabajo

En resumen: este módulo me sirvió para entender mejor cómo organizar el manejo de errores en una API y por qué es importante que todo pase por una misma capa.
