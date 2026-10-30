# Monguí Turismo – Plataforma Dinámica

Sitio web turístico para **Monguí, Boyacá** con CMS headless, panel de administración, i18n (ES/EN) y despliegue en Vercel.

## Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Estilos**: CSS‑Modules + variables CSS (tema azul existente)
- **Base de datos**: MySQL 8 (Prisma ORM)
- **Auth**: NextAuth v5 (credentials + JWT HttpOnly)
- **Assets**: Cloudflare R2 (S3‑compatible) – presigned POST
- **Editor rico**: TipTap (HTML sanitizado con DOMPurify)
- **Validación**: Zod + react-hook-form
- **Tests**: Jest + React Testing Library (unit) – Playwright (E2E)
- **CI/CD**: GitHub Actions → Vercel

## Requisitos previos

- Node.js ≥ 20
- pnpm ≥ 8
- MySQL 8 (local o cloud)
- Cuenta Cloudflare R2 (bucket + credenciales)

## Instalación local

```bash
# 1. Clonar e instalar dependencias
pnpm install

# 2. Copiar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales reales

# 3. Generar cliente Prisma y crear tablas
pnpm prisma:generate
pnpm prisma:migrate   # aplica migraciones (crea schema)

# 4. Crear primer usuario administrador
pnpm tsx scripts/create-admin.ts admin@mongui.turismo "SuperSecret123" "Admin Principal"

# 5. Levantar en desarrollo
pnpm dev
```

Abre `http://localhost:3000/es` (o `/en`) – verás la home renderizada desde la BD (vacía al inicio).  
Panel admin: `http://localhost:3000/admin/dashboard` (login con el usuario creado).

## Estructura principal

```
src/
 ├─ app/
 │   ├─ [locale]/                # Páginas públicas (home, términos, buscador…)
 │   ├─ admin/                   # Panel protegido (middleware)
 │   └─ api/
 │       ├─ auth/[...nextauth]   # NextAuth
 │       └─ upload/presign       # Presigned POST a R2
 ├─ components/
 │   ├─ sections/SectionRenderer # Renderiza Section → Blocks
 │   └─ blocks/                  # BlockText, BlockImage, …
 ├─ lib/
 │   ├─ auth.ts                  # Config NextAuth
 │   ├─ prisma.ts                # Cliente Prisma singleton
 │   └─ content.ts               # Helpers de consulta (getSections, getTerm)
 ├─ middleware.ts                # Protege /admin/*
 └─ messages/
     ├─ es.json
     └─ en.json
prisma/schema.prisma               # Esquema BD
scripts/create-admin.ts            # Seed admin
```

## Scripts útiles

| Comando | Qué hace |
|---------|----------|
| `pnpm dev` | Servidor Next.js con hot‑reload |
| `pnpm build` | Build producción |
| `pnpm start` | Ejecuta build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Jest unit |
| `pnpm e2e` | Playwright E2E |
| `pnpm prisma:studio` | UI de Prisma |

## Despliegue en Vercel

1. Conecta el repo a Vercel.
2. Añade **Environment Variables** (las mismas de `.env`).
3. Vercel detecta Next.js → build automático.
4. Habilita **Edge Functions** para `middleware.ts` y API routes.
5. Configura **ISR on‑demand**: `revalidatePath('/[locale]/')` se llama en `publishSection`.

## Próximos pasos (backlog)

- [ ] Editor completo de bloques (TipTap + dnd‑kit) en `/admin/sections/[id]`.
- [ ] Biblioteca de medios con virtualización y borrado seguro.
- [ ] Búsqueda full‑text (MySQL `MATCH…AGAINST`) + página `/buscador`.
- [ ] Publicación programada y versionado de secciones.
- [ ] Analytics (Plausible / GA4) + consentimiento cookies.
- [ ] Tests de snapshot visual (Chromatic) y cobertura ≥ 80 %.

## Licencia

Proyecto educativo – uso libre para fines escolares.