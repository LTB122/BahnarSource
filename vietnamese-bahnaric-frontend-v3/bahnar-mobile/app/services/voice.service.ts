import axios from 'axios';

import { BAHNAR_API_URL, VOICE_API_KEY, VOICE_API_URL } from '../config';

type VNVoiceResult = {
  error: number;
  async: string;
  request_id: string;
  message: string;
};

type BahnarResults = string; // stringified JSON with the following structure
// {
//   "urls": ["audio"],
// }

const VoiceService = {
  getVNVoice: async (text: string) => {
    return await axios.post<VNVoiceResult>(`${VOICE_API_URL}hmi/tts/v5`, text, {
      headers: {
        api_key: VOICE_API_KEY,
      },
    });
  },

  getBahnarVoice: async (text: string, gender: string, region: string) => {
    return await axios.post<BahnarResults>(`${BAHNAR_API_URL}speak/vi_ba_v2`, {
      text,
      gender,
      region,
    });
  },
};

export default VoiceService;
