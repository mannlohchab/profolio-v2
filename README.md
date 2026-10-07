# mann-works-ui

Personal site UI — SvelteKit + Tailwind. Heroku app: `mann-works-ui`.

Homepage layout follows a blueprint-style centered column (inspired by [Ashutoshx7/Portfolio-v2-](https://github.com/Ashutoshx7/Portfolio-v2-)): dotted rails, square avatar frame, section index, and chip skills — with Mann’s content kept intact.

Icons come from [Nucleo](https://nucleoapp.com/) (Social Media, Micro Bold, Sharp) via `src/lib/components/NucleoIcon.svelte`.

## Custom domain

`mann.expert` and `www.mann.expert` are attached on Heroku with ACM TLS.

| Host | DNS type | Target |
| --- | --- | --- |
| `mann.expert` | ALIAS / ANAME | `aquatic-cardinal-pynl994cjwe2m7bb2mw4vkdg.herokudns.com` |
| `www.mann.expert` | CNAME | `spherical-possum-3yyebclt0ihz5punv6inf3wt.herokudns.com` |

## Run locally

```sh
npm install
npm run dev -- --port 43123 --host 127.0.0.1
```

### Analytics (PostHog)

The site uses [PostHog](https://posthog.com) for pageviews and autocapture. It stays off until a project key is set.

1. Create a project at [app.posthog.com](https://app.posthog.com) and copy the **Project API Key** (`phc_…`).
2. Locally:

```sh
cp .env.example .env
# edit PUBLIC_POSTHOG_KEY (and PUBLIC_POSTHOG_HOST if your project is on EU cloud)
```

3. On Heroku:

```sh
heroku config:set PUBLIC_POSTHOG_KEY=phc_xxx PUBLIC_POSTHOG_HOST=https://us.i.posthog.com -a mann-works-ui
```

Without these vars the site runs normally and sends no analytics.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run check` | Typecheck |
| `npm test` | Unit tests |

## Deployed app

- https://mann.expert
- https://www.mann.expert
- https://mann-works-ui-bab3bad81132.herokuapp.com/
