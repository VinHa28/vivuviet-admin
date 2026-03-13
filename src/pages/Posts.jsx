/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../dashboard/SideBar";
import { Button, message, Space, Table, Tag, Modal, Input, Select } from "antd";
import {
  deletePost,
  getAllPosts,
  updatePostStatus,
} from "../services/adminService.js";
import ImageModal from "../components/ImageModal.jsx";
import TextEditorModal from "../components/TextEditorModal.jsx";
import { CheckCheck, Edit, Trash2, XCircle, Search } from "lucide-react";
const { Option } = Select;
export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentGallery, setCurrentGallery] = useState([]);

  const [currentPost, setCurrentPost] = useState(null);
  const [isOpenEditorModal, setIsOpenEditorModal] = useState(false);

  // FETCH POSTS
  const getPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data);
    } catch (error) {
      message.error("Không thể tải bài viết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  // ACTIONS
  const handleStatusUpdate = async (id, status) => {
    try {
      setLoading(true);
      await updatePostStatus(id, status);
      message.success("Cập nhật trạng thái thành công");
      getPosts();
    } catch (error) {
      message.error(error.message || "Thao tác thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      setLoading(true);
      await deletePost(id);
      message.success("Xóa bài viết và hình ảnh liên quan");
      getPosts();
    } catch (error) {
      message.error("Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };

  // CONFIRM MODAL
  const confirmAction = ({ title, content, onOk }) => {
    Modal.confirm({
      title,
      content,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk,
    });
  };

  const filteredPosts = useMemo(() => {
    let data = [...posts];

    if (searchText) {
      data = data.filter((p) =>
        p.title?.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((p) => p.status === statusFilter);
    }

    return data;
  }, [posts, searchText, statusFilter]);

  // TABLE COLUMNS
  const columns = [
    {
      title: "Title",
      key: "title",
      render: (_, record) => (
        <div className="font-semibold text-gray-800">
          {record.title || "N/A"}
        </div>
      ),
    },
    {
      title: "Banner",
      key: "banner",
      render: (_, record) => (
        <img
          src={record.banner?.image}
          className="w-24 rounded"
          alt={record.banner?.alt}
        />
      ),
    },
    {
      title: "Người viết",
      key: "createdBy",
      render: (_, record) =>
        record.postType === "system"
          ? "Hệ thống"
          : record.createdBy?.fullName || "N/A",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (status, record) => {
        const config = {
          pending: { color: "warning", text: "Chờ duyệt" },
          approved: { color: "success", text: "Đã duyệt" },
          rejected: { color: "error", text: "Từ chối" },
        };

        return (
          <Tag color={config[record.status]?.color}>
            {config[record.status]?.text}
          </Tag>
        );
      },
    },
    {
      title: "Ngày viết",
      key: "postedDate",
      render: (_, record) =>
        new Date(record.postedDate).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thư viện",
      key: "gallery",
      render: (_, record) =>
        record.gallery?.length ? (
          <button
            className="text-blue-500 hover:underline"
            onClick={() => {
              setCurrentGallery(record.gallery);
              setIsGalleryOpen(true);
            }}
          >
            {record.gallery.length} ảnh
          </button>
        ) : (
          0
        ),
    },
    {
      title: "HÀNH ĐỘNG",
      key: "action",
      render: (_, record) => (
        <Space orientation="vertical" size="small">
          <Button
            type="primary"
            icon={<Edit size={14} />}
            size="small"
            onClick={() => {
              setCurrentPost(record);
              setIsOpenEditorModal(true);
            }}
          >
            Chi tiết
          </Button>

          {record.status === "pending" && (
            <>
              <Button
                size="small"
                icon={<CheckCheck size={14} />}
                className="bg-green-50 text-green-600 border-green-200 hover:bg-green-600 hover:text-white w-20"
                onClick={() =>
                  confirmAction({
                    title: "Duyệt bài viết?",
                    content: "Bạn có chắc chắn muốn duyệt bài viết này?",
                    onOk: () => handleStatusUpdate(record._id, "approved"),
                  })
                }
              >
                Duyệt
              </Button>

              <Button
                size="small"
                danger
                ghost
                icon={<XCircle size={14} />}
                onClick={() =>
                  confirmAction({
                    title: "Từ chối bài viết?",
                    content: "Bạn có chắc chắn muốn từ chối bài viết này?",
                    onOk: () => handleStatusUpdate(record._id, "rejected"),
                  })
                }
                className="w-20"
              >
                Từ chối
              </Button>
            </>
          )}

          {record.status === "approved" && (
            <Button
              size="small"
              danger
              icon={<Trash2 size={14} />}
              onClick={() =>
                confirmAction({
                  title: "Xóa bài viết?",
                  content: "Hành động này không thể hoàn tác!",
                  onOk: () => handleDeletePost(record._id),
                })
              }
              className="w-20"
            >
              Xóa
            </Button>
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
          <h1 className="text-3xl font-bold mb-2">Quản lý bài đăng</h1>
          <p className="text-gray-600">
            Duyệt và quản lý các bài viết từ đối tác
          </p>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Tìm kiếm bài viết..."
            prefix={<Search size={16} />}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 180 }}
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="pending">Chờ duyệt</Option>
            <Option value="approved">Đã duyệt</Option>
            <Option value="rejected">Từ chối</Option>
          </Select>

          <Button type="primary" onClick={() => setIsOpenEditorModal(true)}>
            Tạo bài viết mới
          </Button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <Table
            columns={columns}
            dataSource={filteredPosts}
            loading={loading}
            rowKey="_id"
            pagination={{ pageSize: 8 }}
          />
        </div>
      </main>

      {/* IMAGE MODAL */}
      <ImageModal
        isGalleryOpen={isGalleryOpen}
        setIsGalleryOpen={setIsGalleryOpen}
        currentGallery={currentGallery}
      />

      {/* EDITOR MODAL */}
      <TextEditorModal
        isOpenModal={isOpenEditorModal}
        initialData={currentPost}
        onCloseModal={() => {
          setIsOpenEditorModal(false);
          setCurrentPost(null);
          getPosts();
        }}
      />
    </div>
  );
}
