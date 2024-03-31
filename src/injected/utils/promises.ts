export const awaitUntil = (fn: () => boolean) =>
  new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (fn()) {
        clearInterval(interval);
        resolve();
      }
    }, 1);
  });
