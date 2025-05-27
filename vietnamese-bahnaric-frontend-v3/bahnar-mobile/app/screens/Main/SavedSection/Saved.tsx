import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { useCallback } from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';

import { Icon, Translation } from '../../../components';
import useDynamicPagination from '../../../hooks/useDynamicPagination';
import TranslateService from '../../../services/translate.service';
import { Translate } from '../../../types';
import { RootStackParamList } from '../../../types/navigation';

const PAGE_SIZE = 10;

export default function Saved() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const fetchMoreSavedList = async (
    limit: number,
    offset: number,
    previousData?: Translate[]
  ) => {
    try {
      const { data } = await TranslateService.findAll({
        limit,
        offset,
        sortBy: 'createdAt',
        order: 'desc',
      });

      const { payload } = data;
      return [...(previousData || []), ...payload];
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const {
    data: savedList,
    setData: setSavedList,
    isRefreshing: refreshing,
    refresh,
    nextPage,
  } = useDynamicPagination<Translate>({
    fetchData: fetchMoreSavedList,
    pageSize: PAGE_SIZE,
    initialPage: 1,
    onError: (error) => console.log(JSON.stringify(error)),
    onNoMoreData: () => console.log('No more data'),
  });

  const onIconPress = (translation: Translate) => {
    TranslateService.markFavorite(
      translation._id || '',
      !translation.isFavorite
    ).catch((error) => console.log(JSON.stringify(error.response.data)));

    const newSavedList: Translate[] =
      savedList?.map((item) => {
        if (item._id === translation._id) {
          return {
            ...item,
            isFavorite: !item.isFavorite,
          };
        }
        return item;
      }) || [];
    setSavedList(newSavedList);
  };

  const onPress = useCallback(
    (item: Translate) => {
      navigation.navigate('Detail', {
        translationId: item?._id || null,
      });
    },
    [navigation]
  );

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const newSavedList: Translate[] = await fetchMoreSavedList(
          PAGE_SIZE,
          0
        );
        setSavedList(newSavedList);
      };

      init();
    }, [setSavedList])
  );

  /**
   * We use FlatList instead here because of the onEndReached capability,
   * which prompt an error about Nested Scroll View (From the TabView component)
   * when using Flatlist. We choose to IGNORE the error since it doesn't affect
   * the app's functionality.
   */
  return (
    <FlatList
      style={{ flex: 1 }}
      data={savedList}
      renderItem={({ item }) => (
        <Translation
          translate={item}
          onPress={() => onPress(item)}
          renderIcon={(translateItem) => (
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 4,
                right: 0,
              }}
              onPress={() => onIconPress(translateItem)}
            >
              <Icon.Star
                width={24}
                height={24}
                fill={translateItem.isFavorite ? '#FFC107' : '#BDBCCC'}
              />
            </TouchableOpacity>
          )}
        />
      )}
      keyExtractor={(item, index) => item._id || index.toString()}
      onEndReachedThreshold={0.5}
      onEndReached={nextPage}
      refreshControl={
        <RefreshControl
          enabled={true}
          refreshing={refreshing}
          onRefresh={refresh}
        />
      }
      refreshing={refreshing}
      scrollEnabled={true}
    />
  );
}
