import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, Row, Col, Button, notification, 
  Spin, Empty, Typography 
} from 'antd';
import { HeartFilled } from '@ant-design/icons';
import { getFavoritesApi, removeFavoriteApi } from '../util/api';
import { AuthContext } from '../components/context/auth.context';
import ProductCard from '../components/product/ProductCard';

const { Title, Text } = Typography;

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState(new Set());

  useEffect(() => {
    if (!auth.isAuthenticated) {
      notification.warning({ message: 'Vui lòng đăng nhập để xem sản phẩm yêu thích' });
      navigate('/login');
      return;
    }
    
    fetchFavorites();
  }, [auth.isAuthenticated, navigate]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await getFavoritesApi();
      
      if (res && res.favorites) {
        setFavorites(res.favorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      notification.error({ message: 'Lỗi tải danh sách yêu thích' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      setRemovingIds(prev => new Set([...prev, productId]));
      
      const res = await removeFavoriteApi(productId);
      
      if (res && res.success) {
        setFavorites(prev => prev.filter(item => item.id !== productId));
        notification.success({ message: 'Đã xóa khỏi danh sách yêu thích' });
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      notification.error({ message: 'Lỗi xóa sản phẩm yêu thích' });
    } finally {
      setRemovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
        <HeartFilled style={{ color: 'red', marginRight: 8 }} />
        Sản phẩm yêu thích ({favorites.length})
      </Title>

      {favorites.length === 0 ? (
        <Card>
          <Empty 
            description="Bạn chưa có sản phẩm yêu thích nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate('/product')}>
              Khám phá sản phẩm
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[12, 12]}>
          {favorites.map((item) => (
            <Col xs={24} sm={24} md={12} lg={8} key={item.id}>
              <ProductCard
                product={{...item, isFavorite: true}}
                onProductClick={handleProductClick}
                onRemove={handleRemoveFavorite}
                removingLoading={removingIds.has(item.id)}
                showRemoveButton={true}
                showFavoriteButton={false}
                showActionButtons={false}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default FavoritesPage;