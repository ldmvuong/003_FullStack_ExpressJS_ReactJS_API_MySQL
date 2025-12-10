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
    # --- SỬA ĐỔI: Trả về Cart thay vì String ---
    addToCart(productId: ID!, quantity: Int!): Cart
    updateItemQuantity(itemId: ID!, quantity: Int!): Cart
    removeItem(itemId: ID!): Cart
    selectItem(itemId: ID!, isSelected: Boolean!): Cart
    selectMultipleItems(itemIds: [ID!]!, isSelected: Boolean!): Cart
    clearCart: Cart
  }
`;

// Helper: Hàm dùng chung để lấy full giỏ hàng trả về
const getCartResponse = async (userId) => {
    // 1. Tìm giỏ hàng
    const [cart] = await Cart.findOrCreate({ where: { UserId: userId } });

    // 2. Lấy items kèm Product
    const items = await CartItem.findAll({
        where: { CartId: cart.id },
        include: [{ model: Product }],
        order: [['createdAt', 'ASC']] // Sắp xếp để item không bị nhảy lung tung khi update
    });

    // 3. Tính tổng tiền
    const grandTotal = items.reduce((sum, item) => {
        // Chỉ tính tiền những món ĐƯỢC CHỌN (isSelected = true)
        if (item.isSelected) {
             return sum + (item.quantity * (item.Product ? item.Product.price : 0));
        }
        return sum;
    }, 0);

    return { id: cart.id, items, grandTotal };
};

const resolvers = {
  CartItem: {
    total: (parent) => {
        return parent.quantity * (parent.Product ? parent.Product.price : 0);
    }
  },
  Query: {
    myCart: async (_, __, context) => {
      if (!context.user) throw new Error("Unauthorized");
      return await getCartResponse(context.user.id);
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

      // Trả về luôn giỏ hàng mới
      return await getCartResponse(context.user.id);
    },

    updateItemQuantity: async (_, { itemId, quantity }, context) => {
      if (!context.user) throw new Error("Unauthorized");
      
      if (quantity <= 0) await CartItem.destroy({ where: { id: itemId } });
      else await CartItem.update({ quantity }, { where: { id: itemId } });
      
      return await getCartResponse(context.user.id);
    },

    removeItem: async (_, { itemId }, context) => {
      if (!context.user) throw new Error("Unauthorized");
      await CartItem.destroy({ where: { id: itemId } });
      return await getCartResponse(context.user.id);
    },

    selectItem: async (_, { itemId, isSelected }, context) => {
      if (!context.user) throw new Error("Unauthorized");
      await CartItem.update({ isSelected }, { where: { id: itemId } });
      return await getCartResponse(context.user.id);
    },

    selectMultipleItems: async (_, { itemIds, isSelected }, context) => {
      if (!context.user) throw new Error("Unauthorized");
      await CartItem.update({ isSelected }, { where: { id: itemIds } });
      return await getCartResponse(context.user.id);
    },

    clearCart: async (_, __, context) => {
      if (!context.user) throw new Error("Unauthorized");
      const cart = await Cart.findOne({ where: { UserId: context.user.id } });
      if (cart) {
          await CartItem.destroy({ where: { CartId: cart.id } });
      }
      return await getCartResponse(context.user.id);
    }
  }
};

module.exports = { typeDefs, resolvers };