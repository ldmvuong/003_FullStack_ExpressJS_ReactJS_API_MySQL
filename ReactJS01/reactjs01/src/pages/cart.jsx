import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';

const styles = {
  cartContainer: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  cartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  cartHeaderH1: {
    margin: '0',
    fontSize: '28px',
    color: '#333',
    fontWeight: '600',
  },
  cartClearBtn: {
    padding: '10px 20px',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  cartEmpty: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  cartEmptyP: {
    fontSize: '18px',
    color: '#999',
    margin: '0',
  },
  cartLoading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#666',
  },
  cartError: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#ff4444',
    backgroundColor: '#ffe6e6',
    borderRadius: '8px',
  },
  cartContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '20px',
    '@media (max-width: 1200px)': {
      gridTemplateColumns: '1fr',
    },
  },
  cartList: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  cartListHeader: {
    display: 'grid',
    gridTemplateColumns: '50px 1fr 100px 150px 120px 80px',
    gap: '15px',
    padding: '15px 20px',
    backgroundColor: '#f9f9f9',
    borderBottom: '2px solid #e0e0e0',
    fontWeight: '600',
    color: '#333',
    fontSize: '14px',
    alignItems: 'center',
  },
  cartCheckboxCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cartCheckboxInput: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#ff6b6b',
  },
  cartItem: {
    display: 'grid',
    gridTemplateColumns: '50px 1fr 100px 150px 120px 80px',
    gap: '15px',
    padding: '15px 20px',
    borderBottom: '1px solid #e0e0e0',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  },
  cartItemSelected: {
    backgroundColor: '#fffbea',
  },
  cartCheckbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#ff6b6b',
  },
  cartProductImage: {
    width: '60px',
    height: '60px',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    flexShrink: '0',
  },
  cartProductImageImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cartProductInfo: {
    flex: '1',
    minWidth: '0',
  },
  cartProductInfoH4: {
    margin: '0',
    fontSize: '14px',
    color: '#333',
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  cartPrice: {
    fontSize: '14px',
    color: '#ff6b6b',
    fontWeight: '600',
  },
  cartQuantityControl: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ddd',
    borderRadius: '4px',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  cartBtn: {
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: '#f5f5f5',
    color: '#333',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    flexShrink: '0',
  },
  cartQuantityInput: {
    width: '50px',
    height: '32px',
    border: 'none',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '500',
  },
  cartTotal: {
    fontSize: '14px',
    color: '#333',
    fontWeight: '600',
  },
  cartRemoveBtn: {
    padding: '6px 12px',
    backgroundColor: '#fff',
    border: '1px solid #ff6b6b',
    color: '#ff6b6b',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  cartSummary: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    position: 'sticky',
    top: '20px',
    height: 'fit-content',
  },
  cartSummaryHeader: {
    padding: '15px 20px',
    backgroundColor: '#f9f9f9',
    borderBottom: '2px solid #e0e0e0',
  },
  cartSummaryHeaderH3: {
    margin: '0',
    fontSize: '16px',
    color: '#333',
    fontWeight: '600',
  },
  cartSummaryContent: {
    padding: '20px',
  },
  cartSummaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    fontSize: '14px',
  },
  cartSummaryRowHighlighted: {
    marginBottom: '0',
    paddingTop: '15px',
    borderTop: '2px solid #e0e0e0',
  },
  cartLabel: {
    color: '#666',
    fontWeight: '500',
  },
  cartValue: {
    color: '#333',
    fontWeight: '600',
  },
  cartSelectedTotal: {
    fontSize: '18px',
    color: '#ff6b6b',
  },
  cartDivider: {
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '15px 0',
  },
  cartSummaryActions: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    borderTop: '1px solid #e0e0e0',
  },
  cartCheckoutBtn: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  cartContinueShoppingBtn: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'transparent',
    color: '#ff6b6b',
    border: '2px solid #ff6b6b',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  cartSummaryFooter: {
    padding: '15px 20px',
    backgroundColor: '#fffbea',
    borderTop: '1px solid #e0e0e0',
  },
  cartSummaryFooterP: {
    margin: '0',
    fontSize: '12px',
    color: '#999',
    lineHeight: '1.5',
  },
};

