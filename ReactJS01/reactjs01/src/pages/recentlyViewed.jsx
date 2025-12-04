import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, Empty } from 'antd';
import { EyeOutlined, ClearOutlined } from '@ant-design/icons';
import { 
  getRecentlyViewed, 
  removeFromRecentlyViewed, 
  clearRecentlyViewed 
} from '../util/recentlyViewed';
import ProductCard from '../components/product/ProductCard';

const { Title, Text } = Typography;

const RecentlyViewedPage = () => {
  const navigate = useNavigate();
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    loadRecentProducts();
  }, []);

  const loadRecentProducts = () => {
    const recent = getRecentlyViewed();
    setRecentProducts(recent);
  };

  const handleRemoveProduct = (productId) => {
    const updated = removeFromRecentlyViewed(productId);
    setRecentProducts(updated);
  };

  const handleClearAll = () => {
    clearRecentlyViewed();
    setRecentProducts([]);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div style={{ padding: 20, maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <Title level={2}>
          <EyeOutlined style={{ color: '#1890ff', marginRight: 8 }} />
          Sản phẩm đã xem ({recentProducts.length})
        </Title>
        
        {recentProducts.length > 0 && (
          <Button 
            type="default" 
            icon={<ClearOutlined />}
            onClick={handleClearAll}
          >
            Xóa tất cả
          </Button>
        )}
      </div>

      {recentProducts.length === 0 ? (
        <Card>
          <Empty 
            description="Bạn chưa xem sản phẩm nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate('/product')}>
              Khám phá sản phẩm
            </Button>
          </Empty>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recentProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onProductClick={handleProductClick}
              onRemove={handleRemoveProduct}
              showRemoveButton={true}
              showFavoriteButton={false}
              showActionButtons={false}
              compact={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyViewedPage;