import type { RandomSource } from "../application/randomSource";

export const browserRandomSource: RandomSource = {
  pickStopIndex(stripLength: number) {
    if (stripLength <= 0) {
      throw new Error("Cannot pick a stop index from an empty reel strip.");
    }

    const cryptoApi = globalThis.crypto;

    if (!cryptoApi?.getRandomValues) {
      throw new Error("Web Crypto API is required to spin the slot machine.");
    }

    const values = new Uint32Array(1);
    cryptoApi.getRandomValues(values);

    return values[0] % stripLength;
  },
};