const CartPage = () => {
  const {
    cart,
    loading,
    error,
    updateItemQuantity,
    removeItem,
    selectItem,
    selectMultipleItems,
    clearCart,
  } = useCart();

  if (loading) {
    return <div style={styles.cartLoading}>Đang tải giỏ hàng...</div>;
  }

  // Nếu có error, hiển thị giỏ trống thay vì error message
  const items = (error ? [] : cart?.items) || [];
  const selectedItems = items.filter((item) => item.isSelected);
  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.total, 0);

  const handleSelectAll = (isSelected) => {
    if (items.length === 0) return;
    const itemIds = items.map((item) => item.id);
    selectMultipleItems({
      variables: {
        itemIds,
        isSelected,
      },
    });
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      handleRemoveItem(itemId);
    } else {
      updateItemQuantity({
        variables: {
          itemId,
          quantity: newQuantity,
        },
      });
    }
  };

  const handleRemoveItem = (itemId) => {
    removeItem({
      variables: {
        itemId,
      },
    });
  };

  const handleSelectItem = (itemId, isSelected) => {
    selectItem({
      variables: {
        itemId,
        isSelected,
      },
    });
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
      clearCart();
    }
  };

  const handleQuantityChange = (itemId, delta) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0) {
        handleUpdateQuantity(itemId, newQuantity);
      }
    }
  };

  const handleDirectInput = (itemId, value) => {
    const newQuantity = parseInt(value) || 0;
    if (newQuantity > 0) {
      handleUpdateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div style={styles.cartContainer}>
      <div style={styles.cartHeader}>
        <h1 style={styles.cartHeaderH1}>Giỏ Hàng của Tôi</h1>
        {items.length > 0 && (
          <button 
            style={styles.cartClearBtn}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e63333';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(255, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ff4444';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
            onClick={handleClearCart}
          >
            Xóa Tất Cả
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div style={styles.cartEmpty}>
          <p style={styles.cartEmptyP}>Giỏ hàng của bạn hiện đang trống</p>
        </div>
      ) : (
        <div style={styles.cartContent}>
          <div style={styles.cartList}>
            <div style={styles.cartListHeader}>
              <div style={styles.cartCheckboxCell}>
                <input
                  type="checkbox"
                  checked={items.length > 0 && items.every((item) => item.isSelected)}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  style={styles.cartCheckboxInput}
                />
                <span>Chọn Tất Cả</span>
              </div>
              <div>Sản Phẩm</div>
              <div style={{ textAlign: 'center' }}>Giá</div>
              <div style={{ textAlign: 'center' }}>Số Lượng</div>
              <div style={{ textAlign: 'right' }}>Thành Tiền</div>
              <div style={{ textAlign: 'center' }}>Thao Tác</div>
            </div>

            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onSelectChange={(isSelected) =>
                  handleSelectItem(item.id, isSelected)
                }
                onQuantityChange={(delta) =>
                  handleQuantityChange(item.id, delta)
                }
                onDirectInput={(value) =>
                  handleDirectInput(item.id, value)
                }
                onRemove={() => handleRemoveItem(item.id)}
              />
            ))}
          </div>

          <CartSummary
            grandTotal={cart?.grandTotal || 0}
            selectedTotal={selectedTotal}
            selectedCount={selectedItems.length}
          />
        </div>
      )}
    </div>
  );
};

