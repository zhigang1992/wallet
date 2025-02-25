import { decrypt } from '@stacks/wallet-sdk';

import { logger } from '@shared/logger';

import { store } from '@app/store';
import { inMemoryKeyActions } from '@app/store/in-memory-key/in-memory-key.actions';
import { selectCurrentKey } from '@app/store/keys/key.selectors';

export async function initalizeWalletSession(encryptionKey: string) {
  return chrome.storage.session.set({ encryptionKey });
}

export async function clearWalletSession() {
  return chrome.storage.session.remove('encryptionKey');
}

export async function restoreWalletSession() {
  const key = await chrome.storage.session.get(['encryptionKey']);

  if (!key.encryptionKey) return;

  try {
    const currentKey = selectCurrentKey(store.getState());

    if (currentKey?.type === 'software') {
      const secretKey = await decrypt(currentKey.encryptedSecretKey, key.encryptionKey);
      store.dispatch(inMemoryKeyActions.setKeysInMemory({ default: secretKey }));
    }
  } catch (e) {
    logger.error('Failed to decrypt secret key');
  }
}
