import * as Crypto from "expo-crypto";

export const genRandomToken = async () => {
  //an array of random bytes with the same length as the byteCount(16 below).
  const randomToken = await Crypto.getRandomBytesAsync(8);
  //digest/hash token//returns a string as a hex string
  const hashedToken = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    randomToken.toString()
  );

  return hashedToken;
};
