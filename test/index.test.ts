import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { log, warn, error, info, debug, createLogger } from "../src/index";

describe("nosole", () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "debug").mockImplementation(() => {});
    originalEnv = (globalThis as any).process?.env?.NODE_ENV;
  });

  afterEach(() => {
    if ((globalThis as any).process?.env) {
      (globalThis as any).process.env.NODE_ENV = originalEnv;
    }
    vi.restoreAllMocks();
  });

  it("exports default logger methods", () => {
    expect(typeof log).toBe("function");
    expect(typeof warn).toBe("function");
    expect(typeof error).toBe("function");
    expect(typeof info).toBe("function");
    expect(typeof debug).toBe("function");
  });

  it("calls native console methods when enabled", () => {
    (globalThis as any).process.env.NODE_ENV = "development";

    // We create a new logger to pick up the env change and the mocked console
    const logger = createLogger();
    logger.log("hello");
    expect(console.log).toHaveBeenCalledWith("hello");
  });

  it("ignores calls when in production by default", () => {
    (globalThis as any).process.env.NODE_ENV = "production";
    const logger = createLogger();

    logger.log("hello");
    expect(console.log).not.toHaveBeenCalled();
  });

  it("allows manual enable/disable overriding environment", () => {
    (globalThis as any).process.env.NODE_ENV = "development";

    const loggerEnabled = createLogger({ enabled: true });
    loggerEnabled.log("hello");
    expect(console.log).toHaveBeenCalledWith("hello");

    const loggerDisabled = createLogger({ enabled: false });
    loggerDisabled.log("world");
    expect(console.log).toHaveBeenCalledTimes(1); // from previous call
  });

  it("prefixes logs correctly", () => {
    const authLogger = createLogger({ enabled: true, prefix: "auth" });

    authLogger.log("login success");
    expect(console.log).toHaveBeenCalledWith("[auth]", "login success");

    authLogger.error("login failed", 500);
    expect(console.error).toHaveBeenCalledWith("[auth]", "login failed", 500);
  });
});
