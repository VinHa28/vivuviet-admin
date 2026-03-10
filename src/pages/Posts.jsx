/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Sidebar from "../dashboard/SideBar";

import { Button, Space, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "../services/adminService.js";
import ImageModal from "../components/ImageModal.jsx";
import { Edit } from "lucide-react";
import TextEditorModal from "../components/TextEditorModal.jsx";

export default function Posts() {
  // const [content, setContent] = useState("");
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentGallery, setCurrentGallery] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [isOpenEditorModal, setIsOpenEditorModal] = useState(false);

  // const filteredData = [];
  const [loading, setLoading] = useState(false);

  const getPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Title",
      key: "title",
      render: (_, record) => (
        <div>
          <div className="font-bold text-gray-900">{record.title || "N/A"}</div>
        </div>
      ),
    },
    {
      title: "Banner",
      dataIndex: "banner",
      key: "banner",
      render: (_, record) => (
        <img src={record.banner.image} className="w-[100px]" alt={record.alt} />
      ),
    },
    {
      title: "Người viết",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (_, record) =>
        record.postType === "system" ? (
          <span>Hệ thống</span>
        ) : (
          <span>{record.createdBy?.fullName || "N/A"}</span>
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
      title: "Ngày viết",
      dataIndex: "postedDate",
      key: "postedDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày đăng",
      dataIndex: "postedDate",
      key: "postedDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thư viện",
      dataIndex: "gallery",
      key: "gallery",
      render: (_, record) =>
        record.gallery ? (
          <button
            className="text-blue-500 hover:underline cursor-pointer"
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
        <Space size="middle">
          {record.status === "approved" && (
            <Button
              type="primary"
              icon={<Edit size={14} />}
              size="small"
              onClick={() => setCurrentPost(record)}
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
              >
                Duyệt
              </Button>
              <Button
                danger
                icon={<XCircle size={16} />}
                className="flex items-center bg-[#a5190e] hover:opacity-90"
              >
                Từ chối
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    getPosts();
  }, []);
  return (
    <div className="flex min-h-screen bg-[#F9FAFE]">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#252525] mb-2">
            Quản lý bài đăng
          </h1>
          <p className="text-gray-600">
            Duyệt và quản lý các dịch vụ từ đối tác
          </p>
        </div>
        <div>
          <Button
            onClick={() => setIsOpenEditorModal(true)}
            children="Tạo bài viết mới"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <Table
            columns={columns}
            dataSource={posts}
            loading={loading}
            rowKey="_id"
            pagination={{ pageSize: 8 }}
            className="border border-gray-100 rounded-lg"
          />
        </div>
      </main>

      <ImageModal
        isGalleryOpen={isGalleryOpen}
        setIsGalleryOpen={setIsGalleryOpen}
        currentGallery={currentGallery}
      />

      <TextEditorModal
        isOpenModal={isOpenEditorModal}
        onCloseModal={() => {
          setIsOpenEditorModal(false);
          getPosts();
        }}
        getPosts={getPosts}
      >
        Da lang nhang dung yeu anh voi
      </TextEditorModal>
    </div>
  );
}
