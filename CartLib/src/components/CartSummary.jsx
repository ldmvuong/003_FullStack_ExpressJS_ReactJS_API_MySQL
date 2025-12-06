import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: ${props => props.bold ? 'bold' : 'normal'};
  color: ${props => props.red ? '#d32f2f' : '#333'};
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  opacity: ${props => props.disabled ? 0.6 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  &:hover { background: ${props => props.disabled ? '#1890ff' : '#096dd9'}; }
`;

export const CartSummary = ({ total, count, onCheckout }) => {
  return (
    <Wrapper>
      <Row>
        <span>Đã chọn:</span>
        <span>{count} sản phẩm</span>
      </Row>
      <div style={{ borderTop: '1px dashed #ddd', margin: '15px 0' }}></div>
      <Row bold red>
        <span>Tổng tiền:</span>
        <span>{Number(total).toLocaleString()} ₫</span>
      </Row>
      <CheckoutButton onClick={onCheckout} disabled={count === 0}>
        MUA HÀNG NGAY ({count})
      </CheckoutButton>
    </Wrapper>
  );
};