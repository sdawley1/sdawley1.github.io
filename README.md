# sdawley1.github.io

Personal site of Sam Dawley, built with [HugoBlox](https://hugoblox.com) (Resume template, Tailwind v4) and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

- **Content** lives in `data/authors/me.yaml` (bio, experience, education, skills, honors) and `content/_index.md` (section order, research areas, publications, projects, teaching).
- **Site settings** are in `config/_default/` (`params.yaml` for theme and header, `menus.yaml` for the anchor nav).
- **PDFs**: LaTeX sources for the CV and the one-page résumé are in `cv/`. Run `cv/build.sh` (needs [tectonic](https://tectonic-typesetting.github.io)) to regenerate `static/uploads/Dawley_CV.pdf` and `static/uploads/Dawley_Resume.pdf`.
- **Local preview**: `pnpm install` once, then `hugo server`.
