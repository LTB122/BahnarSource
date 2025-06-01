export const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT as string;
export const BahnarSpecialKeyEvents = {
  SPECIAL_KEY_PRESS: 'SPECIAL_KEY_PRESS',
};

// Sử dụng biến môi trường cho API URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3501';
export const BAHNAR_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3501';
export const VOICE_API_URL = process.env.REACT_APP_VOICE_API_URL || 'https://api.fpt.ai';
export const VOICE_API_KEY = process.env.REACT_APP_VOICE_API_KEY || 'dOhuC7M5My9tKMMJgkS5BuPfgeU3ghwW';

// export const BAHNAR_API_URL: string = 'https://api.bahnar.fessior.dev/';
// export const VOICE_API_URL: string = 'https://api.fpt.ai/';
// export const VOICE_API_KEY: string = 'dOhuC7M5My9tKMMJgkS5BuPfgeU3ghwW';
