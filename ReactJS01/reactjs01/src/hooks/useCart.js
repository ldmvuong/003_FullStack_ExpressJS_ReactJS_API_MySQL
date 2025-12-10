import { useQuery, useMutation } from '@apollo/client';
import { useContext } from 'react';
import { AuthContext } from '../components/context/auth.context';
import {
  GET_MY_CART,
  ADD_TO_CART,
  UPDATE_ITEM_QUANTITY,
  REMOVE_ITEM,
  SELECT_ITEM,
  SELECT_MULTIPLE_ITEMS,
  CLEAR_CART,
} from '../util/cartQueries';

export const useCart = () => {
  const { auth } = useContext(AuthContext);
  
  const { data, loading, error, refetch } = useQuery(GET_MY_CART, {
    skip: !auth?.isAuthenticated,
    fetchPolicy: 'cache-first' // Sử dụng cache trước, nếu không có mới gọi mạng
    // cache-and-network // Luôn gọi mạng để lấy dữ liệu mới nhất nhưng vẫn dùng cache để hiển thị nhanh
    // network-only // Luôn gọi mạng, không dùng cache
  });
  
  const [addToCart] = useMutation(ADD_TO_CART);
  const [updateItemQuantity] = useMutation(UPDATE_ITEM_QUANTITY);
  const [removeItem] = useMutation(REMOVE_ITEM);
  const [selectItem] = useMutation(SELECT_ITEM);
  const [selectMultipleItems] = useMutation(SELECT_MULTIPLE_ITEMS);
  const [clearCart] = useMutation(CLEAR_CART);

  return {
    cart: data?.myCart || { items: [], grandTotal: 0 },
    loading: auth?.isAuthenticated ? loading : false,
    error,
    addToCart,
    updateItemQuantity,
    removeItem,
    selectItem,
    selectMultipleItems,
    clearCart,
    refetch,
  };
};