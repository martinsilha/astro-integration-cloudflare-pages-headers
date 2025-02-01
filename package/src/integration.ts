import fs from "node:fs/promises";
import path from "node:path";

import type { AstroConfig, AstroIntegrationLogger } from "astro";
import { defineIntegration } from "astro-integration-kit";

const NAME = "astro-integration-cloudflare-pages-headers";

type HeadersFlat = Record<string, string>;
type HeadersNested = Record<string, Record<string, string>>;
type AstroHeaders = HeadersFlat | HeadersNested;

// Helper function to check if an object is empty.
const isEmptyObject = (obj: object): boolean => Object.keys(obj).length === 0;

// Helper function to convert the provided directory into a string path.
function getBuildDir(dir: URL | string): string {
	return typeof dir === "string" ? dir : path.resolve(dir.pathname);
}

// Helper function to generate the _headers file content.
function generateHeadersContent(
	routes: Record<string, Record<string, string>>,
): string {
	const lines: string[] = [];
	for (const [route, headers] of Object.entries(routes)) {
		lines.push(route);
		for (const [headerName, headerValue] of Object.entries(headers)) {
			lines.push(`  ${headerName}: ${headerValue}`);
		}
		lines.push(""); // Add an empty line between routes.
	}
	return lines.join("\n");
}

export const integration = defineIntegration({
	name: NAME,
	setup() {
		let astroHeaders: AstroHeaders | undefined;

		return {
			hooks: {
				"astro:config:setup": ({
					config,
					logger,
				}: { config: AstroConfig; logger: AstroIntegrationLogger }) => {
					logger.info(`[${NAME}] Setting up integration`);
					if (config.server?.headers) {
						astroHeaders = config.server.headers as AstroHeaders;
					}
				},

				"astro:build:done": async ({
					dir,
					logger,
				}: { dir: URL | string; logger: AstroIntegrationLogger }) => {
					logger.info(`[${NAME}] Running build hook`);

					if (
						!astroHeaders ||
						(typeof astroHeaders === "object" && isEmptyObject(astroHeaders))
					) {
						logger.warn(
							`[${NAME}] No headers configuration found in Astro config. Skipping _headers generation.`,
						);
						return;
					}

					// Determine if the headers configuration is flat or nested.
					let routes: Record<string, Record<string, string>>;
					const sampleValue = Object.values(astroHeaders)[0];

					if (typeof sampleValue === "string") {
						// Flat object: apply headers to all routes.
						routes = { "/*": astroHeaders as HeadersFlat };
					} else {
						// Nested object: keys are routes.
						routes = astroHeaders as HeadersNested;
					}

					const buildDir = getBuildDir(dir);
					const headersFilePath = path.resolve(buildDir, "_headers");
					const headersContent = generateHeadersContent(routes);

					try {
						await fs.writeFile(headersFilePath, headersContent, "utf-8");
						logger.info(
							`[${NAME}] Successfully created _headers at ${headersFilePath}`,
						);
					} catch (err) {
						logger.error(`[${NAME}] Failed to write _headers file: ${err}`);
					}
				},
			},
		};
	},
});
