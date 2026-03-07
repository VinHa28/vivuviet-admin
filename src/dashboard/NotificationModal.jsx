import React, { useEffect, useRef } from "react";

const NotificationModal = ({ open, onClose, notifications = [], inline = false }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !inline) return;
    const onDocClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, inline, onClose]);

  if (!open) return null;

  const defaultNotifs = [
    { id: 1, title: "Yêu cầu đối tác mới", time: "2 giờ trước", body: "Có một yêu cầu đăng ký đối tác cần phê duyệt." },
    { id: 2, title: "Bài đăng bị báo cáo", time: "1 ngày trước", body: "Bài đăng #223 đã bị báo cáo bởi người dùng." },
  ];

  const items = notifications.length ? notifications : defaultNotifs;

  const containerClass = inline
    ? "absolute mt-2 right-0 z-50 w-[320px]"
    : "fixed inset-0 z-50 flex items-center justify-center bg-black/40";

  const panelClass = inline
    ? "bg-white rounded-md p-4 shadow-lg"
    : "bg-white rounded-md w-full max-w-md p-6 shadow-lg";

  return (
    <div className={containerClass} role="dialog" aria-modal={!inline}>
      <div ref={ref} className={panelClass} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-[#252525]">Thông báo</h3>
          <button
            onClick={onClose}
            aria-label="Đóng thông báo"
            className="text-[#848484] hover:text-[#252525]"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-auto">
          {items.map((n) => (
            <div key={n.id} className="p-3 rounded-md bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-[#252525]">{n.title}</p>
                  <p className="text-[13px] text-[#848484] mt-1">{n.body}</p>
                </div>
                <div className="text-xs text-[#848484] ml-3">{n.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-right">
          <button onClick={onClose} className="px-3 py-1.5 rounded-md bg-[#a5190e] text-white">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
