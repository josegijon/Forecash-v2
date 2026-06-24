import type { ValidatedSnapshot } from "@/schemas/snapshot.schema";
import { dateTag, triggerDownload } from "./export-helpers";

export const exportToJson = (snapshot: ValidatedSnapshot): void => {
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
        type: "application/json",
    });
    triggerDownload(blob, `forecash-export-${dateTag()}.json`);
};
