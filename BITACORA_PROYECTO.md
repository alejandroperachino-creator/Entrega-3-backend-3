# Bitácora del proyecto ShipNow

## Introducción

Cuando empecé este proyecto, la idea era armar una API por capas capaz de crear datos de prueba, persistirlos en MongoDB y tener una estructura ordenada para poder seguir creciendo.

La parte más importante no era solo hacer endpoints que funcionen, sino entender qué pasa cuando algo falla. Ahí apareció el problema central: la API tenía errores tirados en varios lados y no respondía de forma uniforme.

Eso me hizo entender que antes de seguir avanzando, tenía que ordenar la arquitectura y centralizar el manejo de errores.

---

## 1) Primera versión del proyecto

La primera versión tenía una base razonable: rutas, controllers, services y repositories. Pero al probar endpoints reales me di cuenta de que la validación y la respuesta de errores no estaban del todo definidas.

Había casos en los que el error se respondía dentro del controller, otros en la ruta, y otros simplemente quedaban sin una estructura clara. Eso hacía que la API fuera difícil de seguir y que el cliente no pudiera confiar en una respuesta consistente.

La conclusión fue clara: faltaba una capa común para errores y también más orden en la arquitectura.

---

## 2) Ordenando la arquitectura por capas

Decidí reforzar el patrón por capas para que cada parte tenga una responsabilidad clara:

- routes: reciben la petición y delegan
- controllers: se encargan de la parte HTTP
- services: aplican validaciones y lógica de negocio
- repositories: interactúan con MongoDB
- middlewares: transforman errores y responden al cliente

Esto fue importante porque separó la lógica de negocio de la forma en que se responde al cliente. Antes, el error y la respuesta estaban mezclados. Después, la capa de servicio hacía el análisis del problema y el middleware tomaba la decisión final de cómo responder.

---

## 3) Los errores estaban dispersos

El problema real estaba en la consistencia.

No había una regla del tipo “si falla, se responde igual”. Por ejemplo:

- un usuario inexistente no se manejaba igual que una cantidad inválida
- un error de validación no era igual que un error de MongoDB
- la estructura del JSON no era estable

Eso me llevó a pensar que no bastaba con arreglar errores sueltos, sino que había que centralizar todo el manejo de errores en una única capa.

---

## 4) Pre-entrega Módulo 3 — Manejo profesional de errores

### Objetivo

Centralizar el manejo de errores de ShipNow API en una capa común que devuelva respuestas HTTP consistentes, en lugar de responder errores de forma aislada en cada ruta o controller.

### Qué entregué

- errores personalizados del dominio
- diccionario de errores centralizado
- middleware global para transformar errores en respuestas HTTP
- validación del módulo de mocks con errores controlados

### Criterios que buscaba cumplir

- No había respuestas de error dispersas en rutas o controllers
- Los services detectaban las reglas de negocio inválidas
- El middleware era la única capa que respondía al cliente
- Todas las respuestas de error tenían una estructura uniforme
- El módulo de mocks validaba cantidad incorrecta, valores negativos y estados inválidos

Esto era importante porque el proyecto debía mantenerse ordenado y legible, no solo funcionando.

---

## 5) Implementación de `CustomError` y diccionario

Cuando armé la capa de errores, me di cuenta de que necesitaba una estructura más clara para cada error del proyecto.

Definí un diccionario con errores como:

- `BAD_REQUEST_ERROR`
- `NOT_FOUND_ERROR`
- `VALIDATION_ERROR`
- `INTERNAL_SERVER_ERROR`
- `USER_NOT_FOUND_ERROR`
- `ORDER_NOT_FOUND_ERROR`
- `PRODUCT_NOT_FOUND_ERROR`
- `DELIVERY_NOT_FOUND_ERROR`
- `RESOURCE_CONFLICT_ERROR`

Además, creé la clase `CustomError` para que cada error tenga información útil:

- nombre
- código
- mensaje
- status HTTP
- detalles
- causa

Esto estaba mucho mejor que mandar un `Error` genérico por todos lados.

---

## 6) Middleware global de errores

La pieza más importante fue el middleware global.

La idea final quedó así:

- el service detecta el error
- el controller lo deriva con `next(error)`
- el middleware central lo transforma y responde al cliente

Eso me permitió eliminar respuestas manuales repetidas en routes y controllers. La API empezó a responder siempre con el mismo formato, y eso hace que el consumo sea mucho más claro.

---

## 7) Módulo de mocks y validación de negocio

El módulo de mocks también tenía que entrar en este estándar. No podía quedar fuera de la lógica de errores y validaciones.

Entre los casos que validé estuvieron:

- `qty` no numérico
- valores negativos
- valores fuera de rango
- role inválido
- seed inválido
- datos faltantes para generar usuarios, órdenes o entregas
- fallos de persistencia en MongoDB

Esto fue clave porque esos errores habían aparecido al probar la generación de datos en memoria y la inserción real en MongoDB.

---

## 8) Revisión de controllers y rutas

Después de armar la base de errores, revisé el resto del proyecto para asegurarme de que no quedaran respuestas manuales por ahí.

La regla quedó bastante clara:

