import { notification, Table } from "antd";
import { useEffect, useState } from "react";
import { getUserApi } from "../util/api";

const UserPage = () => {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserApi();
      if (!res?.message) {
        setDataSource(res)
      } else {
        notification.error({
          message: "Unauthorized",
          description: res.message
        })
      }
    }
    fetchUser();
  }, [])
  const columns = [
    {
      title: 'Id',
      dataIndex: '_id', // Đổi 'id' thành '_id' nếu BackEnd MySQL/Sequelize trả về _id
                      // Hoặc giữ nguyên 'id' nếu Sequelize trả về id
      // Tùy thuộc vào model User của bạn trả về `id` hay `_id`
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Role',
      render: (text, record) => {
        return record.Role ? record.Role.description : "N/A"; 
      }
    },
  ];
  return (
    <div style={{ padding: 30 }}>
      <Table
        bordered
        dataSource={dataSource} columns={columns}
        rowKey={"_id"}
      />
    </div>
  )
}
export default UserPage;