const CartItem = ({ item, onSelectChange, onQuantityChange, onDirectInput, onRemove }) => {
  const product = item.Product || {};

  return (
    <div 
      style={{
        ...styles.cartItem,
        ...(item.isSelected && styles.cartItemSelected),
        backgroundColor: item.isSelected ? '#fffbea' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!item.isSelected) e.currentTarget.style.backgroundColor = '#f9f9f9';
      }}
      onMouseLeave={(e) => {
        if (!item.isSelected) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div style={styles.cartCheckboxCell}>
        <input
          type="checkbox"
          checked={item.isSelected}
          onChange={(e) => onSelectChange(e.target.checked)}
          style={styles.cartCheckbox}
        />
      </div>

      <div style={styles.cartCheckboxCell}>
        <div style={styles.cartProductImage}>
          <img src={product.image} alt={product.name} style={styles.cartProductImageImg} />
        </div>
        <div style={styles.cartProductInfo}>
          <h4 style={styles.cartProductInfoH4}>{product.name}</h4>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <span style={styles.cartPrice}>
          {product.price?.toLocaleString('vi-VN')} ₫
        </span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={styles.cartQuantityControl}>
          <button
            style={styles.cartBtn}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ff6b6b';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f5f5f5';
              e.target.style.color = '#333';
            }}
            onClick={() => onQuantityChange(-1)}
          >
            −
          </button>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => onDirectInput(e.target.value)}
            style={styles.cartQuantityInput}
            min="1"
            onFocus={(e) => {
              e.target.style.backgroundColor = '#fff3f3';
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          />
          <button
            style={styles.cartBtn}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ff6b6b';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f5f5f5';
              e.target.style.color = '#333';
            }}
            onClick={() => onQuantityChange(1)}
          >
            +
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <span style={styles.cartTotal}>
          {item.total?.toLocaleString('vi-VN')} ₫
        </span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          style={styles.cartRemoveBtn}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#ff6b6b';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#fff';
            e.target.style.color = '#ff6b6b';
          }}
          onClick={onRemove}
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

const CartSummary = ({ grandTotal, selectedTotal, selectedCount }) => {
  return (
    <div style={styles.cartSummary}>
      <div style={styles.cartSummaryHeader}>
        <h3 style={styles.cartSummaryHeaderH3}>Tóm Tắt Đơn Hàng</h3>
      </div>

      <div style={styles.cartSummaryContent}>
        <div style={styles.cartSummaryRow}>
          <span style={styles.cartLabel}>Số sản phẩm đã chọn:</span>
          <span style={styles.cartValue}>{selectedCount}</span>
        </div>

        <div style={styles.cartSummaryRow}>
          <span style={styles.cartLabel}>Tổng giá trị giỏ hàng:</span>
          <span style={styles.cartValue}>
            {grandTotal?.toLocaleString('vi-VN')} ₫
          </span>
        </div>

        <div style={styles.cartDivider}></div>

        <div style={{ ...styles.cartSummaryRow, ...styles.cartSummaryRowHighlighted }}>
          <span style={styles.cartLabel}>Tổng cần thanh toán:</span>
          <span style={{ ...styles.cartValue, ...styles.cartSelectedTotal }}>
            {selectedTotal?.toLocaleString('vi-VN')} ₫
          </span>
        </div>
      </div>

      <div style={styles.cartSummaryActions}>
        <button 
          style={styles.cartCheckoutBtn}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#ff5252';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#ff6b6b';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Tiến Hành Thanh Toán
        </button>
        <button 
          style={styles.cartContinueShoppingBtn}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#fff3f3';
            e.target.style.borderColor = '#ff5252';
            e.target.style.color = '#ff5252';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.borderColor = '#ff6b6b';
            e.target.style.color = '#ff6b6b';
          }}
        >
          Tiếp Tục Mua Sắm
        </button>
      </div>

      <div style={styles.cartSummaryFooter}>
        <p style={styles.cartSummaryFooterP}>
          Bạn có thể sử dụng các phương thức thanh toán khác nhau trong
          quá trình thanh toán.
        </p>
      </div>
    </div>
  );
};

export default CartPage;
