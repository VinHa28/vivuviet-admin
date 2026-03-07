import { Image, Modal } from "antd";
import React from "react";

export default function ImageModal({
  isGalleryOpen,
  setIsGalleryOpen,
  currentGallery,
}) {
  return (
    <Modal
      title="Thư viện ảnh"
      open={isGalleryOpen}
      footer={null}
      onCancel={() => setIsGalleryOpen(false)}
      width={800}
    >
      <Image.PreviewGroup>
        <div className="grid grid-cols-3 gap-4">
          {currentGallery.map((item, index) => (
            <Image
              key={index}
              src={item?.image}
              alt={`gallery-${index}`}
              className="object-cover rounded-lg"
            />
          ))}
        </div>
      </Image.PreviewGroup>
    </Modal>
  );
}
