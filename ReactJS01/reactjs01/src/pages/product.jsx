import React, { useEffect, useState } from 'react';
import { getProductApi } from '../util/api';
import { Card, Col, Row, Spin, Button, notification } from 'antd';

const { Meta } = Card;

const ProductPage = () => {
    const [listProduct, setListProduct] = useState([]);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    
    // Số lượng sản phẩm lấy mỗi lần (tùy chỉnh)
    const limit = 6; 

    // Hàm gọi API
    const loadProduct = async (page) => {
        setLoading(true);
        const res = await getProductApi(page, limit);
        
        if (res && res.products) {
            // Logic Lazy Loading: Nối dữ liệu cũ + dữ liệu mới
            setListProduct(prev => [...prev, ...res.products]);
            setTotal(res.totalRows);
        } else {
             notification.error({
                message: "Lỗi tải dữ liệu",
                description: "Không thể lấy danh sách sản phẩm"
            })
        }
        setLoading(false);
    }

    // Chạy lần đầu khi vào trang (Load trang 1)
    useEffect(() => {
        loadProduct(1);
    }, []);

    // Xử lý khi bấm nút "Xem thêm"
    const handleLoadMore = () => {
        const nextPage = current + 1;
        loadProduct(nextPage);
        setCurrent(nextPage);
    }

    return (
        <div style={{ padding: 20 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20 }}>DANH SÁCH SẢN PHẨM</h2>
            
            {/* Hiển thị danh sách dạng lưới */}
            <Row gutter={[20, 20]}>
                {listProduct.map((item) => (
                    // Responsive: Mobile 1 cột, Tablet 2 cột, Desktop 4 cột
                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                        <Card
                            hoverable
                            cover={
                                <img 
                                    alt={item.name} 
                                    src={item.image} 
                                    style={{ height: 250, objectFit: 'cover', padding: 10 }}
                                />
                            }
                        >
                            <Meta 
                                title={item.name} 
                                description={
                                    <span style={{ color: 'red', fontWeight: 'bold' }}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                    </span>
                                } 
                            />
                            <div style={{ marginTop: 10, color: '#888' }}>
                                {item.description.substring(0, 50)}...
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
            
            {/* Khu vực nút bấm tải thêm */}
            <div style={{ textAlign: 'center', marginTop: 30, marginBottom: 50 }}>
                {loading && <Spin tip="Đang tải..." />}
                
                {/* Chỉ hiện nút nếu chưa tải hết và không đang loading */}
                {!loading && listProduct.length < total && (
                    <Button type="primary" size="large" onClick={handleLoadMore}>
                        Xem thêm sản phẩm ({total - listProduct.length} còn lại)
                    </Button>
                )}

                {/* Thông báo khi đã hết hàng */}
                {listProduct.length >= total && listProduct.length > 0 && (
                    <div style={{ color: 'green', fontWeight: 'bold' }}>🎉 Bạn đã xem hết sản phẩm!</div>
                )}
            </div>
        </div>
    );
};

export default ProductPage;