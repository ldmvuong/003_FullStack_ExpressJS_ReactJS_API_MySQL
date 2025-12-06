import React from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 15px;
  background: white;
  gap: 15px;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

const Info = styled.div`
  flex: 1;
  h3 { margin: 0 0 5px; font-size: 16px; color: #333; }
  p { margin: 0; color: #d32f2f; font-weight: bold; font-size: 15px; }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QtyBtn = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
  border-radius: 4px;
  &:hover { background: #e0e0e0; }
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  &:hover { color: #d32f2f; }
`;

export const CartItemCard = ({ 
  id, name, price, image, quantity, isSelected, 
  onSelect, onIncrease, onDecrease, onDelete 
}) => {
  return (
    <CardWrapper>
      {/* Checkbox chọn thanh toán */}
      <input 
        type="checkbox" 
        checked={isSelected || false}
        onChange={(e) => onSelect(id, e.target.checked)}
        style={{ width: 18, height: 18, cursor: 'pointer' }}
      />
      
      <Image src={image} alt={name} />
      
      <Info>
        <h3>{name}</h3>
        <p>{Number(price).toLocaleString()} ₫</p>
      </Info>

      <Actions>
        <QtyBtn onClick={() => onDecrease(id, quantity)} disabled={quantity <= 1}>-</QtyBtn>
        <span style={{ minWidth: 20, textAlign: 'center' }}>{quantity}</span>
        <QtyBtn onClick={() => onIncrease(id, quantity)}>+</QtyBtn>
      </Actions>

      <DeleteBtn onClick={() => onDelete(id)}>🗑️</DeleteBtn>
    </CardWrapper>
  );
};