import { IndexSlot } from "@/components/frame/IndexSlot";
import { PageTitleSlot } from "@/components/frame/PageTitleSlot";

export const metadata = {
  title: "Frame test · Light",
};

// Smoke route — the frame shell on the light canvas. Removed in the polish feature.
export default function TestLightPage() {
  return (
    <>
      <PageTitleSlot>Frame Test</PageTitleSlot>
      <IndexSlot>01 / 04</IndexSlot>
      <p className="fixed left-[calc(var(--frame-col-details)_+_var(--frame-col-list))] top-[50vh] z-10 max-w-[420px] -translate-y-1/2 px-[var(--frame-edge)] text-body text-text-white-70 canvas-light:text-text-dark-70">
        Placeholder content in the flex column. This route shows the persistent
        frame on the light canvas — role, name, menu toggle, the page-title slot
        and the index slot.
      </p>
    </>
  );
}
