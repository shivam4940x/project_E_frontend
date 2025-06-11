const secret = import.meta.env.VITE_PUBLIC_ENCRYPTION_SECRET;

async function deriveKey(convoId: string): Promise<CryptoKey> {
  const combined = convoId + secret;
  const enc = new TextEncoder().encode(combined);
  const hash = await crypto.subtle.digest("SHA-256", enc); // derive 256-bit key

  return crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encryptWithConvoKey(message: string, convoId: string) {
  const key = await deriveKey(convoId);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedMsg = new TextEncoder().encode(message);

  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedMsg
  );

  return {
    encrypted: btoa(String.fromCharCode(...new Uint8Array(cipher))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}
export async function decryptWithConvoKey(
  encrypted: string,
  iv: string,
  convoId: string
) {

  const key = await deriveKey(convoId);

  const encryptedBuffer = Uint8Array.from(atob(encrypted), (c) =>
    c.charCodeAt(0)
  );
  const ivBuffer = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBuffer },
    key,
    encryptedBuffer
  );

  return new TextDecoder().decode(decrypted);
}
