# Noillirk Answers

English daily companion for the seven-round PlayDaily edition at noillirkanswers.app.

## Run locally

Use Node 22 or newer. Run `npm run dev` and open http://localhost:4173. There are no package dependencies. Run `npm run build` after editing content. Restart the preview after rebuilding.

## Publish a board

Complete the Daily through the official game and open each round on the fresh results screen. Capture the UTC puzzle date, prompt, top answer, displayed alternative answers and their points. Examples may disappear on a later visit. Write an original direction-only hint per question.

Store the record in `data/YYYY-MM-DD.json`. The November 13 record demonstrates the schema. Use `verified` for a board checked against original results, `partial` for seven confirmed prompts with missing top answers, and `reported` for an independently published account. Retain the source URL and actual ISO check timestamp. For a partially checked round, leave its answers empty or include just the observed scored picks in descending order. Only include answers and scores observed in the source.

The build validates the date, seven distinct prompts, hints, top score and descending score tiers. The home page uses the matching UTC record. Missing days show the pending state with clearly marked original practice rounds. Dated third-party reports carry noindex. The archive search matches dates and question text without revealing answers.

## Cloudflare Pages

Use `npm run build` with output directory `dist` and connect the custom domain noillirkanswers.app in the hosting account. The build emits static HTML, robots.txt, sitemap.xml and a Pages advanced-mode Worker. The Worker handles UTC rollover, homepage aliases and the archive even between builds. A newly checked board requires a new build and deployment. A plain static-file host needs a rebuild at each UTC reset.

Original rules and game: https://playdaily.org/noillirk
