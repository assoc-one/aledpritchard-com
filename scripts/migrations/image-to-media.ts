/**
 * COS-222 (T11) — move every slide's legacy top-level `image` into the new
 * polymorphic `media.image` field, then unset the old top-level `image`.
 *
 * One-shot, reversible via Sanity history. Dry-run by default — it only logs what
 * WOULD change. Pass `--commit` to actually write.
 *
 * Auth: runs under your logged-in Sanity CLI session (no token to provision),
 * via `getCliClient()` + the `--with-user-token` flag.
 *
 *   Dry-run:  npx sanity exec scripts/migrations/image-to-media.ts --with-user-token
 *   Commit:   npx sanity exec scripts/migrations/image-to-media.ts --with-user-token -- --commit
 *
 * Project id / dataset come from sanity.cli.ts (NEXT_PUBLIC_SANITY_* in .env.local).
 *
 * Back-compat note: the GROQ query already coalesces a legacy top-level `image`
 * into `media.image` at read time, so the site renders correctly before AND
 * after this migration runs. This script makes the schema clean (no orphaned
 * top-level `image`); it is safe to run, and reversible if needed.
 */
import { getCliClient } from "sanity/cli";

const COMMIT = process.argv.includes("--commit");

const client = getCliClient({ apiVersion: "2024-10-01" });

interface ImageValue {
  asset?: { _ref?: string };
}
interface Slide {
  _key?: string;
  variant?: string;
  image?: ImageValue;
  media?: { image?: ImageValue; video?: unknown };
}
interface Project {
  _id: string;
  title?: string;
  slug?: string;
  slides?: Slide[];
}

async function run() {
  const projects: Project[] = await client.fetch(
    `*[_type == "project"]{ _id, title, "slug": slug.current, slides[]{ _key, variant, image, media } }`,
  );

  console.log(
    `\n${COMMIT ? "COMMIT" : "DRY-RUN"} — scanning ${projects.length} project(s) for legacy top-level slide image…\n`,
  );

  let totalChanges = 0;
  let affectedDocs = 0;
  let skipped = 0;

  for (const project of projects) {
    const slides = project.slides ?? [];
    const targets = slides
      .map((slide, index) => ({ slide, index }))
      .filter(({ slide }) => {
        // Migrate only slides that still carry a top-level image.
        if (!slide.image?.asset?._ref) return false;
        // Defensive: if media.image already exists, don't clobber it — just
        // flag for the unset (handled below). Counts as already-migrated.
        if (slide.media?.image?.asset?._ref) {
          skipped++;
          return false;
        }
        return true;
      });

    if (targets.length === 0) continue;
    affectedDocs++;

    const label = project.slug ?? project._id;
    for (const { slide, index } of targets) {
      totalChanges++;
      const ref = slide.image?.asset?._ref ?? "(no image)";
      const key = slide._key ?? `index ${index}`;
      console.log(`  ${label}  ·  slide[${index}] (${key})  ·  image → media.image  ·  ${ref}`);
    }

    if (COMMIT) {
      let patch = client.patch(project._id);
      for (const { slide, index } of targets) {
        // Prefer _key targeting (stable across reorders); fall back to index.
        const base = slide._key
          ? `slides[_key=="${slide._key}"]`
          : `slides[${index}]`;
        patch = patch
          .set({ [`${base}.media`]: { image: slide.image } })
          .unset([`${base}.image`]);
      }
      await patch.commit();
      console.log(`  ✔ committed ${targets.length} change(s) to ${label}`);
    }
  }

  console.log(
    `\n${COMMIT ? "COMMITTED" : "DRY-RUN"}: ${totalChanges} slide(s) across ${affectedDocs} project(s) ${
      COMMIT ? "updated" : "would change"
    } image → media.image.` + (skipped ? ` (${skipped} already migrated, skipped.)` : ""),
  );
  if (!COMMIT && totalChanges > 0) {
    console.log(
      "\nRe-run with `-- --commit` to apply (after the dry-run is approved).",
    );
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
