import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../dashboard/SideBar";
import { Table, Tag, Tabs, Card, Statistic, Row, Col, Spin, Empty } from "antd";
import { Eye, FileText, Layout, Phone, Globe } from "lucide-react";
import { getPartnerStats } from "../services/adminService";
import { getTierColor, getTierLabel } from "../utils/formatHelper";

const { TabPane } = Tabs;

export default function PartnerDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPartnerStats(id);
        setData(res);
      } catch (error) {
        console.error("Error fetching partner details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  if (!data) return <Empty description="Không tìm thấy dữ liệu" />;

  const { partner, services, posts, statistics } = data;

  // Cấu hình bảng Dịch vụ
  const serviceColumns = [
    { title: "Tên dịch vụ", dataIndex: "name", key: "name" },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (t) => <Tag color="blue">{t.toUpperCase()}</Tag>,
    },
    {
      title: "Lượt xem",
      dataIndex: "views",
      key: "views",
      sorter: (a, b) => a.views - b.views,
      render: (v) => <b>{v || 0}</b>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => (
        <Tag color={s === "approved" ? "green" : "orange"}>{s}</Tag>
      ),
    },
  ];

  // Cấu hình bảng Bài viết
  const postColumns = [
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    {
      title: "Ngày đăng",
      dataIndex: "createdAt",
      render: (d) => new Date(d).toLocaleDateString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => (
        <Tag color={s === "approved" ? "green" : "volcano"}>{s}</Tag>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFE]">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        {/* Header Thông tin đối tác */}
        <Card className="mb-6 shadow-sm">
          <div className="flex items-center gap-6">
            <img
              src={partner.logo}
              alt="logo"
              className="w-20 h-20 rounded-lg object-cover border"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {partner.businessName}
                <Tag
                  color={getTierColor(partner.partnerTier)}
                  style={{ fontWeight: "600" }}
                >
                  {getTierLabel(partner.partnerTier)}
                </Tag>
              </h1>
              <div className="flex gap-4 mt-2 text-gray-500">
                <span className="flex items-center gap-1">
                  <Phone size={14} /> {partner.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Globe size={14} /> {partner.website || "N/A"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs ${partner.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  {partner.status?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Thống kê nhanh */}
        <Row gutter={16} className="mb-6 mt-6">
          <Col span={6}>
            <Card shadow-sm>
              <Statistic
                title="Tổng Dịch vụ"
                value={statistics.services.total}
                prefix={<Layout size={18} />}
                valueStyle={{ color: "#a5190e" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card shadow-sm>
              <Statistic
                title="Lượt xem hệ thống"
                value={statistics.services.totalViews}
                prefix={<Eye size={18} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card shadow-sm>
              <Statistic
                title="Bài viết"
                value={statistics.posts.total}
                prefix={<FileText size={18} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card shadow-sm>
              <Statistic
                title="Gói cước"
                value={getTierLabel(partner.partnerTier)}
              />
            </Card>
          </Col>
        </Row>

        {/* Tab Nội dung chi tiết */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Danh sách Dịch vụ" key="1">
              <Table
                dataSource={services}
                columns={serviceColumns}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
              />
            </TabPane>
            <TabPane tab="Bài viết đã đăng" key="2">
              <Table
                dataSource={posts}
                columns={postColumns}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
              />
            </TabPane>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
