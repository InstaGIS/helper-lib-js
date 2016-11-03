
# Helper Libs JS

Este repo contiene helpers no específicos que InstaGIS-app u otro proyecto puede reutilizar

Los componentes son:

* CollectionUtils
* ButtonFactory
* Wkt	
* Wicket	
* WKT2Object	
* loadingcircle	
* colorset	
* setModalClass	
* isArray	
* spaceString	
* cleanString	
* randomname	
* getCookie

Algunas funciones (las que manipulan el DOM) requieren de jQuery para funcionar.



## Setup

instagis-libs-js está pensado para utilizarse como dependencia mediante **jspm**. Por ejemplo, desde la app web
se instala con:

```sh

jspm install github:instagis/helper-lib-js -o '{"directories":{"lib":"dist"}}'

```

Este comando modifica la configuración de la aplicación insertando la referencia apropiada, mediante la cual
helper-libs se asocia a la carpeta `dist` del presente repositorio. Si se quisiera utilizar, en cambio, la carpeta
src, que contiene los archivos fuente sin consolidar, habría que instalar con:

```sh

jspm install github:instagis/helper-lib-js -o '{"directories":{"lib":"src"}}'

```

Este repo es privado. Recuerde configurar sus credenciales de github.
*(Todos los desarrolladores y máquinas en AWS tienen una llave para eso)*



### Build

Después de hacer modificaciones a este repo, éstas se pasan a producción generando un tag de la forma:

```sh
make tag v=16.1.35
```

(obviamente el valor de `v` debe variar según lo que corresponda, no lo tome al pie de la letra)



