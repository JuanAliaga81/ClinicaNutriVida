import { beforeEach, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Este almacenamiento pertenece a jsdom: no toca los datos de tu navegador.
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  localStorage.clear();
  sessionStorage.clear();
});
