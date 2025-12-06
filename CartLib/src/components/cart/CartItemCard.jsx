import React from 'react';
import styled from 'styled-components';
import { Button } from '../ui/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: ${SPACING.lg};
  border: 1px solid ${COLORS.border};
  border-radius: 8px;
  margin-bottom: ${SPACING.lg};
  background: ${COLORS.bgWhite};
  gap: ${SPACING.lg};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${COLORS.primary}40;
  }

  font-family: ${TYPOGRAPHY.fontFamily};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${COLORS.primary};
  flex-shrink: 0;
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
  background-color: ${COLORS.bgLight};
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
  
  h3 {
    margin: 0 0 ${SPACING.sm};
    font-size: ${TYPOGRAPHY.fontSize.base};
    font-weight: ${TYPOGRAPHY.fontWeight.semibold};
    color: ${COLORS.textPrimary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  p {
    margin: 0;
    color: ${COLORS.primary};
    font-weight: ${TYPOGRAPHY.fontWeight.bold};
    font-size: ${TYPOGRAPHY.fontSize.base};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.md};
  border: 1px solid ${COLORS.border};
  border-radius: 6px;
  background-color: ${COLORS.bgLight};
  padding: ${SPACING.xs};
`;

const QtyBtn = styled.button`
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  color: ${COLORS.textPrimary};
  cursor: pointer;
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-size: ${TYPOGRAPHY.fontSize.base};
  transition: all 0.2s ease;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: ${COLORS.bgWhite};
    color: ${COLORS.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QtyDisplay = styled.span`
  min-width: 30px;
  text-align: center;
  font-weight: ${TYPOGRAPHY.fontWeight.medium};
  color: ${COLORS.textPrimary};
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${COLORS.textLight};
  transition: all 0.2s ease;
  padding: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    color: ${COLORS.danger};
    background-color: ${COLORS.danger}10;
  }
`;

/**
 * CartItemCard Component - Thẻ sản phẩm trong giỏ hàng
 * @param {string} id - ID sản phẩm
 * @param {string} name - Tên sản phẩm
 * @param {number} price - Giá sản phẩm
 * @param {string} image - Ảnh sản phẩm
 * @param {number} quantity - Số lượng
 * @param {boolean} isSelected - Đã chọn hay chưa
 * @param {function} onSelect - Callback khi chọn/bỏ chọn
 * @param {function} onIncrease - Callback tăng số lượng
 * @param {function} onDecrease - Callback giảm số lượng
 * @param {function} onDelete - Callback xóa sản phẩm
 */
export const CartItemCard = ({ 
  id,
  name,
  price,
  image,
  quantity,
  isSelected,
  onSelect,
  onIncrease,
  onDecrease,
  onDelete,
}) => {
  const total = Number(price) * quantity;

  return (
    <CardWrapper>
      <Checkbox
        type="checkbox"
        checked={isSelected || false}
        onChange={(e) => onSelect?.(id, e.target.checked)}
      />

      <Image src={image} alt={name} />

      <Info>
        <h3>{name}</h3>
        <p>{Number(price).toLocaleString('vi-VN')} ₫</p>
      </Info>

      <Actions>
        <QtyBtn
          onClick={() => onDecrease?.(id, quantity)}
          disabled={quantity <= 1}
          title="Giảm số lượng"
        >
          −
        </QtyBtn>
        <QtyDisplay>{quantity}</QtyDisplay>
        <QtyBtn
          onClick={() => onIncrease?.(id, quantity)}
          title="Tăng số lượng"
        >
          +
        </QtyBtn>
      </Actions>

      <div style={{ minWidth: '100px', textAlign: 'right' }}>
        <div style={{
          fontSize: TYPOGRAPHY.fontSize.sm,
          color: COLORS.textLight,
          marginBottom: SPACING.xs,
        }}>
          Thành tiền
        </div>
        <div style={{
          fontSize: TYPOGRAPHY.fontSize.base,
          fontWeight: TYPOGRAPHY.fontWeight.bold,
          color: COLORS.primary,
        }}>
          {total.toLocaleString('vi-VN')} ₫
        </div>
      </div>

      <DeleteBtn
        onClick={() => onDelete?.(id)}
        title="Xóa sản phẩm"
      >
        🗑️
      </DeleteBtn>
    </CardWrapper>
  );
};
