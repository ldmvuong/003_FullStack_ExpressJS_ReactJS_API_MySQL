import { gql } from '@apollo/client';

/* Fragment giúp tái sử dụng code, đỡ phải viết đi viết lại đống fields */
const CART_FRAGMENT = gql`
  fragment CartFields on Cart {
    id
    grandTotal
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
  }
`;

export const GET_MY_CART = gql`
  query MyCart {
    myCart {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

export const UPDATE_ITEM_QUANTITY = gql`
  mutation UpdateItemQuantity($itemId: ID!, $quantity: Int!) {
    updateItemQuantity(itemId: $itemId, quantity: $quantity) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

export const REMOVE_ITEM = gql`
  mutation RemoveItem($itemId: ID!) {
    removeItem(itemId: $itemId) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

export const SELECT_ITEM = gql`
  mutation SelectItem($itemId: ID!, $isSelected: Boolean!) {
    selectItem(itemId: $itemId, isSelected: $isSelected) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

export const SELECT_MULTIPLE_ITEMS = gql`
  mutation SelectMultipleItems($itemIds: [ID!]!, $isSelected: Boolean!) {
    selectMultipleItems(itemIds: $itemIds, isSelected: $isSelected) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;