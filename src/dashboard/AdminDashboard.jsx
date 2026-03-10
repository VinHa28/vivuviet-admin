import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  ExternalLink,
  Eye,
  Bell,
  UserCheck,
  FileText,
  Layout,
  Globe,
} from "lucide-react";
import {
  Table,
  Tag,
  Button,
  Avatar,
  Space,
  Tooltip,
  Input,
  Popconfirm,
  message,
  Modal,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

// Services & Components
import Sidebar from "./SideBar";
import NotificationModal from "./NotificationModal";
import {
  approvePartner,
  getAdminStats,
  getAllPartners,
  getNotifications,
} from "../services/adminService";
import { getCurrentUser } from "../services/authService";

import "./AdminDashboard.scss";

const { TextArea } = Input;

const AdminDashboard = () => {
  // States
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openNotif, setOpenNotif] = useState(false);
  const [loading, setLoading] = useState(true);
  const [partnersData, setPartnersData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [stats, setStats] = useState({
    activeDestinations: 0,
    posts: { total: 0, pending: 0 },
    services: { total: 0, pending: 0 },
    users: { total: 0, pending: 0 },
  });

  // Rejection Modal States
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submittingReject, setSubmittingReject] = useState(false);

  const navigate = useNavigate();

  // Initial Fetch
  useEffect(() => {
    fetchData();
    // Polling thông báo mỗi 1 phút
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchPartners(), fetchNotifications()]);
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchPartners = async () => {
    try {
      const data = await getAllPartners();
      setPartnersData(data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      // Data format: { notifications: [], unreadCount: X }
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Logic phê duyệt
  const handleApprove = async (partnerId) => {
    try {
      await approvePartner(partnerId, "active");
      message.success("Đã phê duyệt đối tác thành công");
      fetchData(); // Refresh toàn bộ data
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi phê duyệt");
    }
  };

  // Logic từ chối (Mở modal)
  const showRejectModal = (partner) => {
    setSelectedPartner(partner);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      return message.warning("Vui lòng nhập lý do từ chối để gửi cho đối tác");
    }

    setSubmittingReject(true);
    try {
      await approvePartner(selectedPartner._id, "inactive", rejectionReason);
      message.success(`Đã từ chối đối tác ${selectedPartner.businessName}`);
      setIsRejectModalOpen(false);
      fetchData();
    } catch (error) {
      message.error(error.message || "Lỗi khi cập nhật trạng thái");
    } finally {
      setSubmittingReject(false);
    }
  };

  // Helpers
  const getPackageColor = (tier) => {
    const colors = {
      premium: "#a5190e",
      standard: "#f59e0b",
      basic: "#6b7280",
    };
    return colors[tier?.toLowerCase()] || "#6b7280";
  };

  const getStatusTag = (status) => {
    const configs = {
      active: { color: "success", text: "Đang hoạt động" },
      pending: { color: "warning", text: "Chờ duyệt" },
      inactive: { color: "default", text: "Từ chối/Tạm dừng" },
    };
    const config = configs[status] || configs.inactive;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: "Đối tác",
      dataIndex: "businessName",
      key: "businessName",
      width: 220,
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.logo}
            size={45}
            shape="square"
            className="rounded border"
          />
          <div>
            <div className="font-bold text-[#252525] text-sm">{text}</div>
            <div className="text-[11px]">{getStatusTag(record.status)}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Gói dịch vụ",
      dataIndex: "partnerTier",
      key: "partnerTier",
      width: 120,
      render: (tier) => (
        <Tag
          color={getPackageColor(tier)}
          className="font-bold uppercase text-[10px] px-3"
        >
          {tier || "Basic"}
        </Tag>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_, record) => (
        <div className="text-[12px]">
          <div className="font-medium text-gray-700">{record.email}</div>
          <div className="text-gray-400">{record.phone || "---"}</div>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<Eye size={14} />}
              size="small"
              onClick={() => navigate(`/partners/details/${record._id}`)}
            />
          </Tooltip>

          {record.status === "pending" && (
            <>
              <Popconfirm
                title="Phê duyệt đối tác này?"
                onConfirm={() => handleApprove(record._id)}
              >
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  className="bg-green-500 border-green-500 hover:bg-green-600"
                />
              </Popconfirm>
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => showRejectModal(record)}
              />
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
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#252525]">
            Quản trị hệ thống
          </h2>

          <div className="flex items-center gap-5">
            <div className="relative">
              <div
                onClick={() => setOpenNotif(!openNotif)}
                className="bg-white p-2.5 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-all relative"
              >
                <Bell size={20} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <NotificationModal
                open={openNotif}
                onClose={() => setOpenNotif(false)}
                notifications={notifications}
                inline={true}
              />
            </div>

            <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-lg shadow-sm border border-gray-100">
              <Avatar src={getCurrentUser().logo} className="bg-[#a5190e]" />
              <div className="text-xs">
                <p className="font-bold m-0">{getCurrentUser().email}</p>
                <p className="text-gray-400 m-0">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Tổng đối tác"
            value={stats.users.total}
            sub={`${stats.users.pending} đang chờ`}
            icon={<UserCheck className="text-blue-500" />}
            color="blue"
          />
          <StatCard
            title="Dịch vụ"
            value={stats.services.total}
            sub={`${stats.services.pending} chờ duyệt`}
            icon={<Layout className="text-amber-500" />}
            color="amber"
          />
          <StatCard
            title="Bài viết"
            value={stats.posts.total}
            sub={`${stats.posts.pending} chờ duyệt`}
            icon={<FileText className="text-red-500" />}
            color="red"
          />
          <StatCard
            title="Điểm đến"
            value={stats.activeDestinations}
            sub="Trên 34 tỉnh thành"
            icon={<Globe className="text-green-500" />}
            color="green"
          />
        </div>

        {/* Main Content Table */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg">Quản lý đối tác</h3>
            <Input
              placeholder="Tìm tên, email hoặc SĐT..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className="max-w-xs rounded-md"
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={partnersData.filter(
              (p) =>
                p.businessName
                  ?.toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                p.email?.toLowerCase().includes(searchText.toLowerCase()),
            )}
            loading={loading}
            pagination={{ pageSize: 8 }}
            className="custom-table"
          />
        </section>
      </main>

      {/* Reject Modal */}
      <Modal
        title={<span className="text-red-600 font-bold">Từ chối đối tác</span>}
        open={isRejectModalOpen}
        onOk={handleConfirmReject}
        onCancel={() => setIsRejectModalOpen(false)}
        confirmLoading={submittingReject}
        okText="Xác nhận & Gửi Email"
        cancelText="Hủy bỏ"
        okButtonProps={{ danger: true }}
      >
        <div className="py-3">
          <p className="text-sm mb-4">
            Bạn đang thực hiện từ chối đối tác:{" "}
            <strong>{selectedPartner?.businessName}</strong>. Vui lòng nhập lý
            do cụ thể để đối tác có thể cập nhật lại hồ sơ.
          </p>
          <TextArea
            rows={4}
            placeholder="Ví dụ: Hình ảnh logo không hợp lệ hoặc thông tin liên hệ không chính xác..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <p className="text-[11px] text-gray-400 mt-2 italic">
            * Nội dung này sẽ được gửi trực tiếp đến email của đối tác.
          </p>
        </div>
      </Modal>
    </div>
  );
};

// Sub-component cho Stat Card
const StatCard = ({ title, value, sub, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">
          {title}
        </p>
        <h2 className="text-3xl font-bold text-[#252525] mt-1">{value}</h2>
        <p className="text-[12px] text-gray-500 mt-1">{sub}</p>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-50`}>{icon}</div>
    </div>
  </div>
);

export default AdminDashboard;
