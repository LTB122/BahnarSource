import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import { Translation } from '../../../components';
import useDynamicPagination from '../../../hooks/useDynamicPagination';
import TranslateService from '../../../services/translate.service';
import { Translate } from '../../../types';
import { RootStackParamList } from '../../../types/navigation';

const PAGE_SIZE = 10;

export default function Favorite() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const onPress = useCallback(
    (item: Translate) => {
      navigation.navigate('Detail', {
        translationId: item?._id || null,
      });
    },
    [navigation]
  );

  const fetchMoreFavoriteList = async (
    limit: number,
    offset: number,
    previousData?: Translate[]
  ) => {
    try {
      const { data } = await TranslateService.findAll({
        limit,
        sortBy: 'createdAt',
        order: 'desc',
        offset,
        isFavorite: true,
      });

      const { payload } = data;
      return [...(previousData || []), ...payload];
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const {
    data: favoritedList,
    setData: setFavoriteList,
    isRefreshing: refreshing,
    refresh,
    nextPage,
  } = useDynamicPagination<Translate>({
    fetchData: fetchMoreFavoriteList,
    pageSize: PAGE_SIZE,
    initialPage: 1,
    onError: (error) => console.log(JSON.stringify(error)),
    onNoMoreData: () => console.log('No more data'),
  });

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const newSavedList: Translate[] = await fetchMoreFavoriteList(
          PAGE_SIZE,
          0
        );
        setFavoriteList(newSavedList);
      };

      init();
    }, [setFavoriteList])
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
      data={favoritedList}
      renderItem={({ item }) => (
        <Translation translate={item} onPress={() => onPress(item)} />
      )}
      keyExtractor={(item, index) => item._id || index.toString()}
      onEndReachedThreshold={0.5}
      onEndReached={nextPage}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
      scrollEnabled={true}
    />
  );
}
