/**
 * Badge Component - Chuẩn hóa cho toàn thư viện
 */
import React from 'react';
import styled from 'styled-components';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => {
    switch (props.size) {
      case 'small': return `${SPACING.xs} ${SPACING.sm}`;
      case 'large': return `${SPACING.sm} ${SPACING.md}`;
      default: return `${SPACING.xs} ${SPACING.md}`;
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'small': return TYPOGRAPHY.fontSize.xs;
      case 'large': return TYPOGRAPHY.fontSize.sm;
      default: return TYPOGRAPHY.fontSize.xs;
    }
  }};
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
  border-radius: 12px;
  background-color: ${props => {
    switch (props.variant) {
      case 'success': return COLORS.success;
      case 'warning': return COLORS.warning;
      case 'danger': return COLORS.danger;
      case 'info': return COLORS.info;
      default: return COLORS.primary;
    }
  }};
  color: ${COLORS.textWhite};
  font-family: ${TYPOGRAPHY.fontFamily};
`;

/**
 * Badge Component
 * @param {string} children - Nội dung badge
 * @param {string} variant - Loại badge: 'primary' (default), 'success', 'warning', 'danger', 'info'
 * @param {string} size - Kích thước: 'small', 'medium' (default), 'large'
 */
export const Badge = ({
  children,
  variant = 'primary',
  size = 'medium',
  className,
  ...props
}) => {
  return (
    <StyledBadge
      variant={variant}
      size={size}
      className={className}
      {...props}
    >
      {children}
    </StyledBadge>
  );
};
