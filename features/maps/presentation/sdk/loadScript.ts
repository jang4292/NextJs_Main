const scriptCache = new Map<string, Promise<void>>();

export async function loadScript(url: string): Promise<void> {
  if (typeof document === "undefined") {
    return;
  }

  const existing = Array.from(document.querySelectorAll("script")).find(
    (element) => element.getAttribute("src") === url,
  );

  if (existing) {
    if (existing.dataset.loaded === "true") {
      return;
    }
    await new Promise<void>((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("SCRIPT_LOAD_FAILED")),
        {
          once: true,
        },
      );
    });
    return;
  }

  const cached = scriptCache.get(url);
  if (cached) {
    return cached;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    });
    script.addEventListener("error", () => {
      scriptCache.delete(url);
      reject(new Error("SCRIPT_LOAD_FAILED"));
    });
    document.head.appendChild(script);
  });

  scriptCache.set(url, promise);

  try {
    await promise;
  } catch (error) {
    scriptCache.delete(url);
    throw error;
  }
}
