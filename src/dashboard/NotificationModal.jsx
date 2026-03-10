import React, { useEffect, useRef } from "react";

const NotificationModal = ({
  open,
  onClose,
  notifications = [],
  inline = false,
}) => {
  const ref = useRef(null);

  // Hàm định dạng thời gian đơn giản
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return date.toLocaleDateString("vi-VN");
  };

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
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, inline, onClose]);

  if (!open) return null;

  const containerClass = inline
    ? "absolute mt-2 right-0 z-50 w-[350px]"
    : "fixed inset-0 z-50 flex items-center justify-center bg-black/40";

  return (
    <div className={containerClass} role="dialog">
      <div
        ref={ref}
        className="bg-white rounded-lg p-4 shadow-2xl border border-gray-100 flex flex-col max-h-[500px]"
      >
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 className="text-lg font-bold text-[#252525]">Thông báo mới</h3>
          <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">
            {notifications.filter((n) => !n.isRead).length}
          </span>
        </div>

        <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-3 rounded-md transition-colors cursor-pointer ${n.isRead ? "bg-white hover:bg-gray-50" : "bg-blue-50/50 hover:bg-blue-50 border-l-4 border-blue-500"}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p
                      className={`text-sm ${!n.isRead ? "font-bold" : "font-semibold"} text-[#252525]`}
                    >
                      {n.title}
                    </p>
                    <p className="text-[12px] text-[#555] mt-1 leading-snug">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-[#999] mt-2 uppercase font-medium">
                      {formatTime(n.createdAt)}
                    </p>
                  </div>
                  {!n.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-gray-400 text-sm">
              Không có thông báo nào
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-md bg-[#a5190e] text-white font-semibold text-sm hover:bg-[#8e150c] transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
