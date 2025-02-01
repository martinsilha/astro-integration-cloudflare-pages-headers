# `astro-integration-cloudflare-pages-headers`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that takes the headers provided to the Astro config object and applies them to a Cloudflare Pages deployment `_headers` file during build.

## Usage

### Prerequisites

TODO:

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-integration-cloudflare-pages-headers
```

```bash
npx astro add astro-integration-cloudflare-pages-headers
```

```bash
yarn astro add astro-integration-cloudflare-pages-headers
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-integration-cloudflare-pages-headers
```

```bash
npm install astro-integration-cloudflare-pages-headers
```

```bash
yarn add astro-integration-cloudflare-pages-headers
```

2. Add the integration to your astro config

```diff
+import integration from "astro-integration-cloudflare-pages-headers";

export default defineConfig({
  integrations: [
+    integration(),
  ],
});
```

### Configuration

TODO:configuration

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/TODO:/blob/main/LICENSE). Made with ❤️ by [martinsilha](https://github.com/martinsilha).

## Acknowledgements

- Created using [astro-integration-template](https://github.com/florian-lefebvre/astro-integration-template).
