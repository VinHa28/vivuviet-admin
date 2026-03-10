import axios from "../lib/axios";

export const getAdminStats = async () => {
  const response = await axios.get("/admin/stats");
  return response.data.data;
};

export const updatePartnerStatus = async (
  partnerId,
  status,
  rejectionReason = "",
) => {
  const response = await axios.patch(`/partners/requests/${partnerId}`, {
    status,
    rejectionReason,
  });
  return response.data.data;
};

export const getServices = async (params = {}) => {
  const response = await axios.get("/admin/services", { params });
  return response.data;
};

export const updateServiceStatus = async (
  serviceId,
  status,
  rejectionReason = "",
) => {
  const response = await axios.patch(`/admin/services/${serviceId}`, {
    status,
    rejectionReason,
  });
  return response.data.data;
};

export const getUsers = async (params = {}) => {
  const response = await axios.get("/admin/users", { params });
  return response.data.data;
};

export const getAllPartners = async () => {
  const response = await axios.get(`/admin/partners`);
  return response.data.data;
};

export const getPartnerStats = async (id) => {
  const res = await axios.get(`/admin/partners/${id}`);
  return res.data;
};

export const getPartnerService = async (id) => {
  const res = await axios.get(`/admin/partners/${id}/services`);
  return res.data;
};

export const getAllPosts = async () => {
  const res = await axios.get(`/admin/posts`);
  return res.data;
};

export const getAactiveDestinations = async () => {
  const res = await axios.get(`/destinations/list`);
  return res.data;
};

export const createNewPost = async (postData) => {
  try {
    const response = await axios.post("/admin/posts", postData);
    return response.data;
  } catch (error) {
    console.error("Create post error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Lỗi khi tạo bài viết" };
  }
};

export const getNotifications = async () => {
  try {
    const response = await axios.get("/notifications");
    return response.data;
  } catch (error) {
    console.error(
      "Fetching notifications error",
      error.response?.data || error.message,
    );
    throw (
      error.response?.data || { message: "Lỗi khi lấy danh sách thông báo" }
    );
  }
};

export const approvePartner = async (userId, status) => {
  try {
    const response = await axios.patch(
      `/admin/partners/update-status/${userId}`,
      { status },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Updating partner error:",
      error.response?.data || error.message,
    );

    throw (
      error.response?.data || {
        message: "Không thể cập nhật trạng thái đối tác",
      }
    );
  }
};

export const getDestinations = async () => {
  try {
    const response = await axios.get("/admin/destinations");
    return response.data;
  } catch (error) {
    console.error(
      "Fetching destination error:",
      error.response?.data || error.message,
    );
  }
};

export const updateDestination = async (code, data) => {
  try {
    const response = await axios.patch(`/admin/destinations/${code}`, data);
    return response.data; 
  } catch (error) {
    console.error(
      "Updating destination error:",
      error.response?.data || error.message,
    );
  }
};
