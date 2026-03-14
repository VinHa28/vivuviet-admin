import { useEffect, useState } from "react";
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
} from "antd";
import { Plus, Trash2, Eye, Edit, UploadCloud } from "lucide-react";
import "./textModal.css";
import {
  createNewPost,
  updatePost,
  getAactiveDestinations,
} from "../services/adminService.js";

export default function TextEditorModal({
  isOpenModal,
  onCloseModal,
  initialData, // Nhận dữ liệu bài viết khi bấm "Chi tiết"
}) {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // State cho Banner
  const [banner, setBanner] = useState({
    imagePreview: "",
    imageFile: null,
  });

  // State cho Gallery (kết hợp ảnh cũ và ảnh mới)
  const [imageList, setImageList] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [galleryForm] = Form.useForm();

  // 1. Khởi tạo dữ liệu khi mở Modal (Create vs Update)
  useEffect(() => {
    if (!isOpenModal) return;

    const fetchDestinations = async () => {
      const data = await getAactiveDestinations();
      setDestinations(data);
    };
    fetchDestinations();

    if (initialData) {
      setTimeout(() => {
        form.setFieldsValue({
          title: initialData.title,
          destinationId:
            initialData.destinationId?._id || initialData.destinationId,
          bannerTitle: initialData.banner?.title,
          bannerAlt: initialData.banner?.alt,
        });
      });

      setContent(initialData.content || "");
      setBanner({
        imagePreview: initialData.banner?.image || "",
        imageFile: null,
      });

      const existingGallery =
        initialData.gallery?.map((img, index) => ({
          id: `old-${index}`,
          preview: img.image,
          alt: img.alt,
          isExisting: true,
        })) || [];

      setImageList(existingGallery);
    } else {
      form.resetFields();
      setContent("");
      setBanner({ imagePreview: "", imageFile: null });
      setImageList([]);
    }
  }, [initialData, isOpenModal]);

  // 2. Xử lý ảnh Banner
  const handleBannerUpload = (file) => {
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error("Ảnh phải nhỏ hơn 3MB!");
      return Upload.LIST_IGNORE;
    }
    setBanner({
      imagePreview: URL.createObjectURL(file),
      imageFile: file,
    });
    return false;
  };

  // 3. Xử lý thêm ảnh vào Gallery
  const handleAddGalleryImage = (values) => {
    const file = values.image.file;
    const preview = URL.createObjectURL(file);
    setImageList([
      ...imageList,
      {
        id: Date.now(),
        imageFile: file,
        preview: preview,
        alt: values.alt,
        isExisting: false,
      },
    ]);
    galleryForm.resetFields();
    setIsImageModalOpen(false);
  };

  // 4. Gửi dữ liệu (Submit)
  const handleSubmit = async () => {
    try {
      // Validate Frontend
      const values = await form.validateFields();
      if (!content || content.trim() === "" || content === "<p><br></p>") {
        return message.error("Vui lòng nhập nội dung bài viết!");
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", content);
      formData.append("destinationId", values.destinationId);
      formData.append("bannerTitle", values.bannerTitle);
      formData.append("bannerAlt", values.bannerAlt);

      if (banner.imageFile) {
        formData.append("bannerImage", banner.imageFile);
      }

      // Tách ảnh Gallery cũ và mới
      const existingGallery = imageList
        .filter((img) => img.isExisting)
        .map((img) => ({ image: img.preview, alt: img.alt }));

      formData.append("existingGallery", JSON.stringify(existingGallery));

      imageList
        .filter((img) => !img.isExisting)
        .forEach((item) => {
          formData.append("galleryImages", item.imageFile);
          formData.append(`galleryAlts`, item.alt);
        });

      // Gọi API tương ứng
      if (initialData?._id) {
        await updatePost(formData, initialData._id);
        message.success("Cập nhật bài viết thành công!");
      } else {
        await createNewPost(formData);
        message.success("Tạo bài viết mới thành công!");
      }

      onCloseModal();
    } catch (error) {
      // Hiển thị lỗi từ Validate hoặc từ Backend trả về
      const errorMsg =
        error.response?.data?.message || error.message || "Có lỗi xảy ra!";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={initialData ? "Chi tiết bài viết" : "Tạo bài viết mới"}
      open={isOpenModal}
      onCancel={onCloseModal}
      width={1400}
      destroyOnHidden
      centered
      footer={[
        <Button key="cancel" onClick={onCloseModal}>
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {initialData ? "Cập nhật" : "Đăng bài"}
        </Button>,
      ]}
    >
      <div className="flex gap-6 h-[75vh]">
        {/* Cấu hình bên trái */}
        <div className="w-1/3 overflow-y-auto pr-2">
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label="Tiêu đề bài viết"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
            >
              <Input placeholder="Nhập tiêu đề..." />
            </Form.Item>

            <div className="p-3 bg-gray-50 rounded-lg border mb-4">
              <span className="font-semibold block mb-2">Banner chính</span>
              <Form.Item name="bannerTitle" label="Tiêu đề ảnh">
                <Input placeholder="VD: Cảnh đẹp Sapa" />
              </Form.Item>

              <Upload
                listType="picture-card"
                showUploadList={false}
                beforeUpload={handleBannerUpload}
              >
                {banner.imagePreview ? (
                  <img
                    src={banner.imagePreview}
                    alt="banner"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Plus className="mx-auto" />
                    <div className="mt-2">Chọn ảnh</div>
                  </div>
                )}
              </Upload>

              <Form.Item
                name="bannerAlt"
                label="Mô tả ảnh (Alt)"
                className="mt-2"
              >
                <Input placeholder="Mô tả cho SEO..." />
              </Form.Item>
            </div>

            <Form.Item
              name="destinationId"
              label="Điểm đến"
              rules={[{ required: true, message: "Vui lòng chọn địa điểm!" }]}
            >
              <Select
                showSearch
                placeholder="Chọn tỉnh thành"
                options={destinations.map((d) => ({
                  value: d._id,
                  label: d.name,
                }))}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <div className="mt-6">
              <Button
                type="dashed"
                block
                icon={<Plus size={16} />}
                onClick={() => setIsImageModalOpen(true)}
              >
                Thêm ảnh vào Gallery
              </Button>

              <div className="mt-4 flex flex-wrap gap-2">
                {imageList.map((img) => (
                  <div
                    key={img.id}
                    className="relative group border rounded p-1"
                  >
                    <Image
                      src={img.preview}
                      width={80}
                      height={80}
                      className="object-cover rounded"
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
          </Form>
        </div>

        {/* Soạn thảo bên phải */}
        <div className="w-2/3 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="font-semibold">Nội dung bài viết</label>
            <Button
              size="small"
              icon={previewMode ? <Edit size={14} /> : <Eye size={14} />}
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? "Quay lại chỉnh sửa" : "Xem trước hiển thị"}
            </Button>
          </div>
          <Card className="flex-1 overflow-hidden shadow-inner">
            {previewMode ? (
              <div
                dangerouslySetInnerHTML={{ __html: content }}
                className="post-content-preview h-full overflow-y-auto post-content"
              />
            ) : (
              <Editor value={content} onChange={setContent} />
            )}
          </Card>
        </div>
      </div>

      {/* Modal nhỏ thêm ảnh Gallery */}
      <Modal
        title="Thêm ảnh thư viện"
        open={isImageModalOpen}
        onCancel={() => setIsImageModalOpen(false)}
        onOk={() => galleryForm.submit()}
      >
        <Form
          form={galleryForm}
          layout="vertical"
          onFinish={handleAddGalleryImage}
        >
          <Form.Item
            name="image"
            label="Chọn tệp"
            rules={[{ required: true, message: "Cần chọn ảnh!" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1} listType="picture">
              <Button icon={<UploadCloud size={16} />}>Chọn từ thiết bị</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="alt"
            label="Mô tả ảnh"
            rules={[{ required: true, message: "Nhập mô tả ảnh!" }]}
          >
            <Input placeholder="VD: Ảnh chụp tại nhà thờ lớn" />
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  );
}
