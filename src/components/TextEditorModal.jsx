/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Editor from "../lib/text-editor/react-advanced-richtext-editor.esm.js";
import "@webbycrown/react-advanced-richtext-editor/dist/styles.css";
import "../lib/text-editor/styles.css";
import {
  Button,
  Card,
  Modal,
  Select,
  Input,
  Form,
  Image,
  Upload,
  message,
  Spin,
} from "antd";
import { Plus, Trash2, Eye, Edit, UploadCloud } from "lucide-react";
import "./textModal.css";
import {
  createNewPost,
  getAactiveDestinations,
} from "../services/adminService.js";
import { uploadToCloudinary } from "../services/cloundinaryService.js";

export default function TextEditorModal({
  isOpenModal,
  onCloseModal,
  initialContent,
  getPosts,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(initialContent || "");
  const [destinations, setDestinations] = useState([]);
  const [selectedDest, setSelectedDest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [banner, setBanner] = useState({ title: "", image: "", alt: "" });
  const [imageList, setImageList] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Hàm xử lý upload chung
  const handleCustomUpload = async (file, callback) => {
    setUploading(true);
    const url = await uploadToCloudinary(file);
    if (url) {
      callback(url);
      message.success("Tải ảnh lên thành công!");
    } else {
      message.error("Tải ảnh lên thất bại.");
    }
    setUploading(false);
    return false;
  };

  const handleAddGalleryImage = async (values) => {
    const file = values.image.file;
    setUploading(true);
    const url = await uploadToCloudinary(file);
    if (url) {
      setImageList([...imageList, { ...values, image: url, id: Date.now() }]);
      form.resetFields();
      setIsImageModalOpen(false);
    }
    setUploading(false);
  };

  const getDestinations = async () => {
    try {
      const data = await getAactiveDestinations();
      setDestinations(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDestinations();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await createNewPost({
        title,
        banner,
        content,
        destinationId: selectedDest,
        gallery: imageList,
      });
      message.success("Lưu bài viết thành công!");
      onCloseModal();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Chỉnh sửa bài viết"
        open={isOpenModal}
        footer={[
          <Button key="back" onClick={onCloseModal}>
            Hủy bỏ
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            Lưu bài viết
          </Button>,
        ]}
        width={1400}
        centered
        onCancel={onCloseModal}
      >
        <div className="flex gap-6 h-[75vh]">
          {/* LEFT SIDE - CONFIG */}
          <div className="w-1/3 overflow-y-auto pr-2 space-y-4">
            <div>
              <label className="font-semibold block mb-1">
                Tiêu đề bài viết
              </label>
              <Input
                placeholder="Nhập tiêu đề..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="border rounded-lg p-3 bg-gray-50 space-y-3">
              <label className="font-semibold block">Banner bài viết</label>
              <Input
                placeholder="Tiêu đề banner"
                value={banner.title}
                onChange={(e) =>
                  setBanner({ ...banner, title: e.target.value })
                }
              />

              <Upload
                listType="picture-card"
                showUploadList={false}
                beforeUpload={(file) =>
                  handleCustomUpload(file, (url) =>
                    setBanner({ ...banner, image: url }),
                  )
                }
              >
                {banner.image ? (
                  <img
                    src={banner.image}
                    alt="banner"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                ) : (
                  <div>
                    {uploading ? <Spin /> : <UploadCloud size={20} />}
                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                  </div>
                )}
              </Upload>

              <Input
                placeholder="Mô tả ảnh (Alt)"
                value={banner.alt}
                onChange={(e) => setBanner({ ...banner, alt: e.target.value })}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Điểm đến</label>
              <Select
                showSearch
                className="w-full"
                placeholder="Chọn điểm đến"
                onChange={(value) => setSelectedDest(value)}
                options={destinations.map((d) => ({
                  value: d._id,
                  label: d.name,
                }))}
              />
            </div>

            <div>
              <Button
                type="dashed"
                onClick={() => setIsImageModalOpen(true)}
                icon={<Plus size={16} />}
                block
              >
                Thêm ảnh gallery
              </Button>

              <div className="mt-3 flex flex-wrap gap-2">
                {imageList.map((img) => (
                  <div key={img.id} className="relative group">
                    <Image
                      src={img.image}
                      width={64}
                      height={64}
                      className="rounded object-cover"
                    />
                    <button
                      onClick={() =>
                        setImageList(imageList.filter((i) => i.id !== img.id))
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - EDITOR */}
          <div className="w-2/3 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold">
                {previewMode ? "Xem trước" : "Soạn thảo"}
              </label>
              <Button
                icon={previewMode ? <Edit size={16} /> : <Eye size={16} />}
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? "Chỉnh sửa" : "Xem trước"}
              </Button>
            </div>
            <Card className="flex-1 overflow-hidden">
              {previewMode ? (
                <div
                  dangerouslySetInnerHTML={{ __html: content }}
                  className="post-content overflow-y-auto h-full"
                />
              ) : (
                <Editor value={content} onChange={setContent} />
              )}
            </Card>
          </div>
        </div>
      </Modal>

      {/* MODAL THÊM ẢNH GALLERY */}
      <Modal
        title="Tải ảnh lên Gallery"
        open={isImageModalOpen}
        onCancel={() => setIsImageModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={uploading}
      >
        <Form form={form} layout="vertical" onFinish={handleAddGalleryImage}>
          <Form.Item
            name="image"
            label="Chọn ảnh"
            rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1} listType="picture">
              <Button icon={<UploadCloud size={16} />}>
                Chọn file từ máy tính
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item name="alt" label="Mô tả ảnh" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: Cảnh biển lúc hoàng hôn" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
