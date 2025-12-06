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
  
  // Skip query if user is not authenticated
  const { data, loading, error, refetch } = useQuery(GET_MY_CART, {
    skip: !auth?.isAuthenticated,
  });
  
  const [addToCart] = useMutation(ADD_TO_CART, {
    onCompleted: () => refetch(),
  });
  
  const [updateItemQuantity] = useMutation(UPDATE_ITEM_QUANTITY, {
    onCompleted: () => refetch(),
  });
  
  const [removeItem] = useMutation(REMOVE_ITEM, {
    onCompleted: () => refetch(),
  });
  
  const [selectItem] = useMutation(SELECT_ITEM, {
    onCompleted: () => refetch(),
  });
  
  const [selectMultipleItems] = useMutation(SELECT_MULTIPLE_ITEMS, {
    onCompleted: () => refetch(),
  });
  
  const [clearCart] = useMutation(CLEAR_CART, {
    onCompleted: () => refetch(),
  });

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
