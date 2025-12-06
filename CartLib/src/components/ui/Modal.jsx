/**
 * Modal/Dialog Component - Chuẩn hóa cho toàn thư viện
 */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';
import { Button } from './Button';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background-color: ${COLORS.bgWhite};
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: ${props => props.size === 'sm' ? '400px' : props.size === 'lg' ? '800px' : '600px'};
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
  font-family: ${TYPOGRAPHY.fontFamily};

  @keyframes slideIn {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  padding: ${SPACING.xl};
  border-bottom: 1px solid ${COLORS.border};
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: ${TYPOGRAPHY.fontSize.xl};
    font-weight: ${TYPOGRAPHY.fontWeight.semibold};
    color: ${COLORS.textPrimary};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${COLORS.textLight};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${COLORS.textPrimary};
  }
`;

const ModalBody = styled.div`
  padding: ${SPACING.xl};
  color: ${COLORS.textSecondary};
  line-height: ${TYPOGRAPHY.lineHeight.normal};
`;

const ModalFooter = styled.div`
  padding: ${SPACING.xl};
  border-top: 1px solid ${COLORS.border};
  display: flex;
  justify-content: flex-end;
  gap: ${SPACING.md};
`;

/**
 * Modal/Dialog Component
 * @param {boolean} isOpen - Mở/đóng modal
 * @param {function} onClose - Hàm xử lý đóng modal
 * @param {string} title - Tiêu đề modal
 * @param {React.ReactNode} children - Nội dung modal
 * @param {function} onConfirm - Hàm xử lý nút xác nhận
 * @param {string} confirmText - Text nút xác nhận
 * @param {string} cancelText - Text nút hủy
 * @param {string} size - Kích thước modal: 'sm', 'md' (default), 'lg'
 * @param {string} confirmColor - Màu nút xác nhận
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  size = 'md',
  confirmColor = COLORS.primary,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent size={size} onClick={(e) => e.stopPropagation()}>
        {title && (
          <ModalHeader>
            <h2>{title}</h2>
            <CloseButton onClick={onClose}>✕</CloseButton>
          </ModalHeader>
        )}
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            color={COLORS.textSecondary}
            onClick={onClose}
          >
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              color={confirmColor}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};
