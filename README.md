# ByteCore IA Solutions — versión rediseñada

## Qué cambió
- Nueva paleta visual: azul marino (confianza), violeta/azul (innovación) y acento coral (atención).
- Portada con mensaje más comercial y llamadas a la acción.
- Tarjetas, campos de formulario, botones y secciones con mejor contraste.
- Chat de Cora con estilo visual coordinado y ajustes para móviles.
- Se conservan los IDs del chatbot y los scripts existentes.

## Cómo instalar y ejecutar
1. Descomprime la carpeta.
2. En VS Code, abre la carpeta que contiene `index.html` y `server.js`.
3. Ejecuta `npm install` si hace falta.
4. Crea tu propio archivo `.env` a partir de tu configuración privada anterior. No compartas ni publiques ese archivo.
5. Ejecuta `node server.js`.
6. Abre http://localhost:3000.

## Importante
Por seguridad, el ZIP no incluye `.env`, `.git` ni `node_modules`. Conserva tu `.env` original de forma privada y cópialo a la carpeta actual; nunca lo subas a GitHub.
El PIN de Cora es una verificación de correo para una demostración, no un pago ni una compra real.

## Nuevas funciones de demostración de Cora
- Menú separado para restaurante (BurgerByte), gimnasio (GymByte) y muebles (MueblesByte).
- Catálogos de ejemplo con platos, combos, membresías, productos deportivos y muebles.
- Estado de stock de ejemplo; los productos agotados pueden mostrar alternativas cuando están registradas.
- Flujo para indicar cantidad y elegir domicilio/envío, recogida o consulta de sedes.
- Solicitud de barrio/zona y dirección únicamente cuando el usuario elige entrega.
- Catálogo de muebles con medidas, precios y filtro sencillo por presupuesto, nombre o ancho máximo.
- Conserva nombre, correo y estado del PIN durante la verificación (se corrigió un reinicio prematuro de esos datos).

## Límites de esta versión
- Inventario, cantidades, precios, tarifas y sedes son datos ficticios para demostración. No consultar stock real ni garantizar cobertura hasta conectar un catálogo/backend real del negocio.
- Las sedes de ejemplo no son direcciones reales. Reemplazarlas antes de publicar.
- El PIN verifica el correo; no procesa pagos. El flujo termina como `DEMO - NO PAGADO`. Para cobrar, confirmar pedidos o despachar productos se necesita backend de pedidos y una pasarela de pago.
- No se obtiene automáticamente la ubicación del usuario; se pide barrio/zona y dirección solo si elige domicilio.
