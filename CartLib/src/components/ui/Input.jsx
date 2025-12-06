/**
 * Input Component - Chuẩn hóa cho toàn thư viện
 */
import React from 'react';
import styled from 'styled-components';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.sm};
`;

const Label = styled.label`
  font-size: ${TYPOGRAPHY.fontSize.sm};
  font-weight: ${TYPOGRAPHY.fontWeight.medium};
  color: ${COLORS.textPrimary};
  font-family: ${TYPOGRAPHY.fontFamily};
`;

const StyledInput = styled.input`
  font-family: ${TYPOGRAPHY.fontFamily};
  font-size: ${TYPOGRAPHY.fontSize.sm};
  padding: ${SPACING.md} ${SPACING.lg};
  border: 2px solid ${COLORS.border};
  border-radius: 6px;
  transition: all 0.3s ease;
  background-color: ${COLORS.bgWhite};
  color: ${COLORS.textPrimary};

  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 3px ${COLORS.primary}20;
  }

  &:disabled {
    background-color: ${COLORS.bgLight};
    color: ${COLORS.textLight};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${COLORS.textLight};
  }

  width: ${props => props.fullWidth ? '100%' : 'auto'};
  min-width: ${props => props.minWidth || 'auto'};
`;

const ErrorText = styled.span`
  font-size: ${TYPOGRAPHY.fontSize.xs};
  color: ${COLORS.error};
  font-family: ${TYPOGRAPHY.fontFamily};
`;

const HelperText = styled.span`
  font-size: ${TYPOGRAPHY.fontSize.xs};
  color: ${COLORS.textLight};
  font-family: ${TYPOGRAPHY.fontFamily};
`;

/**
 * Input Component
 * @param {string} label - Label cho input
 * @param {string} value - Giá trị input
 * @param {function} onChange - Hàm xử lý thay đổi giá trị
 * @param {string} error - Thông báo lỗi
 * @param {string} helperText - Ghi chú hỗ trợ
 * @param {boolean} fullWidth - Chiếm toàn bộ chiều rộng
 * @param {string} type - Loại input (text, number, email, etc.)
 * @param {boolean} disabled - Vô hiệu hóa input
 */
export const Input = ({
  label,
  value,
  onChange,
  error,
  helperText,
  fullWidth = true,
  type = 'text',
  disabled = false,
  minWidth,
  className,
  ...props
}) => {
  return (
    <InputWrapper className={className}>
      {label && <Label>{label}</Label>}
      <StyledInput
        type={type}
        value={value}
        onChange={onChange}
        fullWidth={fullWidth}
        minWidth={minWidth}
        disabled={disabled}
        {...props}
      />
      {error && <ErrorText>{error}</ErrorText>}
      {!error && helperText && <HelperText>{helperText}</HelperText>}
    </InputWrapper>
  );
};
