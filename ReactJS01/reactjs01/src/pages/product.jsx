import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductApi, toggleFavoriteApi } from '../util/api';
import { Card, Col, Row, Button, Input, Select, Spin, notification, Typography, Modal, InputNumber } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { AuthContext } from '../components/context/auth.context';
import { getRecentlyViewed } from '../util/recentlyViewed';
import ProductCard from '../components/product/ProductCard';
import { useCart } from '../hooks/useCart';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const ProductPage = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { addToCart } = useCart();
    const [listProduct, setListProduct] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [recentProducts, setRecentProducts] = useState([]);
    const [favoriteLoading, setFavoriteLoading] = useState(new Set());
    const [addToCartLoading, setAddToCartLoading] = useState(new Set());
    
    // State Filter
    const [filter, setFilter] = useState({
        page: 1,
        limit: 8,
        keyword: '',
        sort: 'createdAt-desc',
        category: [], 
        ram: [],      
        priceRange: null 
    });

    // Gọi API
    const fetchProducts = async (currentFilter) => {
        setLoading(true);
        
        // Chuyển đổi mảng thành chuỗi cách nhau dấu phẩy trước khi gửi
        const params = {
            ...currentFilter,
            category: currentFilter.category ? currentFilter.category.join(',') : '', 
            ram: currentFilter.ram ? currentFilter.ram.join(',') : ''
        };

        try {
            const res = await getProductApi(params);
            if (res && res.products) {
                if (currentFilter.page === 1) {
                    setListProduct(res.products);
                } else {
                    setListProduct(prev => [...prev, ...res.products]);
                }
                setTotal(res.totalRows);
            }
        } catch (error) {
            notification.error({ message: "Lỗi tải dữ liệu" });
        }
        setLoading(false);
    }

    // Effect: Khi filter thay đổi -> Gọi lại API
    useEffect(() => {
        // 1. Khi filter thay đổi, luôn reset về trang 1
        const newFilter = { ...filter, page: 1 };
        
        // 2. Cập nhật lại state filter để biến page về 1
        setFilter(newFilter);
        
        // 3. Gọi API lấy dữ liệu trang 1
        fetchProducts(newFilter);
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.keyword, filter.sort, filter.category, filter.ram]);

    // Load recently viewed products
    useEffect(() => {
        const recent = getRecentlyViewed();
        setRecentProducts(recent);
    }, []);

    const handleToggleFavorite = async (productId, event) => {
        event.stopPropagation();
        
        if (!auth.isAuthenticated) {
            notification.warning({ message: 'Vui lòng đăng nhập để sử dụng tính năng yêu thích' });
            navigate('/login');
            return;
        }

        try {
            setFavoriteLoading(prev => new Set([...prev, productId]));
            const res = await toggleFavoriteApi(productId);
            
            if (res && typeof res.liked === 'boolean') {
                notification.success({ 
                    message: res.liked ? 'Đã thêm vào yêu thích' : 'Đã bỏ khỏi yêu thích' 
                });
                // Update the product's favorite status in the current list
                setListProduct(prev => prev.map(product => 
                    product.id === productId 
                        ? { ...product, isFavorite: res.liked }
                        : product
                ));
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            notification.error({ message: 'Lỗi cập nhật yêu thích' });
        } finally {
            setFavoriteLoading(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };
    
    const handleAddToCart = async (productId) => {
        if (!auth.isAuthenticated) {
            notification.warning({ message: 'Vui lòng đăng nhập để thêm vào giỏ hàng' });
            navigate('/login');
            return;
        }
        
        const product = listProduct.find(p => p.id === productId);
        if (!product) return;
        
        try {
            setAddToCartLoading(prev => new Set([...prev, productId]));
            await addToCart({
                variables: {
                    productId: productId.toString(),
                    quantity: 1
                }
            });
            notification.success({ 
                message: 'Thành công',
                description: 'Đã thêm 1 sản phẩm vào giỏ hàng' 
            });
        } catch (error) {
            notification.error({ 
                message: 'Lỗi',
                description: error.message || 'Không thể thêm vào giỏ hàng' 
            });
        } finally {
            setAddToCartLoading(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };
    
    const handleBuyNow = (productId) => {
        if (!auth.isAuthenticated) {
            notification.warning({ message: 'Vui lòng đăng nhập để mua hàng' });
            navigate('/login');
            return;
        }
        // Navigate to product detail or checkout
        navigate(`/product/${productId}`);
    }; 

    // Các hàm xử lý sự kiện load more
    const handleLoadMore = () => {
        const nextPage = filter.page + 1;
        const newFilter = { ...filter, page: nextPage };
        
        setFilter(newFilter); // Cập nhật state lên trang tiếp theo
        fetchProducts(newFilter); // Gọi API trang tiếp theo
    }

    return (
        <div style={{ padding: 20 }}>
            <h2 style={{ textAlign: 'center' }}>CỬA HÀNG ĐIỆN THOẠI</h2>

            {/* --- THANH CÔNG CỤ TÌM KIẾM & LỌC --- */}
            <div style={{ 
                background: '#f5f5f5', padding: 20, borderRadius: 8, marginBottom: 20,
                display: 'flex', gap: 15, flexWrap: 'wrap', justifyContent: 'center'
            }}>
                
                <Search
                    placeholder="Tìm tên máy..."
                    onSearch={(val) => setFilter({ ...filter, keyword: val })}
                    style={{ width: 250 }}
                    allowClear
                    enterButton
                />

                <Select
                    mode="multiple"
                    allowClear
                    style={{ width: 250 }}
                    placeholder="Chọn Hãng"
                    value={filter.category}
                    onChange={(val) => setFilter({ ...filter, category: val })}
                    maxTagCount="responsive"
                >
                    <Option value="Apple">Apple</Option>
                    <Option value="Samsung">Samsung</Option>
                    <Option value="Xiaomi">Xiaomi</Option>
                    <Option value="Oppo">Oppo</Option>
                </Select>

                <Select
                    mode="multiple"
                    allowClear
                    style={{ width: 200 }}
                    placeholder="Chọn RAM"
                    value={filter.ram}
                    onChange={(val) => setFilter({ ...filter, ram: val })}
                >
                    <Option value="4GB">4GB</Option>
                    <Option value="8GB">8GB</Option>
                    <Option value="12GB">12GB</Option>
                    <Option value="16GB">16GB</Option>
                </Select>

                <Select 
                    defaultValue="createdAt-desc" 
                    style={{ width: 180 }} 
                    onChange={(val) => setFilter({ ...filter, sort: val })}
                >
                    <Option value="createdAt-desc">Mới nhất</Option>
                    <Option value="price-asc">Giá tăng dần</Option>
                    <Option value="price-desc">Giá giảm dần</Option>
                    <Option value="sold-desc">Bán chạy nhất</Option>
                </Select>
            </div>

            {/* --- DANH SÁCH SẢN PHẨM --- */}
            <Row gutter={[16, 16]}>
                {listProduct.map((item) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                        <ProductCard
                            product={item}
                            onProductClick={handleProductClick}
                            onFavoriteToggle={handleToggleFavorite}
                            onAddToCart={handleAddToCart}
                            onBuyNow={handleBuyNow}
                            favoriteLoading={favoriteLoading.has(item.id)}
                            showFavoriteButton={true}
                            showActionButtons={true}
                        />
                    </Col>
                ))}
            </Row>

            {/* Recently Viewed Section */}
            {recentProducts.length > 0 && (
                <div style={{ marginTop: 40 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <Title level={4}>
                            <EyeOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                            Sản phẩm đã xem gần đây
                        </Title>
                        <Button 
                            type="link" 
                            onClick={() => navigate('/recently-viewed')}
                        >
                            Xem tất cả
                        </Button>
                    </div>
                    <Row gutter={[16, 16]}>
                        {recentProducts.slice(0, 4).map((item) => (
                            <Col xs={12} sm={8} md={6} lg={6} key={item.id}>
                                <ProductCard
                                    product={item}
                                    onProductClick={handleProductClick}
                                    size="small"
                                    showFavoriteButton={false}
                                />
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

             {/* Nút Xem Thêm */}
             <div style={{ textAlign: 'center', marginTop: 30 }}>
                {loading && <Spin />}
                {!loading && listProduct.length < total && (
                    <Button onClick={handleLoadMore}>Xem thêm ({total - listProduct.length})</Button>
                )}
            </div>
        </div>
    );
};

export default ProductPage;