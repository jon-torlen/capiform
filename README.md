# Capiform 🍊

Dos páginas de autenticación interactivas protagonizadas por un capibara kawaii con una naranja en la cabeza, inspiradas en la mecánica de *Yeti Login*. Hecho con HTML, CSS y GSAP (CDN), sin dependencias de build.

## Páginas

| Archivo | Descripción |
| --- | --- |
| `index.html` | Inicio de sesión: el capibara sigue el ratón y el caret, sonríe al escribir, se cubre los ojos con sus brazos en la contraseña y "espiar" al mostrarla. |
| `registro.html` | Registro mágico: anillo de progreso, chispitas en el caret, salto y confeti cuando las contraseñas coinciden y explosión final al enviar. |

## Uso

Abre `index.html` o `registro.html` directamente en el navegador. No hay backend: los formularios muestran feedback visual únicamente.

Para servirlo localmente:

```bash
python -m http.server 8000
# o
npx serve .
```

Luego visita `http://localhost:8000`.

## Estructura

- `index.html`, `style.css`, `script.js` — login
- `registro.html`, `registro.css`, `registro.js` — registro
- `capi.jpg` — imagen de referencia
- `jt.jpg` — logo del crédito

## Crédito

Creado por [Jonathan Toro](https://jon-torlen.github.io/).
