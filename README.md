# nosole

A lightweight logger for JavaScript and TypeScript that keeps your console clean in production by default.

- 🌐 Works everywhere — Node.js, Browsers, Bun, Deno, Edge runtimes, and Workers
- 📦 ESM + CommonJS support out of the box
- 🚀 Zero-overhead muted logs using noop functions
- 🛡️ Automatically disables logs in production
- 🪶 Zero dependencies and tiny bundle size

---

# Installation

```bash
npm install nosole
```

---

# Quick Start

## Basic Usage

```ts
import { log, info, warn, error, debug } from "nosole";

log("Hello from your app!");
info("User session initialized.");
warn("Rate limit approaching...");
error("Failed to fetch dashboard data.");
debug("Internal cache state:", { items: 4 });
```

In development:

- logs behave normally

In production:

- logs are automatically muted

---

## Scoped Loggers

```ts
import { createLogger } from "nosole";

const authLogger = createLogger({
  prefix: "AuthService",
});

authLogger.info("User logged in successfully");
```

Output:

```txt
[AuthService] User logged in successfully
```

---

# API

## `createLogger(options?)`

Creates a custom logger instance.

```ts
interface LoggerOptions {
  prefix?: string;
  enabled?: boolean;
}
```

### Example

```ts
const logger = createLogger({
  prefix: "API",
  enabled: true,
});
```

---

# Environment Detection

nosole safely detects production environments using:

- `process.env.NODE_ENV`
- `Deno.env.get("NODE_ENV")`
- `import.meta.env`

Supported runtimes:

- Node.js
- Bun
- Deno
- Browsers
- Vite
- Edge runtimes
- Cloudflare Workers

---

# License

MIT
