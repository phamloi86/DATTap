import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icategory } from "../../interfaces/category";
import axios from "axios";
import { Table, Button, Typography, Modal, Space } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Helmet } from 'react-helmet-async';

const { confirm } = Modal;
const { Title } = Typography;

const ListCategory = () => {
  const [categories, setCategories] = useState<Icategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get("http://localhost:3000/categories");
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const removeCategory = async (id: number | string) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        await axios.delete(`http://localhost:3000/categories/${id}`);
        setCategories(categories.filter((item) => item.id !== id));
      },
    });
  };

  // Xây dựng cây danh mục cha - con
  const buildCategoryTree = (parentId: number | null): Icategory[] => {
    return categories
      .filter((category) => category.parentId === parentId)
      .map((category) => ({
        ...category,
        children: buildCategoryTree(category.id),
      }));
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Icategory) => (
        <span style={{ fontWeight: record.parentId === null ? "bold" : "normal" }}>
          {text}
        </span>
      ),
    },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <span style={{ color: active ? "green" : "red", fontWeight: "bold" }}>
          {active ? "Hiển thị" : "Ẩn"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: Icategory) => (
        <Space>
          <Button danger onClick={() => removeCategory(record.id)}>🗑 Xóa</Button>
          <Link to={`/admin/editcategory/${record.id}`}>
            <Button type="primary">✏ Sửa</Button>
          </Link>
        </Space>
      ),
    },
  ];
  

  return (
    <>
    <Helmet>
      <title>Danh sách danh mục</title>
    </Helmet>
    <div style={{ maxWidth: "1000px", margin: "auto", padding: "24px", background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginTop: "24px" }}>
      <Title level={2} style={{ textAlign: "center" }}>Danh sách danh mục</Title>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <Link to="/admin/addcategory">
          <Button type="link" style={{ fontSize: "16px", fontWeight: "bold" }}>➕ Thêm danh mục</Button>
        </Link>
      </div>
      <Table 
        dataSource={buildCategoryTree(null)} 
        columns={columns} 
        rowKey="id" 
        bordered
        rowClassName={(record) => (record.parentId === null ? "parent-category" : "")} 
      />
      <style>
        {`
          .parent-category {
            background-color: #f5f5f5 !important;
          }
        `}
      </style>
    </div>
    </>
  );
};

export default ListCategory;
