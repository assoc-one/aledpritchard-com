/**
 * COS-199 (T3) — rename every slide `variant: "fit"` → `"fill"` in production Sanity.
 *
 * One-shot, reversible via Sanity history. Dry-run by default — it only logs what
 * WOULD change. Pass `--commit` to actually write.
 *
 * Auth: runs under your logged-in Sanity CLI session (no token to provision),
 * via `getCliClient()` + the `--with-user-token` flag.
 *
 *   Dry-run:  npx sanity exec scripts/migrations/rename-fit-to-fill.ts --with-user-token
 *   Commit:   npx sanity exec scripts/migrations/rename-fit-to-fill.ts --with-user-token -- --commit
 *
 * Project id / dataset come from sanity.cli.ts (NEXT_PUBLIC_SANITY_* in .env.local).
 */
import { getCliClient } from "sanity/cli";

const COMMIT = process.argv.includes("--commit");

const client = getCliClient({ apiVersion: "2024-10-01" });

interface Slide {
  _key?: string;
  variant?: string;
  image?: { asset?: { _ref?: string } };
}
interface Project {
  _id: string;
  title?: string;
  slug?: string;
  slides?: Slide[];
}

async function run() {
  const projects: Project[] = await client.fetch(
    `*[_type == "project"]{ _id, title, "slug": slug.current, slides[]{ _key, variant, image } }`,
  );

  console.log(
    `\n${COMMIT ? "COMMIT" : "DRY-RUN"} — scanning ${projects.length} project(s) for slide variant "fit"…\n`,
  );

  let totalChanges = 0;
  let affectedDocs = 0;

  for (const project of projects) {
    const slides = project.slides ?? [];
    const targets = slides
      .map((slide, index) => ({ slide, index }))
      .filter(({ slide }) => slide.variant === "fit");

    if (targets.length === 0) continue;
    affectedDocs++;

    const label = project.slug ?? project._id;
    for (const { slide, index } of targets) {
      totalChanges++;
      const ref = slide.image?.asset?._ref ?? "(no image)";
      const key = slide._key ?? `index ${index}`;
      console.log(`  ${label}  ·  slide[${index}] (${key})  ·  fit → fill  ·  ${ref}`);
    }

    if (COMMIT) {
      let patch = client.patch(project._id);
      for (const { slide, index } of targets) {
        // Prefer _key targeting (stable across reorders); fall back to index.
        const path = slide._key
          ? `slides[_key=="${slide._key}"].variant`
          : `slides[${index}].variant`;
        patch = patch.set({ [path]: "fill" });
      }
      await patch.commit();
      console.log(`  ✔ committed ${targets.length} change(s) to ${label}`);
    }
  }

  console.log(
    `\n${COMMIT ? "COMMITTED" : "DRY-RUN"}: ${totalChanges} slide(s) across ${affectedDocs} project(s) ${
      COMMIT ? "updated" : "would change"
    } fit → fill.`,
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
