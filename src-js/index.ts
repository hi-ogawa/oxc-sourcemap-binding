import initPkg, { visualize_sourcemap } from "../pkg/index.js";

const INLINE_SOURCE_MAP_RE = new RegExp(
  `//# ${"sourceMappingURL"}=data:application/json[^,]+base64,([A-Za-z0-9+/=]+)$`,
  "gm",
);

export function visualizeSourcemap(code: string, map?: string) {
  if (!map) {
    const match = [...code.matchAll(INLINE_SOURCE_MAP_RE)].at(-1);
    if (match && match[1]) {
      map = atob(match[1]);
    } else {
      throw new Error("Inline source map not found");
    }
  }
  return visualize_sourcemap(code, map);
}

let initNodeOnce: Promise<void>;
export async function initNode() {
  return (initNodeOnce ??= initNode_());
}

async function initNode_() {
  const fs = await import("node:fs");
  const data = await fs.promises.readFile(
    new URL("../pkg/index_bg.wasm", import.meta.url),
  );
  await initPkg({
    module_or_path: new Response(data, {
      headers: {
        "content-type": "application/wasm",
      },
    }),
  });
}
