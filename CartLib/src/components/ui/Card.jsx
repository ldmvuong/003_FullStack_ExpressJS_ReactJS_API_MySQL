/**
 * Card Component - Chuẩn hóa cho toàn thư viện
 */
import React from 'react';
import styled from 'styled-components';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

const StyledCard = styled.div`
  background-color: ${COLORS.bgWhite};
  border: 1px solid ${COLORS.border};
  border-radius: ${props => props.rounded ? props.rounded : '8px'};
  padding: ${props => {
    switch (props.padding) {
      case 'small': return SPACING.md;
      case 'large': return SPACING.xl;
      default: return SPACING.lg;
    }
  }};
  box-shadow: ${props => {
    if (props.shadow === 'none') return 'none';
    if (props.shadow === 'lg') return '0 10px 25px rgba(0, 0, 0, 0.1)';
    if (props.shadow === 'sm') return '0 1px 3px rgba(0, 0, 0, 0.1)';
    return '0 2px 8px rgba(0, 0, 0, 0.1)';
  }};
  transition: all 0.3s ease;
  font-family: ${TYPOGRAPHY.fontFamily};

  ${props => props.hoverable && `
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
  `}
`;

const CardHeader = styled.div`
  padding-bottom: ${SPACING.lg};
  border-bottom: 1px solid ${COLORS.border};
  margin-bottom: ${SPACING.lg};

  h3 {
    margin: 0;
    font-size: ${TYPOGRAPHY.fontSize.lg};
    font-weight: ${TYPOGRAPHY.fontWeight.semibold};
    color: ${COLORS.textPrimary};
  }
`;

const CardContent = styled.div``;

const CardFooter = styled.div`
  padding-top: ${SPACING.lg};
  border-top: 1px solid ${COLORS.border};
  margin-top: ${SPACING.lg};
  display: flex;
  gap: ${SPACING.md};
  justify-content: flex-end;
`;

/**
 * Card Component
 * @param {React.ReactNode} children - Nội dung card
 * @param {React.ReactNode} header - Header của card
 * @param {React.ReactNode} footer - Footer của card
 * @param {string} padding - Kích thước padding: 'small', 'medium' (default), 'large'
 * @param {string} shadow - Loại shadow: 'none', 'sm', 'md' (default), 'lg'
 * @param {boolean} hoverable - Thêm hiệu ứng hover
 */
export const Card = ({
  children,
  header,
  footer,
  padding = 'medium',
  shadow = 'md',
  hoverable = false,
  rounded = '8px',
  className,
  ...props
}) => {
  return (
    <StyledCard
      padding={padding}
      shadow={shadow}
      hoverable={hoverable}
      rounded={rounded}
      className={className}
      {...props}
    >
      {header && <CardHeader>{header}</CardHeader>}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </StyledCard>
  );
};

export { CardHeader, CardContent, CardFooter };
