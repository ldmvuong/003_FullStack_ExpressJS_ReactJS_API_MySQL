import React from 'react';
import styled from 'styled-components';
import { Button } from '../ui/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

const Wrapper = styled.div`
  padding: ${SPACING.xl};
  background: ${COLORS.bgGray};
  border-radius: 8px;
  border: 1px solid ${COLORS.border};
  font-family: ${TYPOGRAPHY.fontFamily};
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${SPACING.lg};
  font-size: ${props => props.bold ? TYPOGRAPHY.fontSize.lg : TYPOGRAPHY.fontSize.base};
  font-weight: ${props => props.bold ? TYPOGRAPHY.fontWeight.semibold : TYPOGRAPHY.fontWeight.normal};
  color: ${props => props.red ? COLORS.primary : COLORS.textPrimary};
  gap: ${SPACING.md};
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${COLORS.border};
  margin: ${SPACING.lg} 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.md};
`;

const InfoBox = styled.div`
  background-color: ${COLORS.primary}10;
  border: 1px solid ${COLORS.primary}30;
  border-radius: 6px;
  padding: ${SPACING.md};
  margin-top: ${SPACING.lg};
  font-size: ${TYPOGRAPHY.fontSize.sm};
  color: ${COLORS.textSecondary};
  line-height: ${TYPOGRAPHY.lineHeight.relaxed};
`;

/**
 * CartSummary Component - Tóm tắt giỏ hàng
 * @param {number} total - Tổng tiền
 * @param {number} count - Số sản phẩm đã chọn
 * @param {number} totalItems - Tổng số sản phẩm trong giỏ
 * @param {function} onCheckout - Callback khi nhấn thanh toán
 * @param {function} onContinueShopping - Callback khi tiếp tục mua sắm
 * @param {boolean} disabled - Vô hiệu hóa nút thanh toán
 */
export const CartSummary = ({
  total = 0,
  count = 0,
  totalItems = 0,
  onCheckout,
  onContinueShopping,
  disabled = false,
  shipping = 0,
  discount = 0,
}) => {
  const finalTotal = total + shipping - discount;

  return (
    <Wrapper>
      <Row bold>
        <span>Giỏ hàng</span>
        <span style={{ color: COLORS.primary }}>
          {totalItems || 0} sản phẩm
        </span>
      </Row>

      <Divider />

      <Row>
        <span>Đã chọn:</span>
        <span>{count || 0} sản phẩm</span>
      </Row>

      <Row>
        <span>Tổng tiền hàng:</span>
        <span>{Number(total || 0).toLocaleString('vi-VN')} ₫</span>
      </Row>

      {shipping > 0 && (
        <Row>
          <span>Phí vận chuyển:</span>
          <span>{shipping.toLocaleString('vi-VN')} ₫</span>
        </Row>
      )}

      {discount > 0 && (
        <Row style={{ color: COLORS.success }}>
          <span>Giảm giá:</span>
          <span>-{discount.toLocaleString('vi-VN')} ₫</span>
        </Row>
      )}

      <Divider />

      <Row bold red>
        <span>Tổng thanh toán:</span>
        <span>{Number(finalTotal).toLocaleString('vi-VN')} ₫</span>
      </Row>

      <ButtonGroup>
        <Button
          fullWidth
          disabled={disabled || count === 0}
          onClick={onCheckout}
          color={COLORS.primary}
        >
          💳 THANH TOÁN NGAY ({count})
        </Button>

        {onContinueShopping && (
          <Button
            fullWidth
            variant="outline"
            color={COLORS.primary}
            onClick={onContinueShopping}
          >
            ← Tiếp tục mua sắm
          </Button>
        )}
      </ButtonGroup>

      <InfoBox>
        ℹ️ <strong>Thông báo:</strong> Vui lòng chọn ít nhất 1 sản phẩm để tiến hành thanh toán.
      </InfoBox>
    </Wrapper>
  );
};
