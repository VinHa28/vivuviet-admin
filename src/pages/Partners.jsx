import { useEffect, useState } from "react";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { Table, Tag, Button, Space, Modal, Input, message } from "antd";
import Sidebar from "../dashboard/SideBar";
import { getAllPartners, updatePartnerStatus } from "../services/adminService";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await getAllPartners();
      setPartners(data);
    } catch (error) {
      console.log(error);
      message.error("Không thể tải danh sách đối tác");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (partnerId) => {
    try {
      await updatePartnerStatus(partnerId, "active");
      message.success("Đã duyệt đối tác thành công!");
      fetchPartners();
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra khi duyệt");
    }
  };

  const handleReject = async () => {
    try {
      // Gọi API reject ở đây với rejectionReason
      message.info("Đã từ chối đối tác!");
      setIsModalOpen(false);
      setRejectionReason("");
      fetchPartners();
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi từ chối");
    }
  };

  // Lọc dữ liệu dựa trên tab
  const filteredData = partners.filter((p) =>
    filter === "all" ? true : p.status === filter,
  );

  const columns = [
    {
      title: "DOANH NGHIỆP",
      key: "business",
      render: (_, record) => (
        <div>
          <div className="font-bold text-gray-900">
            {record.businessName || "N/A"}
          </div>
          <div className="text-xs text-gray-500">{record.phone}</div>
        </div>
      ),
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "GÓI",
      dataIndex: "partnerTier",
      key: "partnerTier",
      render: (tier) => {
        const colors = { basic: "default", standard: "blue", premium: "gold" };
        return (
          <Tag color={colors[tier] || "default"}>{tier?.toUpperCase()}</Tag>
        );
      },
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const config = {
          pending: { color: "warning", text: "Chờ duyệt" },
          active: { color: "success", text: "Đã duyệt" },
          rejected: { color: "error", text: "Từ chối" },
        };
        return <Tag color={config[status]?.color}>{config[status]?.text}</Tag>;
      },
    },
    {
      title: "NGÀY ĐĂNG KÝ",
      dataIndex: "requestedAt",
      key: "requestedAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "HÀNH ĐỘNG",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.status === "active" && (
            <Button
              type="primary"
              icon={<Eye size={14} />}
              size="small"
              onClick={() => navigate(`/partners/details/${record._id}`)}
              style={{
                backgroundColor: "#a5190e",
                borderColor: "#a5190e",
                fontSize: "12px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Chi tiết
            </Button>
          )}

          {record.status === "pending" && (
            <>
              <Button
                type="primary"
                icon={<CheckCircle size={16} />}
                className="bg-green-600 hover:bg-green-700 flex items-center"
                onClick={() => handleApprove(record._id)}
              >
                Duyệt
              </Button>
              <Button
                danger
                icon={<XCircle size={16} />}
                className="flex items-center bg-[#a5190e] hover:opacity-90"
                onClick={() => {
                  setSelectedPartner(record);
                  setIsModalOpen(true);
                }}
              >
                Từ chối
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFE]">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#252525]">Quản lý Đối tác</h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-lg w-fit shadow-sm">
          {[
            { id: "all", label: "Tất cả" },
            { id: "pending", label: "Chờ duyệt" },
            { id: "active", label: "Đã duyệt" },
            { id: "rejected", label: "Từ chối" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                filter === tab.id
                  ? "bg-[#a5190e] text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey="_id"
            pagination={{ pageSize: 8 }}
            className="border border-gray-100 rounded-lg"
          />
        </div>

        {/* Rejection Modal */}
        <Modal
          title="Xác nhận từ chối đối tác"
          open={isModalOpen}
          onOk={handleReject}
          onCancel={() => setIsModalOpen(false)}
          okText="Xác nhận từ chối"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <div className="py-4">
            <p className="mb-4">
              Bạn có chắc muốn từ chối đối tác:{" "}
              <strong>{selectedPartner?.businessName}</strong>?
            </p>
            <TextArea
              rows={4}
              placeholder="Nhập lý do từ chối..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default Partners;

