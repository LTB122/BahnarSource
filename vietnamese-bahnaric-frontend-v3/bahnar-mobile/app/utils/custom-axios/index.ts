import { AxiosInstance } from 'axios';

import { API_URL } from '../../config';
import { usePersistStore } from '../../store';

import { createClient } from './createClient';

/**
 * Get current access token from zustand persist store
 * (which is the encrypted store in this case)
 * @returns {string} token
 */
function getCurrentAccessToken(): string {
  return usePersistStore.getState().token;
}

export function removeAccessToken() {
  usePersistStore.setState({ token: '' });
}

export const client: AxiosInstance = createClient({
  options: {
    baseURL: API_URL,
    timeout: 300000,
    headers: {
      'Content-Type': 'application/json',
    },
  },
  removeAccessToken,
  getCurrentAccessToken,
});
