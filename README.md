# Sitio web — Rosa Briceño | Psicología y Psicoterapia

Sitio estático (HTML/CSS/JS, sin frameworks ni dependencias de build) para posicionar y captar pacientes para psicoterapia online. Optimizado para móvil, con botón flotante de WhatsApp, SEO básico y estructura preparada para crecer (blog/recursos).

## Estructura

```
index.html          Página principal (una sola página con secciones ancladas)
privacidad.html      Política de privacidad y tratamiento de datos
css/styles.css        Estilos (paleta, tipografía, responsive)
js/main.js            Menú móvil, acordeón de FAQ, header con sombra al hacer scroll
assets/img/           Logo, favicon e ilustraciones
robots.txt, sitemap.xml   SEO técnico
```

## Estado del material gráfico

- ✅ **Logo real** (`assets/img/logo.jpeg`): ya integrado en el header y el footer.
- ✅ **Foto de portada / hero** (`assets/img/foto-hero.jpeg`): ya integrada en la sección `#inicio`, y también se usa como imagen de vista previa para redes sociales (Open Graph / Twitter Card).
- ⏳ **Foto de "Sobre mí"**: pendiente. Actualmente se sigue usando una ilustración minimalista propia (`assets/img/foto-sobre-mi.svg`) como reemplazo temporal. Cuando envíes la segunda fotografía (plano medio, más natural), reemplaza el archivo y actualiza la referencia en `index.html` (sección "Sobre mí").
- ⏳ **Foto de contacto/cierre (opcional)**: si se desea una tercera fotografía, puede añadirse en la sección de CTA final.
- **Imagen de Open Graph**: por ahora se usa `foto-hero.jpeg` directamente (funciona bien en WhatsApp/Facebook/Twitter). Si más adelante quieres una imagen horizontal dedicada (1200x630px, con foto + logo + texto), se puede diseñar y volver a apuntar `og:image`/`twitter:image` en `index.html`.

Las ilustraciones que aún quedan (`foto-sobre-mi.svg`, `favicon.svg`) son gráficos minimalistas propios creados para este sitio (no son fotografías de stock ni de terceros), pensados solo como reemplazo temporal hasta contar con el material real.

## Datos a confirmar / actualizar

- **WhatsApp**: el número 977 463 071 ya está configurado en todos los botones (`https://wa.me/51977463071?text=...`). Si cambia, buscar y reemplazar `51977463071` en `index.html`.
- **Correo electrónico**: se usó `contacto@psicologarosabriceno.com` como referencia (footer, CTA y política de privacidad). Reemplazar por el correo profesional real cuando esté definido.
- **Dominio**: las URLs canónicas y de Open Graph usan `https://psicologarosabriceno.com/` como referencia. Actualizar en `index.html`, `privacidad.html`, `robots.txt` y `sitemap.xml` cuando se defina el dominio final.
- **Precios**: sesión individual S/ 65, paquete de 4 sesiones S/ 240, paquete de 6 sesiones S/ 330 (sección `#tarifas`).
- **Redes sociales**: Instagram, TikTok, Facebook y LinkedIn ya están enlazadas en el footer con las URLs proporcionadas en el brief.
- **Testimonios**: la sección se dejó como un espacio reservado (sin testimonios inventados). Cuando existan testimonios reales autorizados por pacientes, se pueden reemplazar en `index.html` (sección "Testimonios").

## Cómo publicar (opciones sencillas)

- **GitHub Pages** (gratis, recomendado para empezar): en la configuración del repositorio, activar Pages apuntando a la rama principal (carpeta raíz). El sitio quedará disponible en una URL tipo `https://jetz12341wp.github.io/PsicologaRosaBriceno/`, y luego se puede conectar un dominio propio desde ahí (ya incluye SSL automático).
- **Cualquier hosting estático** (Netlify, Vercel, hosting tradicional): subir todos los archivos tal cual, sin proceso de build.

## Próximos pasos sugeridos

- Conectar Google Analytics / Search Console (agregar el snippet correspondiente antes de `</head>` en `index.html`).
- Agregar la sección de **Blog / Recursos** cuando haya contenido: ya existe un teaser en la home (`Recursos psicológicos`) listo para ampliarse con artículos reales.
- Revisar ortografía, precios, datos de contacto y funcionamiento de los botones de WhatsApp en celular antes de publicar (checklist del brief original).
