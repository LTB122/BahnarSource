import _ from 'lodash';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

type UseDynamicPaginationProps<T> = {
  /* Init data that sepcialized in advanced */
  initialData?: T[];
  /* Function to fetch more data base on the limit and offset, return a promise.
   * By default the function will replaced the data with the returned data of this
   * function, use the previousData to merge the data for usecase like infinite scroll.
   * @param limit
   * @param offset
   * @param previousData
   */
  fetchData: (
    limit: number,
    offset: number,
    previousData?: T[]
  ) => Promise<T[]>;
  /* Initial page size for pagination, default to 10 */
  pageSize?: number;
  /* Initial page for pagination, default to 1 */
  initialPage?: number;
  /* Callback function when data is fetched */
  onFetched?: (data: T[]) => void;
  /* Callback function when error occurs */
  onError?: (error: Error) => void;
  /* Callback function when there is no more data to fetch */
  onNoMoreData?: () => void;
};

type UseDynamicPaginationReturn<T> = {
  /* Data */
  data?: T[];
  /* Set data: should be use for initialization */
  setData: Dispatch<SetStateAction<T[]>>;
  /* Is loading */
  isLoading: boolean;
  /* Is Refreshing */
  isRefreshing: boolean;
  /* Callback function to fetch more data */
  nextPage: () => void;
  /* Callback function to fetch previous data */
  previousPage: () => void;
  /* Callback function to fetch data at specific page */
  gotoPage: (page: number) => void;
  /* Callback function to refresh data */
  refresh: () => void;
  /* Current page number (starting from 1) */
  page: number;
  /* Is next page valid */
  hasNextPage: boolean;
};

/**
 * Pagination hook for dynamic, server-side pagination,
 * where the number of pages is not known in advance.
 */
export default function useDynamicPagination<T>({
  initialData = [],
  fetchData,
  pageSize = 10,
  initialPage = 1,
  onFetched,
  onError,
  onNoMoreData,
}: UseDynamicPaginationProps<T>): UseDynamicPaginationReturn<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(initialPage);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const _fetchData = useCallback(
    async (currPage: number, previousData?: T[]) => {
      setIsLoading(true);
      try {
        const result: T[] = await fetchData(
          pageSize,
          (currPage - 1) * pageSize,
          previousData
        );

        if (
          _.differenceWith(result, previousData || [], _.isEqual).length > 0 ||
          result.length !== previousData?.length
        ) {
          setData(result);
        } else {
          onNoMoreData?.();
          setHasNextPage(false);
        }

        onFetched?.(result);
        setIsLoading(false);
        return result;
      } catch (error: any) {
        setIsLoading(false);
        onError?.(error);
      }
    },
    [fetchData, onFetched, onError, onNoMoreData, pageSize]
  );

  const nextPage = useCallback(() => {
    if (hasNextPage && !isLoading && !isRefreshing) {
      _fetchData(page + 1, data);
      setPage(page + 1);
    }
  }, [_fetchData, page, data, hasNextPage, isLoading, isRefreshing]);

  const previousePage = useCallback(() => {
    if (page > 1 && !isLoading && !isRefreshing) {
      _fetchData(page - 1);
      setPage(page - 1);
    }
  }, [page, _fetchData, isLoading, isRefreshing]);

  const gotoPage = useCallback(
    (pageNumber: number) => {
      if (
        pageNumber > 0 &&
        pageNumber !== page &&
        !isLoading &&
        !isRefreshing
      ) {
        _fetchData(pageNumber, initialData);
        setPage(pageNumber);
      }
    },
    [page, initialData, _fetchData, isLoading, isRefreshing]
  );

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setPage(initialPage);
    setHasNextPage(true);
    _fetchData(initialPage, initialData).then(() => setIsRefreshing(false));
  }, [_fetchData, initialData, initialPage]);

  return {
    data,
    setData,
    isLoading,
    isRefreshing,
    nextPage,
    previousPage: previousePage,
    gotoPage,
    refresh,
    page,
    hasNextPage,
  } as UseDynamicPaginationReturn<T>;
}
