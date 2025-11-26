import React, { useEffect, useState } from 'react';
import { getProductApi } from '../util/api';
import { Card, Col, Row, Button, Input, Select, Spin, Tag, notification } from 'antd';

const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

const ProductPage = () => {
    const [listProduct, setListProduct] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    
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
                        <Card
                            hoverable
                            cover={<img alt={item.name} src={item.image} style={{ height: 220, objectFit: 'contain', padding: 10 }} />}
                        >
                            <Meta 
                                title={item.name} 
                                description={
                                    <div>
                                        <div style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }}>
                                            {item.price.toLocaleString()} đ
                                        </div>
                                        <div style={{ marginTop: 5 }}>
                                            <Tag color="blue">{item.ram}</Tag>
                                            <Tag color="cyan">{item.rom}</Tag>
                                        </div>
                                    </div>
                                } 
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

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