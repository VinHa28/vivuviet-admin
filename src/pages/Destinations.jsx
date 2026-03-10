import React, { useEffect, useState } from "react";
import Sidebar from "../dashboard/SideBar";
import { getDestinations, updateDestination } from "../services/adminService";

import {
  Table,
  Tag,
  Input,
  Button,
  Space,
  Tooltip,
  Typography,
  Form,
  Modal,
  Switch,
  message,
} from "antd";

import { SearchOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";

import TextArea from "antd/es/input/TextArea";

const { Text } = Typography;

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();

  // ================= FETCH DATA =================
  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const data = await getDestinations();
      setDestinations(data?.destinations || []);
    } catch (error) {
      console.error("Fetch destinations error:", error);
      message.error("Không thể tải danh sách địa điểm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // ================= EDIT =================
  const handleEdit = (record) => {
    setEditingDest(record);

    form.setFieldsValue({
      shortDescription: record.shortDescription,
      isActive: record.isActive,
    });

    setIsModalOpen(true);
  };

  // ================= UPDATE =================
  const handleUpdate = async (values) => {
    try {
      if (!editingDest) return;

      setSubmitting(true);

      await updateDestination(editingDest.code, values);

      message.success("Cập nhật địa điểm thành công");

      setIsModalOpen(false);
      setEditingDest(null);
      form.resetFields();

      fetchDestinations();
    } catch (error) {
      console.error("Update destination error:", error);
      message.error("Cập nhật thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= SEARCH =================
  const filteredData = destinations.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.code?.toLowerCase().includes(searchText.toLowerCase()),
  );

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: "Mã tỉnh",
      dataIndex: "code",
      key: "code",
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },

    {
      title: "Tên địa điểm",
      dataIndex: "name",
      key: "name",
      width: 180,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <span className="font-bold text-[#252525]">{text}</span>
      ),
    },

    {
      title: "Mô tả ngắn",
      dataIndex: "shortDescription",
      key: "shortDescription",
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Text className="text-gray-500 text-xs">{text}</Text>
        </Tooltip>
      ),
    },

    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 150,
      filters: [
        { text: "Đang hoạt động", value: true },
        { text: "Chưa kích hoạt", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,

      render: (isActive) => (
        <Tag
          color={isActive ? "success" : "default"}
          className="rounded-full px-3"
        >
          {isActive ? "Đang hoạt động" : "Chưa kích hoạt"}
        </Tag>
      ),
    },

    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      width: 120,

      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              size="small"
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFE]">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        {/* ================= HEADER ================= */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#252525] mb-2 flex items-center gap-2">
              Quản lý địa điểm
            </h1>
            <p className="text-gray-500 text-sm">
              Quản lý danh sách các tỉnh thành và trạng thái hiển thị trên hệ
              thống.
            </p>
          </div>

          <div className="flex gap-4">
            <Input
              placeholder="Tìm tên tỉnh hoặc mã..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64 rounded-lg shadow-sm"
              allowClear
            />
          </div>
        </header>

        {/* ================= TABLE ================= */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} tỉnh thành`,
            }}
            scroll={{ x: 1000 }}
          />
        </section>

        {/* ================= EDIT MODAL ================= */}
        <Modal
          title={`Chỉnh sửa: ${editingDest?.name || ""}`}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={() => form.submit()}
          confirmLoading={submitting}
          okText="Lưu thay đổi"
          cancelText="Hủy"
          okButtonProps={{
            icon: <SaveOutlined />,
            className: "bg-[#a5190e]",
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
            className="mt-4"
          >
            <Form.Item
              name="isActive"
              label="Trạng thái hiển thị"
              valuePropName="checked"
            >
              <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
            </Form.Item>

            <Form.Item
              name="shortDescription"
              label="Mô tả ngắn"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <TextArea
                rows={6}
                placeholder="Nhập giới thiệu ngắn về tỉnh thành..."
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Form>
        </Modal>
      </main>
    </div>
  );
}
