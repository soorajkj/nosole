export interface LoggerOptions {
  prefix?: string;
  enabled?: boolean;
}

export interface Logger {
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

const noop = () => {};

function isDefaultEnabled(): boolean {
  try {
    // 1. Check standard Node/Bun/Edge global variables safely via globalThis
    const globalProcess = (globalThis as any).process;
    if (globalProcess?.env?.NODE_ENV === "production") {
      return false;
    }

    // 2. Check Deno if running in a Deno runtime
    const globalDeno = (globalThis as any).Deno;
    if (globalDeno?.env?.get?.("NODE_ENV") === "production") {
      return false;
    }

    // 3. Check modern bundler environment flags (Vite, Esbuild, Webpack 5+)
    // Trick the bundler's static analyzer to look for import.meta safely
    // By using an string-based lookup, CJS compilers won't flag it as invalid syntax.
    const metaRef = (globalThis as any)["import" + ".meta"];
    if (metaRef && metaRef.env) {
      if (metaRef.env.PROD || metaRef.env.MODE === "production") {
        return false;
      }
    }
  } catch {
    // Fail-safe: If anything errors out due to strict security policies, default to true
  }

  return true;
}

function createMethod(
  method: keyof Logger,
  enabled: boolean,
  prefix?: string,
): (...args: any[]) => void {
  if (!enabled) {
    return noop;
  }

  if (prefix) {
    return console[method].bind(console, `[${prefix}]`);
  }

  return console[method].bind(console);
}

export function createLogger(options: LoggerOptions = {}): Logger {
  const enabled = options.enabled ?? isDefaultEnabled();
  const prefix = options.prefix;

  return {
    log: createMethod("log", enabled, prefix),
    warn: createMethod("warn", enabled, prefix),
    error: createMethod("error", enabled, prefix),
    info: createMethod("info", enabled, prefix),
    debug: createMethod("debug", enabled, prefix),
  };
}

const defaultLogger = createLogger();

export const log = defaultLogger.log;
export const warn = defaultLogger.warn;
export const error = defaultLogger.error;
export const info = defaultLogger.info;
export const debug = defaultLogger.debug;
