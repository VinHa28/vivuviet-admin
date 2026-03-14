/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Sidebar from "../dashboard/SideBar";
import {
  Button,
  Space,
  Table,
  Tag,
  Input,
  Modal,
  message,
  Select,
  Form,
  InputNumber,
} from "antd";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import { getServices, updateServiceStatus } from "../services/adminService";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");

  // State cho Modal Chỉnh sửa
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = filterStatus === "all" ? {} : { status: filterStatus };
      const data = await getServices(params);
      setServices(data.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [filterStatus]);

  // Hàm mở modal edit
  const handleEdit = (record) => {
    setEditingService(record);
    form.setFieldsValue({
      name: record.name,
      type: record.type,
      priceFrom: record.priceFrom,
      description: record.description,
      businessName: record.partner?.businessName,
    });
    setIsEditModalOpen(true);
  };

  // Logic Tìm kiếm & Lọc tại chỗ (Local Filter)
  const filteredData = services.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.partner?.businessName
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    {
      title: "Dịch vụ",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.images?.[0] || "https://via.placeholder.com/50"}
            alt={text}
            className="w-10 h-10 rounded object-cover"
          />
          <div className="font-semibold text-gray-800">{text}</div>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Tour", value: "tour" },
        { text: "Khách sạn", value: "hotel" },
        { text: "Nhà hàng", value: "restaurant" },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => <Tag color="blue">{type?.toUpperCase()}</Tag>,
    },
    {
      title: "Đối tác",
      dataIndex: ["partner", "businessName"],
      key: "partner",
      sorter: (a, b) =>
        (a.partner?.businessName || "").localeCompare(
          b.partner?.businessName || "",
        ),
      render: (text) => <span className="text-gray-600">{text || "N/A"}</span>,
    },
    {
      title: "Giá từ",
      dataIndex: "priceFrom",
      key: "priceFrom",
      sorter: (a, b) => a.priceFrom - b.priceFrom,
      render: (price) => (
        <span className="text-[#a5190e] font-bold">
          {price?.toLocaleString()}đ
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const config = {
          pending: { color: "warning", text: "Chờ duyệt" },
          approved: { color: "success", text: "Đã duyệt" },
          rejected: { color: "error", text: "Từ chối" },
        };
        return <Tag color={config[status]?.color}>{config[status]?.text}</Tag>;
      },
    },
    {
      title: "HÀNH ĐỘNG",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<Edit size={16} />}
            onClick={() => handleEdit(record)}
            title="Chi tiết/Sửa"
          />
          {record.status === "pending" && (
            <Button
              type="primary"
              icon={<CheckCircle size={16} />}
              className="bg-green-600 hover:bg-green-700 flex items-center"
              onClick={() => message.success("Đã duyệt")}
            />
          )}
          <Button
            danger
            icon={<Trash2 size={16} />}
            onClick={() => Modal.confirm({ title: "Xác nhận xóa?" })}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFE]">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#252525] mb-2">
              Quản lý Dịch vụ
            </h1>
            <p className="text-gray-600">
              Tìm kiếm và điều chỉnh dịch vụ từ đối tác
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<Plus size={18} />}
            className="bg-[#a5190e] flex items-center"
          >
            Thêm dịch vụ
          </Button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-t-xl border border-gray-100 flex justify-between items-center">
          <Space size="small">
            {["all", "pending", "approved", "rejected"].map((s) => (
              <Button
                key={s}
                type={filterStatus === s ? "primary" : "default"}
                onClick={() => setFilterStatus(s)}
                className={filterStatus === s ? "bg-[#a5190e]" : ""}
              >
                {s === "all"
                  ? "Tất cả"
                  : s === "pending"
                    ? "Chờ duyệt"
                    : s === "approved"
                      ? "Đã duyệt"
                      : "Từ chối"}
              </Button>
            ))}
          </Space>

          <Input
            placeholder="Tìm theo tên dịch vụ hoặc đối tác..."
            prefix={<Search size={18} className="text-gray-400" />}
            allowClear
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-b-xl shadow-sm p-4">
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey="_id"
            pagination={{ pageSize: 8 }}
          />
        </div>
      </main>

      {/* MODAL CHI TIẾT & CHỈNH SỬA */}
      <Modal
        title="Chi tiết dịch vụ"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => form.submit()}
        width={800} // Tăng chiều rộng để hiển thị ảnh đẹp hơn
        okText="Cập nhật"
        cancelText="Đóng"
      >
        <Form form={form} layout="vertical" className="mt-4">
          {/* PHẦN HIỂN THỊ ẢNH DỊCH VỤ */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Hình ảnh dịch vụ
            </label>
            <div className="flex flex-wrap gap-4 p-4 border border-dashed rounded-lg bg-gray-50">
              {editingService?.images && editingService.images.length > 0 ? (
                editingService.images.map((img, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={img}
                      alt={`service-${index}`}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover shadow-sm"
                    />
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm py-4 w-full text-center">
                  Dịch vụ này hiện chưa có hình ảnh.
                </div>
              )}
              {/* Bạn có thể thêm nút Upload ở đây nếu muốn hỗ trợ thêm ảnh */}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Tên dịch vụ"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="type" label="Loại hình">
              <Select
                options={[
                  { value: "tour", label: "Tour" },
                  { value: "hotel", label: "Khách sạn" },
                  { value: "restaurant", label: "Nhà hàng" },
                ]}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="priceFrom" label="Giá khởi điểm (VNĐ)">
              <InputNumber
                className="w-full"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item name="businessName" label="Đối tác sở hữu">
              <Input disabled className="bg-gray-100 text-gray-500" />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Mô tả dịch vụ">
            <Input.TextArea
              rows={4}
              placeholder="Nhập mô tả chi tiết về dịch vụ..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Services;
