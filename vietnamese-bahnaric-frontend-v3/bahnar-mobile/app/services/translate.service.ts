import axios from 'axios';

import { BAHNAR_API_URL } from '../config';
import { ResponseData, Translate } from '../types';
import { client } from '../utils/custom-axios';

const TranslateService = {
  translate: async (text: string) =>
    await axios.post<Translate>(`${BAHNAR_API_URL}translate/vi_ba`, {
      text,
    }),

  findAll: async (option: {
    limit: number;
    sortBy?: keyof Translate;
    order?: 'asc' | 'desc';
    offset: number;
    isFavorite?: boolean;
  }) =>
    await client.get<ResponseData<Translate[]>>(
      `translations?limit=${option.limit}&offset=${option.offset}&${
        option.isFavorite !== undefined && 'isFavorite=' + option.isFavorite
      }&${option.sortBy ? 'sortBy=' + option.sortBy : ''}&${
        option.order ? 'order=' + option.order : ''
      }`,
      {}
    ),

  findById: async (id: string) =>
    await client.get<ResponseData<Translate>>(`translations/${id}`),

  save: async (src: string, tgt: string) => {
    return await client.post<ResponseData<Translate>>('translations', {
      src,
      tgt,
    });
  },

  markFavorite: async (id: string, isFavorite: boolean) =>
    await client.patch<ResponseData<Translate>>(`translations/${id}/favorite`, {
      isFavorite,
    }),

  markAsDeleted: async (id: string) =>
    await client.delete<ResponseData<Translate>>(`translations/${id}`),
};

export default TranslateService;
