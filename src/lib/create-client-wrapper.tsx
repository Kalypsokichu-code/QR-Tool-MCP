"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

type ClientWrapperOptions<P = unknown> = {
  /** Dynamic import function that returns the component */
  loader: () => Promise<Record<string, ComponentType<P>>>;
  /** Name of the exported component from the client module */
  exportName: string;
  /** Minimum height for the loading state (e.g., "300px", "400px") */
  loadingHeight?: string;
  /** Whether to disable SSR (default: false for client wrappers) */
  ssr?: boolean;
};

/**
 * Factory function to create a dynamic client-wrapper component
 * Reduces boilerplate across tool pages by standardizing the dynamic import pattern
 *
 * @example
 * ```tsx
 * const PDFToMarkdownClient = createClientWrapper({
 *   loader: () => import("./client"),
 *   exportName: "PDFToMarkdownClient",
 *   loadingHeight: "400px"
 * });
 * ```
 */
export function createClientWrapper<P = Record<string, never>>({
  loader,
  exportName,
  loadingHeight = "400px",
  ssr = false,
}: ClientWrapperOptions<P>): ComponentType<P> {
  return dynamic<P>(
    () =>
      loader().then((module) => {
        const candidate = module[exportName];

        if (!candidate) {
          throw new Error(
            `createClientWrapper: export "${exportName}" not found in client module`
          );
        }

        return { default: candidate as ComponentType<P> };
      }),
    {
      ssr,
      loading: () => (
        <div
          className="flex items-center justify-center text-muted-foreground text-sm"
          style={{ minHeight: loadingHeight }}
        >
          Loading…
        </div>
      ),
    }
  );
}
