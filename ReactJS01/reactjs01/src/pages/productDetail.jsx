import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Row, Col, Button, Tag, Rate, Input, Form, 
  notification, Spin, Empty, Divider, Typography, Space,
  Badge
} from 'antd';
import { 
  HeartOutlined, HeartFilled, ShoppingCartOutlined,
  StarOutlined, MessageOutlined, EyeOutlined 
} from '@ant-design/icons';
import { 
  getProductDetailApi, toggleFavoriteApi, createReviewApi 
} from '../util/api';
import { addRecentlyViewed } from '../util/recentlyViewed';
import { AuthContext } from '../components/context/auth.context';
import ProductCard from '../components/product/ProductCard';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const res = await getProductDetailApi(id);
      
      if (res && res.product) {
        setProduct(res.product);
        setSimilarProducts(res.similarProducts || []);
        setReviews(res.reviews || []);
        setReviewsCount(res.reviewsCount || 0);
        setIsFavorite(res.isFavorite || false);
        
        // Add to recently viewed
        addRecentlyViewed(res.product);
      } else {
        notification.error({ message: 'Không tìm thấy sản phẩm' });
        navigate('/product');
      }
    } catch (error) {
      console.error('Error fetching product detail:', error);
      notification.error({ message: 'Lỗi tải chi tiết sản phẩm' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!auth.isAuthenticated) {
      notification.warning({ message: 'Vui lòng đăng nhập để sử dụng tính năng yêu thích' });
      navigate('/login');
      return;
    }

    try {
      setFavoriteLoading(true);
      const res = await toggleFavoriteApi(product.id);
      
      if (res && typeof res.liked === 'boolean') {
        setIsFavorite(res.liked);
        notification.success({ 
          message: res.liked ? 'Đã thêm vào yêu thích' : 'Đã bỏ khỏi yêu thích' 
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      notification.error({ message: 'Lỗi cập nhật yêu thích' });
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleCreateReview = async (values) => {
    if (!auth.isAuthenticated) {
      notification.warning({ message: 'Vui lòng đăng nhập để đánh giá sản phẩm' });
      navigate('/login');
      return;
    }

    try {
      setReviewLoading(true);
      const res = await createReviewApi(product.id, values.rating, values.comment);
      
      if (res && res.id) {
        notification.success({ message: 'Đánh giá thành công!' });
        form.resetFields();
        // Refresh product detail to get new review
        fetchProductDetail();
      }
    } catch (error) {
      console.error('Error creating review:', error);
      notification.error({ message: 'Lỗi tạo đánh giá' });
    } finally {
      setReviewLoading(false);
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

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Empty description="Không tìm thấy sản phẩm" />
      </div>
    );
  }

  const discountPrice = product.discount > 0 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Product Detail Section */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={10}>
          <Card 
            cover={
              <img 
                alt={product.name} 
                src={product.image} 
                style={{ height: 400, objectFit: 'contain', padding: 20 }}
              />
            }
          />
        </Col>
        
        <Col xs={24} md={14}>
          <Card>
            <Title level={2}>{product.name}</Title>
            
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {/* Price */}
              <div>
                {product.discount > 0 ? (
                  <Space>
                    <Title level={3} style={{ color: 'red', margin: 0 }}>
                      {discountPrice.toLocaleString()} đ
                    </Title>
                    <Text delete style={{ fontSize: 16 }}>
                      {product.price.toLocaleString()} đ
                    </Text>
                    <Tag color="red">-{product.discount}%</Tag>
                  </Space>
                ) : (
                  <Title level={3} style={{ color: 'red', margin: 0 }}>
                    {product.price.toLocaleString()} đ
                  </Title>
                )}
              </div>

              {/* Specs */}
              <div>
                <Space wrap>
                  <Tag color="blue" icon={<span>🧠</span>}>RAM: {product.ram}</Tag>
                  <Tag color="cyan" icon={<span>💾</span>}>ROM: {product.rom}</Tag>
                  <Tag color="green" icon={<span>📱</span>}>Màn hình: {product.screen}</Tag>
                  <Tag color="orange" icon={<span>🔋</span>}>Pin: {product.battery}</Tag>
                </Space>
              </div>

              {/* Stats */}
              <div>
                <Space>
                  <Badge count={product.sold || 0} showZero color="green">
                    <Tag icon={<ShoppingCartOutlined />}>Đã bán</Tag>
                  </Badge>
                  <Badge count={reviewsCount} showZero color="blue">
                    <Tag icon={<MessageOutlined />}>Đánh giá</Tag>
                  </Badge>
                  <Tag icon={<EyeOutlined />} color="purple">Danh mục: {product.Category?.name}</Tag>
                </Space>
              </div>

              {/* Description */}
              {product.description && (
                <Paragraph>{product.description}</Paragraph>
              )}

              {/* Action Buttons */}
              <Space size="large">
                <Button
                  type={isFavorite ? 'primary' : 'default'}
                  icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                  onClick={handleToggleFavorite}
                  loading={favoriteLoading}
                  danger={isFavorite}
                >
                  {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                </Button>
                
                <Button type="primary" size="large" icon={<ShoppingCartOutlined />}>
                  Mua ngay
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Reviews Section */}
      <Card title={`Đánh giá sản phẩm (${reviewsCount})`}>
        {auth.isAuthenticated ? (
          <Form
            form={form}
            onFinish={handleCreateReview}
            layout="vertical"
            style={{ marginBottom: 24 }}
          >
            <Form.Item
              name="rating"
              label="Đánh giá sao"
              rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
            >
              <Rate />
            </Form.Item>
            
            <Form.Item
              name="comment"
              label="Bình luận"
              rules={[{ required: true, message: 'Vui lòng nhập bình luận' }]}
            >
              <TextArea rows={4} placeholder="Nhập đánh giá của bạn..." />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={reviewLoading}>
                Gửi đánh giá
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <Text type="secondary">
              <Button type="link" onClick={() => navigate('/login')}>
                Đăng nhập
              </Button> 
              để đánh giá sản phẩm
            </Text>
          </div>
        )}

        <Divider />

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div>
            {reviews.map((review) => (
              <Card key={review.id} size="small" style={{ marginBottom: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space>
                    <Text strong>{review.User?.name || 'Ẩn danh'}</Text>
                    <Rate disabled defaultValue={review.rating} style={{ fontSize: 14 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </Space>
                  <Text>{review.comment}</Text>
                </Space>
              </Card>
            ))}
          </div>
        ) : (
          <Empty description="Chưa có đánh giá nào" />
        )}
      </Card>

      <Divider />

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <Card title="Sản phẩm tương tự">
          <Row gutter={[16, 16]}>
            {similarProducts.map((item) => (
              <Col xs={12} sm={8} md={6} lg={4} key={item.id}>
                <ProductCard
                  product={item}
                  onProductClick={handleProductClick}
                  size="small"
                  showFavoriteButton={false}
                />
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );
};

export default ProductDetailPage;