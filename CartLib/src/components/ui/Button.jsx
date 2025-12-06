/**
 * Button Component - Chuẩn hóa cho toàn thư viện
 */
import React from 'react';
import styled from 'styled-components';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

const StyledButton = styled.button`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-size: ${TYPOGRAPHY.fontSize.sm};
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
  padding: ${props => {
    switch (props.size) {
      case 'small': return `${SPACING.sm} ${SPACING.md}`;
      case 'large': return `${SPACING.lg} ${SPACING.xl}`;
      default: return `${SPACING.md} ${SPACING.lg}`;
    }
  }};
  border: ${props => props.variant === 'outline' ? `2px solid ${props.color}` : 'none'};
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: all 0.3s ease;
  
  background-color: ${props => {
    if (props.disabled) return COLORS.disabled;
    if (props.variant === 'outline') return 'transparent';
    return props.color || COLORS.primary;
  }};

  color: ${props => {
    if (props.variant === 'outline') return props.color || COLORS.primary;
    return COLORS.textWhite;
  }};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: ${props => {
      if (props.variant === 'outline') {
        return `${props.color || COLORS.primary}15`;
      }
      // Darken the background color on hover
      if (props.color === COLORS.primary) return COLORS.primaryDark;
      if (props.color === COLORS.secondary) return COLORS.secondaryDark;
      if (props.color === COLORS.danger) return '#e63c3c';
      return props.color;
    }};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

/**
 * Button Component
 * @param {string} children - Nội dung button
 * @param {string} variant - 'solid' (default) hoặc 'outline'
 * @param {string} color - Màu sắc button (sử dụng COLORS constants)
 * @param {string} size - Kích thước: 'small', 'medium' (default), 'large'
 * @param {boolean} fullWidth - Chiếm toàn bộ chiều rộng container
 * @param {boolean} disabled - Vô hiệu hóa button
 * @param {function} onClick - Hàm xử lý click
 */
export const Button = ({
  children,
  variant = 'solid',
  color = COLORS.primary,
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  className,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
