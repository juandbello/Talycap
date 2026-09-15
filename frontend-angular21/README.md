# Frontend Angular 21

Tablas de clima y series con Angular Material. Consulta Open-Meteo y TVMaze mediante dos servicios HTTP. Funciona de forma independiente de la API .NET.

## Requisitos

Node.js 24.x y npm, o una [versión compatible con Angular 21](https://angular.dev/reference/versions). Necesitas conexión a internet para consultar las APIs.

## Iniciar

Desde esta carpeta:

```powershell
npm ci
npm start
```

Abre [http://localhost:4200](http://localhost:4200). No necesitas instalar Angular CLI globalmente. Para detener el servidor, usa `Ctrl+C`.

## Probar

- En **Clima**, comprueba que aparezcan cinco ciudades por página. Busca `Cali`, limpia el filtro y pasa a la siguiente página.
- Cambia a **Series**, busca `Girls` y revisa título, fecha, calificación y póster.
- Prueba un nombre inexistente para ver el mensaje sin resultados. Desconecta internet y cambia de sección para comprobar el aviso de error.
- Reduce el ancho del navegador y revisa los controles y el desplazamiento del contenido.

Para compilar y ejecutar las pruebas:

```powershell
npm run build
npm test
```

Las pruebas cubren paginación, filtros, errores HTTP, cambios de sección y estados del clima.

El proxy está en `proxy.conf.json` y se aplica durante el desarrollo. Si lo cambias, reinicia `npm start`. Para publicar el build hay que configurar esas rutas en el alojamiento.
