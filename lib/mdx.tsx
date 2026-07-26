import { run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

import { mdxComponents } from "@/components/content/mdx-components";

export async function renderMDX(code: string) {
  const { default: MDXContent } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return <MDXContent components={mdxComponents} />;
}
