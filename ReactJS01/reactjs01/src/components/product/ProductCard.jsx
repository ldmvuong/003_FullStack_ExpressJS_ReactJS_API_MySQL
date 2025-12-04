import React, { useState, useContext } from 'react';
import { Card, Tag, Button, Typography, Image } from 'antd';
import { 
  HeartOutlined, HeartFilled, ShoppingCartOutlined,
  EyeOutlined, DeleteOutlined 
} from '@ant-design/icons';
import { AuthContext } from '../context/auth.context';

const { Text } = Typography;
const { Meta } = Card;

const ProductCard = ({ 
  product, 
  onProductClick, 
  onFavoriteToggle, 
  onRemove,
  onAddToCart,
  onBuyNow,
  favoriteLoading = false,
  removingLoading = false,
  showRemoveButton = false,
  showFavoriteButton = true,
  showActionButtons = true,
  compact = false
}) => {
  useContext(AuthContext);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Calculate discount price
  const discountPrice = product.discount > 0 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Fallback image component
  const FallbackImage = () => (
    <div 
      style={{ 
        height: compact ? 120 : 180,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        color: '#adb5bd',
        fontSize: 12,
        border: '1px solid #e9ecef',
        borderRadius: 12
      }}
    >
      <div style={{ fontSize: 24, marginBottom: 4 }}>📱</div>
      <div>No Image</div>
    </div>
  );



  return (
    <div 
      style={{ 
        width: '100%',
        maxWidth: compact ? '100%' : 280,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onClick={() => onProductClick && onProductClick(product.id)}
    >
      <Card
        hoverable
        bodyStyle={{ padding: 0 }}
        style={{
          borderRadius: 16,
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Image Container */}
        <div style={{ position: 'relative', backgroundColor: '#f8f9fa' }}>
          {imageError ? (
            <FallbackImage />
          ) : (
            <Image
              alt={product.name}
              src={product.image}
              style={{ 
                height: compact ? 120 : 180,
                width: '100%',
                objectFit: 'contain',
                padding: '16px',
                display: imageLoading ? 'none' : 'block'
              }}
              onError={handleImageError}
              onLoad={handleImageLoad}
              fallback={<FallbackImage />}
              preview={false}
            />
          )}
          
          {imageLoading && !imageError && (
            <div 
              style={{ 
                height: compact ? 120 : 180,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
                color: '#999',
                fontSize: 12
              }}
            >
              Đang tải...
            </div>
          )}
          
          {/* Heart Button */}
          {showFavoriteButton && (
            <Button
              type="text"
              icon={product.isFavorite ? <HeartFilled /> : <HeartOutlined />}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: product.isFavorite ? '#ff4d4f' : '#666',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle && onFavoriteToggle(product.id, e);
              }}
              loading={favoriteLoading}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          )}
          
          {/* Discount Badge */}
          {product.discount > 0 && (
            <div style={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: '#ff4d4f',
              color: 'white',
              fontSize: 12,
              fontWeight: 'bold',
              padding: '4px 8px',
              borderRadius: 12,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              -{product.discount}%
            </div>
          )}
          
          {/* Remove Button */}
          {showRemoveButton && (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                backgroundColor: 'white',
                borderRadius: '50%',
                width: 32,
                height: 32,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onRemove && onRemove(product.id);
              }}
              loading={removingLoading}
            />
          )}
        </div>
        {/* Content Section */}
        <div style={{ padding: '16px' }}>
          {/* Product Name */}
          <Typography.Text 
            strong 
            ellipsis={{ tooltip: product.name }}
            style={{ 
              fontSize: 14,
              lineHeight: '20px',
              display: 'block',
              marginBottom: 8,
              color: '#262626'
            }}
          >
            {product.name}
          </Typography.Text>
          
          {/* Price Section */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Typography.Text 
                strong 
                style={{ 
                  color: '#ff4d4f', 
                  fontSize: 18,
                  fontWeight: 600
                }}
              >
                {discountPrice.toLocaleString()}đ
              </Typography.Text>
              {product.discount > 0 && (
                <Typography.Text 
                  style={{ 
                    textDecoration: 'line-through',
                    color: '#8c8c8c',
                    fontSize: 12
                  }}
                >
                  {product.price.toLocaleString()}đ
                </Typography.Text>
              )}
            </div>
          </div>
          
          {/* Configuration Section */}
          {!compact && (
            <>
              <div style={{ marginBottom: 12 }}>
                <Typography.Text 
                  style={{ 
                    color: '#8c8c8c',
                    fontSize: 12,
                    display: 'block',
                    marginBottom: 6
                  }}
                >
                  Configuration
                </Typography.Text>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {product.ram && (
                    <Tag 
                      style={{
                        backgroundColor: '#e6f7ff',
                        color: '#1890ff',
                        border: '1px solid #91d5ff',
                        borderRadius: 4,
                        fontSize: 11,
                        padding: '2px 8px',
                        margin: 0
                      }}
                    >
                      {product.ram}
                    </Tag>
                  )}
                  {product.rom && (
                    <Tag 
                      style={{
                        backgroundColor: '#f6f6f6',
                        color: '#595959',
                        border: '1px solid #d9d9d9',
                        borderRadius: 4,
                        fontSize: 11,
                        padding: '2px 8px',
                        margin: 0
                      }}
                    >
                      {product.rom}
                    </Tag>
                  )}
                </div>
              </div>
              
              {/* Brand and Sales */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography.Text style={{ color: '#8c8c8c', fontSize: 12 }}>
                  {product.Category?.name || 'Xiaomi'}
                </Typography.Text>
                <Typography.Text style={{ color: '#8c8c8c', fontSize: 12 }}>
                  Đã bán {product.sold || 352}
                </Typography.Text>
              </div>
            </>
          )}
          
          {/* Recently viewed timestamp */}
          {compact && product.viewedAt && (
            <Typography.Text style={{ color: '#8c8c8c', fontSize: 11 }}>
              Xem lúc: {new Date(product.viewedAt).toLocaleDateString('vi-VN')}
            </Typography.Text>
          )}
          
          {/* Action Buttons */}
          {!compact && showActionButtons && (
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                block
                style={{
                  height: 40,
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  backgroundColor: '#1890ff',
                  border: 'none',
                  boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart && onAddToCart(product.id);
                }}
              >
                Add to Cart
              </Button>
              
              <Button
                block
                style={{
                  height: 40,
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #d9d9d9',
                  color: '#595959'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onBuyNow && onBuyNow(product.id);
                }}
              >
                Buy Now
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProductCard;