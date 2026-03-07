import { MapPin, ExternalLink, Eye } from "lucide-react";
import Sidebar from "./SideBar";
import { useState, useEffect } from "react";
import NotificationModal from "./NotificationModal";
import { getAdminStats, getAllPartners } from "../services/adminService";
import { getCurrentUser } from "../services/authService";
import { Table, Tag, Button, Avatar, Space, Tooltip, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [openNotif, setOpenNotif] = useState(false);
  const [stats, setStats] = useState({
    activeDestinations: 0,
    posts: { total: 0, pending: 0 },
    services: { total: 0, pending: 0 },
    users: { total: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [partnersData, setPartnersData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchPartners();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
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

  const getPackageColor = (packageType) => {
    const colors = {
      premium: "#a5190e",
      standard: "#f59e0b",
      basic: "#6b7280",
    };
    return colors[packageType] || "#6b7280";
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      active: { color: "success", text: "Đang hoạt động" },
      pending: { color: "warning", text: "Chờ duyệt" },
      inactive: { color: "default", text: "Tạm dừng" },
    };
    const config = statusConfig[status] || statusConfig.inactive;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: "Đối tác",
      dataIndex: "businessName",
      key: "businessName",
      width: 280,
      filteredValue: [searchText],
      onFilter: (value, record) =>
        record.businessName?.toLowerCase().includes(value.toLowerCase()) ||
        record.email?.toLowerCase().includes(value.toLowerCase()) ||
        record.phone?.toLowerCase().includes(value.toLowerCase()) ||
        record.partnerTier?.toLowerCase().includes(value.toLowerCase()),
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.logo}
            size={48}
            shape="square"
            className="rounded-lg border border-gray-200"
          />
          <div>
            <div className="font-semibold text-[#252525] text-sm">{text}</div>
            <div className="text-xs text-[#848484]">
              {getStatusTag(record.status)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Gói đối tác",
      dataIndex: "partnerTier",
      key: "partnerTier",
      width: 140,
      sorter: (a, b) => {
        const order = { premium: 3, standard: 2, basic: 1 };
        return order[a.partnerTier] - order[b.partnerTier];
      },
      render: (text) => {
        const label = text
          ? text.charAt(0).toUpperCase() + text.slice(1)
          : "Basic";
        return (
          <Tag
            color={getPackageColor(text)}
            style={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "4px 12px",
              border: "none",
            }}
          >
            {label}
          </Tag>
        );
      },
    },
    {
      title: "Liên kết",
      key: "links",
      width: 140,
      render: (_, record) => (
        <Space size="small">
          {record.fanpage && (
            <Tooltip title="Fanpage">
              <a
                href={record.fanpage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </Tooltip>
          )}
          {record.website && (
            <Tooltip title="Website">
              <a
                href={record.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: "Bài viết",
      dataIndex: "totalPosts",
      key: "totalPosts",
      width: 100,
      sorter: (a, b) => a.totalPosts - b.totalPosts,
      render: (text) => (
        <div className="text-center font-semibold text-[#252525]">{text}</div>
      ),
    },
    {
      title: "Dịch vụ",
      dataIndex: "totalServices",
      key: "totalServices",
      width: 100,
      sorter: (a, b) => a.totalServices - b.totalServices,
      render: (text) => (
        <div className="text-center font-semibold text-[#252525]">{text}</div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<Eye size={14} />}
          size="small"
          onClick={() => handleViewDetails(record)}
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
      ),
    },
  ];

  const handleViewDetails = (record) => {
    navigate(`/partners/details/${record._id}`);
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFE] font-sans text-[#252525]">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div className="w-1/2 relative"></div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setOpenNotif((s) => !s)}
                className="bg-white p-2.5 rounded-md shadow-sm cursor-pointer relative"
              >
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                <div className="text-gray-500">🔔</div>
              </div>
              <NotificationModal
                open={openNotif}
                onClose={() => setOpenNotif(false)}
                inline={true}
              />
            </div>
            <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-md shadow-sm">
              <img
                src={
                  getCurrentUser().logo ||
                  "https://p1.hiclipart.com/preview/666/472/877/person-user-profile-avatar-logo-blackandwhite-symbol-circle-png-clipart.jpg"
                }
                className="w-10 h-10 rounded-md object-cover"
                alt="Admin"
              />
              <div>
                <p className="text-xs font-bold leading-none">
                  {getCurrentUser().email}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 space-y-10">
            {/* Statistics Section */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold text-[#252525]">
                  Thông tin tổng quan
                </h3>
                <button className="text-[#a5190e] text-sm font-semibold hover:underline">
                  Xem chi tiết
                </button>
              </div>

              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-50">
                  <p className="text-[10px] text-[#848484] uppercase font-semibold">
                    Số lượng Đối Tác
                  </p>
                  <h2 className="text-3xl font-bold text-[#a5190e] mt-2">
                    {loading ? "..." : stats.users.total}
                  </h2>
                  <p className="text-[12px] text-[#848484] mt-2">
                    {loading ? "" : `${stats.users.pending} chờ duyệt`}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-50">
                  <p className="text-[10px] text-[#848484] uppercase font-semibold">
                    Số dịch vụ đang hoạt động
                  </p>
                  <h2 className="text-3xl font-bold text-[#a5190e] mt-2">
                    {loading ? "..." : stats.services.total}
                  </h2>
                  <p className="text-[12px] text-[#848484] mt-2">
                    <span className="text-[#a5190e]">
                      {stats.services.pending}
                    </span>{" "}
                    chờ duyệt
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-50">
                  <p className="text-[10px] text-[#848484] uppercase font-semibold">
                    Số bài viết
                  </p>
                  <h2 className="text-3xl font-bold text-[#a5190e] mt-2">
                    {loading ? "..." : stats.posts.total}
                  </h2>
                  <p className="text-[12px] text-[#848484] mt-2">
                    <span className="text-[#a5190e]">
                      {stats.posts.pending}
                    </span>{" "}
                    chờ duyệt
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-50">
                  <p className="text-[10px] text-[#848484] uppercase font-semibold">
                    Địa điểm đang hoạt động
                  </p>
                  <h2 className="text-3xl font-bold text-[#a5190e] mt-2">
                    {loading ? "..." : stats.activeDestinations}
                  </h2>
                  <p className="text-[12px] text-[#848484] mt-2">
                    Còn{" "}
                    <span className="text-[#a5190e]">
                      {34 - stats.activeDestinations}{" "}
                    </span>
                    tỉnh/thành
                  </p>
                </div>
              </div>
            </section>

            {/* Partners Table Section */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold text-[#252525]">
                  Danh sách đối tác
                </h3>
                <Input
                  placeholder="Tìm kiếm đối tác..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{
                    width: 280,
                    borderRadius: "8px",
                  }}
                  allowClear
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-50 overflow-hidden">
                <Table
                  columns={columns}
                  dataSource={partnersData}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} đối tác`,
                    style: { marginRight: "16px" },
                  }}
                  scroll={{ x: 1000 }}
                  className="partners-table"
                  style={{
                    fontSize: "13px",
                  }}
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .partners-table .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
          font-size: 12px;
          color: #252525;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          padding: 16px;
        }

        .partners-table .ant-table-tbody > tr > td {
          padding: 14px 16px;
        }

        .partners-table .ant-table-tbody > tr:hover > td {
          background-color: #fafafa !important;
        }

        .partners-table .ant-pagination-item-active {
          border-color: #a5190e;
        }

        .partners-table .ant-pagination-item-active a {
          color: #a5190e;
        }

        .partners-table .ant-pagination-item:hover {
          border-color: #a5190e;
        }

        .partners-table .ant-pagination-item:hover a {
          color: #a5190e;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