- `service` detecta el problema
- `controller` deja pasar el error
- `middleware` responde al cliente

Eso nos deja con una arquitectura más ordenada y más fácil de mantener.

---

## 9) Ajustes de entorno y preparación local

Durante la revisión final del proyecto, aparecieron dos detalles importantes que también había que dejar bien para la entrega:

### `.env.example`

Se agregó un archivo de ejemplo con las variables mínimas necesarias:

- `PORT`
- `MONGODB_URI`
- `NODE_ENV`

Esto ayuda a que cualquier persona pueda levantar el proyecto sin conocer valores reales del entorno.

### `.gitignore`

También agregué un `.gitignore` para evitar versionar archivos sensibles como `.env` y dependencias locales como `node_modules`.

Eso dejó el setup más limpio y alineado con la práctica real de repositorios.

---

## 10) Correcciones del feedback de la primera entrega

En una revisión más crítica del proyecto, también detecté un par de puntos que había que corregir para dejarlo más sólido.

### 1. Strings mágicos en los modelos

Los enums en `order.model.js` y `delivery.model.js` estaban usando valores hardcodeados, aunque ya tenía constantes definidas para status y prioridad. Eso hacía que el código fuera menos legible y menos mantenible.

La corrección fue derivar los enums directamente desde `ORDER_STATUS`, `ORDER_PRIORITY` y `DELIVERY_STATUS`.

### 2. Bug en la creación de órdenes

Había un problema en `OrderService.calculateShippingCost`: el cálculo dependía de una `apiKey` que nunca existía, así que cualquier POST a `/api/orders` podía romper el endpoint con 500.

Eso no formaba parte del scope del módulo de errores, pero sí estaba rompiendo una ruta importante del proyecto. Lo corregí para que el cálculo fuera determinista y no dependiera de variables externas inexistentes.

### 3. Deliveries monolítico

La ruta `deliveries.js` estaba haciendo lógica directa con Mongoose y tenía valores hardcodeados. Eso se alejaba del patrón del resto del proyecto. En este repo quedé con el enfoque por capas para esta parte, para que el módulo de deliveries no quede “a medias”.

---

## 11) Verificación final del proyecto

Antes de cerrar la entrega, revisé que todo siguiera funcionando con las correcciones:

- entorno local configurado con `.env.example`
- validación de mocks y errores centralizados
- rutas y servicios coherentes con la arquitectura
- cálculo de shipping sin dependencias ocultas
- tests de validación de errores

La validación del proyecto quedó en un estado consistente y controlado.

---

## 12) Resultado final

Al terminar esta entrega, el proyecto quedó mucho más sólido que en la primera versión.

No solo se mejoró el manejo de errores, sino que también se ordenó mejor la estructura, se corrigieron detalles del backend y se consolidó una API más profesional y mantenible.

Lo más valioso es que ahora la aplicación responde de forma predecible, y la arquitectura por capas queda mucho más clara para seguir desarrollando el proyecto.

---

## 13) Aprendizaje final

La entrega 3 me dejó una enseñanza muy clara: un backend no se trata solo de hacer endpoints, sino de decidir qué pasa cuando algo falla y cómo esa falla se comunica al cliente.

Centralizar errores, mantener una estructura consistente y validar el módulo de mocks hizo que el proyecto sea más mantenible, más legible y más preparado para seguir creciendo.

En resumen: esto no fue solo arreglar errores, sino dejar una base más sólida para todo lo que viene después.

---

## 14) Actividad de la entrega

### Pre-entrega Módulo 3 — Manejo profesional de errores

**Objetivo**: centralizar el manejo de errores de ShipNow API en una capa común que devuelva respuestas HTTP consistentes, en lugar de responder errores de forma aislada en cada ruta o controller.

**Qué entregar**: una capa centralizada de gestión de errores compuesta por:

- errores personalizados del dominio
- un diccionario de errores
- un middleware global que transforme esos errores en respuestas HTTP uniformes

Esta lógica también se aplica al módulo de mocks del módulo anterior.

**Criterios de aceptación**:

- No hay respuestas de error dispersas en rutas o controllers; todo se deriva a la capa común.
- Los errores se detectan en la capa que corresponde, pero la respuesta final al cliente sale únicamente del middleware.
- Todos los errores responden con una estructura clara, predecible y uniforme.
- Existen errores personalizados que representan casos del dominio.
- El módulo de mocks valida los datos recibidos y responde de forma controlada ante cantidad inválida, valores negativos y fallas durante la carga en MongoDB.

**Entregable**: link al repositorio de GitHub del proyecto ShipNow, sin `node_modules`, con la capa de manejo de errores ya integrada. El README debe explicar la estructura de respuesta de error y cómo probar el comportamiento ante casos inválidos.

---

## 15) Cierre de la bitácora

Esta bitácora refleja el recorrido del proyecto desde la base inicial hasta la entrega 3: se ordenó la arquitectura, se centralizó el manejo de errores, se integró el módulo de mocks y se fueron corrigiendo los detalles que aparecían al probar la API en la práctica.

El resultado final es un proyecto más ordenado, más consistente y mucho más preparado para seguir avanzando en la próxima etapa.
