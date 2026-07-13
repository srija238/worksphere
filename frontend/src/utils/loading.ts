export const DEFAULT_MINIMUM_LOADING_DURATION_MS = 500;

export async function waitForMinimumLoadingDuration(
  startedAt: number,
  minimumDuration = DEFAULT_MINIMUM_LOADING_DURATION_MS,
) {
  const remainingTime = minimumDuration - (Date.now() - startedAt);
  if (remainingTime > 0) {
    await new Promise((resolve) => globalThis.setTimeout(resolve, remainingTime));
  }
}
