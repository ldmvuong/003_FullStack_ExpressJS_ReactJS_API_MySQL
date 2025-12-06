import { gql } from '@apollo/client';

export const GET_MY_CART = gql`
  query MyCart {
    myCart {
      id
      items {
        id
        quantity
        isSelected
        total
        Product {
          id
          name
          price
          image
        }
      }
      grandTotal
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity)
  }
`;

export const UPDATE_ITEM_QUANTITY = gql`
  mutation UpdateItemQuantity($itemId: ID!, $quantity: Int!) {
    updateItemQuantity(itemId: $itemId, quantity: $quantity)
  }
`;

export const REMOVE_ITEM = gql`
  mutation RemoveItem($itemId: ID!) {
    removeItem(itemId: $itemId)
  }
`;

export const SELECT_ITEM = gql`
  mutation SelectItem($itemId: ID!, $isSelected: Boolean!) {
    selectItem(itemId: $itemId, isSelected: $isSelected)
  }
`;

export const SELECT_MULTIPLE_ITEMS = gql`
  mutation SelectMultipleItems($itemIds: [ID!]!, $isSelected: Boolean!) {
    selectMultipleItems(itemIds: $itemIds, isSelected: $isSelected)
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart
  }
`;
