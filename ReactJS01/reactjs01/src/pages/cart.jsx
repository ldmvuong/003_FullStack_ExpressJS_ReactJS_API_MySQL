import React, { useState } from 'react';
import styled from 'styled-components';
import {
  CartItemCard,
  CartSummary,
  Modal,
  Badge,
  Button,
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from '@ldmvuong/cart-lib';
import { useCart } from '../hooks/useCart';

// ============ Styled Components ============

const PageContainer = styled.div`
  padding: ${SPACING.xl};
  max-width: 1400px;
  margin: 0 auto;
  background-color: ${COLORS.bgLight};
  min-height: 100vh;
  font-family: ${TYPOGRAPHY.fontFamily};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${SPACING.xxl};
  background-color: ${COLORS.bgWhite};
  padding: ${SPACING.xl};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h1 {
    margin: 0;
    font-size: ${TYPOGRAPHY.fontSize.xxl};
    color: ${COLORS.textPrimary};
  }

  .header-actions {
    display: flex;
    gap: ${SPACING.md};
  }
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: ${SPACING.xl};

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const CartItemsContainer = styled.div`
  background-color: ${COLORS.bgWhite};
  border-radius: 8px;
  padding: ${SPACING.xl};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${SPACING.xxxl};
  color: ${COLORS.textLight};

  .empty-icon {
    font-size: 64px;
    margin-bottom: ${SPACING.lg};
  }

  .empty-text {
    font-size: ${TYPOGRAPHY.fontSize.lg};
    margin-bottom: ${SPACING.lg};
  }

  .empty-link {
    color: ${COLORS.primary};
    text-decoration: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${SPACING.xxxl};
  color: ${COLORS.textSecondary};
  font-size: ${TYPOGRAPHY.fontSize.lg};
`;

const ErrorContainer = styled.div`
  background-color: ${COLORS.danger}20;
  border: 1px solid ${COLORS.danger};
  border-radius: 8px;
  padding: ${SPACING.xl};
  color: ${COLORS.danger};
  margin-bottom: ${SPACING.xl};
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
`;

// ============ Main Component ============

const CartPage = () => {
  const {
    cart,
    loading,
    error,
    updateItemQuantity,
    removeItem,
    selectItem,
    clearCart,
  } = useCart();

  const [isConfirmClear, setIsConfirmClear] = useState(false);
  const [apiError, setApiError] = useState(null);

  // ============ Data Processing ============

  const items = cart?.items || [];
  const selectedItems = items.filter((item) => item.isSelected);
  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + item.Product.price * item.quantity,
    0
  );

  
  const handleSelectItem = async (itemId, isSelected) => {
    try {
      setApiError(null);
      await selectItem({
        variables: { itemId, isSelected },
      });
    } catch (err) {
      setApiError('Lỗi khi chọn sản phẩm: ' + err.message);
      console.error('Error selecting item:', err);
    }
  };

  const handleIncrease = async (itemId, currentQty) => {
    try {
      setApiError(null);
      await updateItemQuantity({
        variables: { itemId, quantity: currentQty + 1 },
      });
    } catch (err) {
      setApiError('Lỗi khi cập nhật số lượng: ' + err.message);
      console.error('Error increasing quantity:', err);
    }
  };

  const handleDecrease = async (itemId, currentQty) => {
    if (currentQty <= 1) return;
    try {
      setApiError(null);
      await updateItemQuantity({
        variables: { itemId, quantity: currentQty - 1 },
      });
    } catch (err) {
      setApiError('Lỗi khi cập nhật số lượng: ' + err.message);
      console.error('Error decreasing quantity:', err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      setApiError(null);
      await removeItem({
        variables: { itemId },
      });
    } catch (err) {
      setApiError('Lỗi khi xóa sản phẩm: ' + err.message);
      console.error('Error removing item:', err);
    }
  };

  const handleClearCart = async () => {
    try {
      setApiError(null);
      await clearCart();
        /* ✅ Apollo auto-sync cache → UI cập nhật tức thì */
      setIsConfirmClear(false);
    } catch (err) {
      setApiError('Lỗi khi xóa giỏ hàng: ' + err.message);
      console.error('Error clearing cart:', err);
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      setApiError('Vui lòng chọn ít nhất 1 sản phẩm để tiếp tục');
      return;
    }
    console.log('Proceeding to checkout with:', {
      items: selectedItems,
      total: selectedTotal,
    });
    // TODO: Chuyển hướng đến trang checkout
    // window.location.href = '/checkout';
  };

  // ============ Render ============

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>⏳ Đang tải giỏ hàng...</LoadingContainer>
      </PageContainer>
    );
  }

  if (error && !apiError) {
    return (
      <PageContainer>
        <ErrorContainer>❌ Lỗi: {error.message}</ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <Header>
        <div>
          <h1>🛒 Giỏ hàng</h1>
          {items.length > 0 && (
            <Badge variant="primary" size="small">
              {items.length} sản phẩm
            </Badge>
          )}
        </div>
        <div className="header-actions">
          {items.length > 0 && (
            <Button
              variant="outline"
              color={COLORS.danger}
              onClick={() => setIsConfirmClear(true)}
            >
              🗑️ Xóa tất cả
            </Button>
          )}
          <Button onClick={() => (window.location.href = '/product')}>
            ← Tiếp tục mua
          </Button>
        </div>
      </Header>

      {/* Error Message */}
      {apiError && <ErrorContainer>{apiError}</ErrorContainer>}

      {/* Empty State */}
      {items.length === 0 ? (
        <CartItemsContainer>
          <EmptyState>
            <div className="empty-icon">📦</div>
            <div className="empty-text">Giỏ hàng của bạn trống</div>
            <a
              className="empty-link"
              onClick={() => (window.location.href = '/product')}
            >
              Quay lại mua hàng
            </a>
          </EmptyState>
        </CartItemsContainer>
      ) : (
        <ContentLayout>
          {/* Cart Items */}
          <CartItemsContainer>
            {items.map((item) => (
              <CartItemCard
                key={item.id}
                id={item.id}
                name={item.Product.name}
                price={item.Product.price}
                image={item.Product.image}
                quantity={item.quantity}
                isSelected={item.isSelected}
                onSelect={handleSelectItem}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onDelete={handleDeleteItem}
              />
            ))}
          </CartItemsContainer>

          {/* Cart Summary */}
          <CartSummary
            total={selectedTotal}
            count={selectedItems.length}
            totalItems={items.length}
            onCheckout={handleCheckout}
            onContinueShopping={() => (window.location.href = '/product')}
            shipping={0}
            discount={0}
          />
        </ContentLayout>
      )}

      {/* Confirm Clear Modal */}
      <Modal
        isOpen={isConfirmClear}
        onClose={() => setIsConfirmClear(false)}
        title="Xóa toàn bộ giỏ hàng?"
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor={COLORS.danger}
        onConfirm={handleClearCart}
      >
        <p>
          Bạn chắc chắn muốn xóa toàn bộ {items.length} sản phẩm trong giỏ
          hàng?
        </p>
      </Modal>
    </PageContainer>
  );
};

export default CartPage;
