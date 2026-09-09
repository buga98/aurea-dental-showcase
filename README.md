# AUREA DENTAL — dental showcase

Premium responsive showcase stranica za fiktivnu ordinaciju dentalne medicine **AUREA DENTAL**.

## Tehnologija

- dependency-free HTML/CSS/JavaScript
- custom SVG tooth logo i dental arch
- requestAnimationFrame scroll animacije
- IntersectionObserver reveal animacije
- CSS 3D/perspective efekti i pointer parallax
- `prefers-reduced-motion` accessibility fallback
- bez Node procesa u produkciji — servira se direktno iz Nginxa

## Lokalno

Ako je `http-server` dostupan:

```bash
npm run dev
```

Ili bilo koji statički HTTP server.

## Docker / VPS

```bash
docker compose up -d --build
curl http://127.0.0.1:3620/
```

Container sluša na `127.0.0.1:3620`, pa Hestia/Nginx domena može proxyjati prema tom portu.

## Napomena

Ovo je **showcase/demo**. Naziv, tim, adresa, kontakt i svi podaci su fiktivni i prije produkcijske uporabe trebaju se zamijeniti stvarnim podacima ordinacije.
