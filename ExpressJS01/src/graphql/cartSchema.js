const { Cart, CartItem, Product } = require('../models/index.js');

const typeDefs = `#graphql
  type Product {
    id: ID
    name: String
    price: Float
    image: String
  }

  type CartItem {
    id: ID
    quantity: Int
    isSelected: Boolean
    Product: Product
    total: Float
  }

  type Cart {
    id: ID
    items: [CartItem]
    grandTotal: Float
  }

  type Query {
    myCart: Cart
  }

  type Mutation {
    addToCart(productId: ID!, quantity: Int!): String
    updateItemQuantity(itemId: ID!, quantity: Int!): String
    removeItem(itemId: ID!): String
    selectItem(itemId: ID!, isSelected: Boolean!): String
    selectMultipleItems(itemIds: [ID!]!, isSelected: Boolean!): String
    clearCart: String
  }
`;

const resolvers = {
  CartItem: {
    total: (parent) => {
        return parent.quantity * (parent.Product ? parent.Product.price : 0);
    }
  },
  Query: {
    myCart: async (_, __, context) => {
      if (!context.user) throw new Error("Unauthorized");
      let [cart] = await Cart.findOrCreate({ where: { UserId: context.user.id } });
      
      const items = await CartItem.findAll({
          where: { CartId: cart.id },
          include: [{ model: Product }]
      });

      const grandTotal = items.reduce((sum, item) => {
          return sum + (item.quantity * (item.Product ? item.Product.price : 0));
      }, 0);

      return { id: cart.id, items: items, grandTotal: grandTotal };
    }
  },
  Mutation: {
    addToCart: async (_, { productId, quantity }, context) => {
      if (!context.user) throw new Error("Unauthorized");
      const [cart] = await Cart.findOrCreate({ where: { UserId: context.user.id } });
      const item = await CartItem.findOne({ where: { CartId: cart.id, ProductId: productId } });

      if (item) {
          item.quantity += quantity;
          await item.save();
      } else {
          await CartItem.create({ CartId: cart.id, ProductId: productId, quantity });
      }
      return "Success";
    },
    updateItemQuantity: async (_, { itemId, quantity }, context) => {
      if (!context.user) throw new Error("Unauthorized");
      if (quantity <= 0) await CartItem.destroy({ where: { id: itemId } });
      else await CartItem.update({ quantity }, { where: { id: itemId } });
      return "Updated";
    },
    removeItem: async (_, { itemId }, context) => {
      if (!context.user) throw new Error("Unauthorized");
      await CartItem.destroy({ where: { id: itemId } });
      return "Removed";
    },
    selectItem: async (_, { itemId, isSelected }, context) => {
      if (!context.user) throw new Error("Unauthorized");
      await CartItem.update({ isSelected }, { where: { id: itemId } });
      return "Selected";
    },
    selectMultipleItems: async (_, { itemIds, isSelected }, context) => {
      if (!context.user) throw new Error("Unauthorized");
      await CartItem.update({ isSelected }, { where: { id: itemIds } });
      return "Selected";
    },
    clearCart: async (_, __, context) => {
      if (!context.user) throw new Error("Unauthorized");
      const [cart] = await Cart.findOrCreate({ where: { UserId: context.user.id } });
      await CartItem.destroy({ where: { CartId: cart.id } });
      return "Cleared";
    }
  }
};

module.exports = { typeDefs, resolvers };