import axios from "../lib/axios";

export const getAdminStats = async () => {
  const response = await axios.get("/admin/stats");
  return response.data.data;
};

export const getServices = async (params = {}) => {
  const response = await axios.get("/admin/services", { params });
  return response.data;
};

export const getUsers = async (params = {}) => {
  const response = await axios.get("/admin/users", { params });
  return response.data.data;
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

// Partner
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

// Post
export const getAllPosts = async () => {
  const res = await axios.get(`/admin/posts`);
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

export const updatePost = async (postData, id) => {
  try {
    const response = await axios.put(`/admin/posts/${id}`, postData);
    return response.data;
  } catch (error) {
    console.error("Create post error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Lỗi khi tạo bài viết" };
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`/admin/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Delete post error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Lỗi khi xóa bài viết" };
  }
};

export const updatePostStatus = async (postId, status) => {
  try {
    const response = await axios.patch(`/admin/posts/${postId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Update status error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || { message: "Lỗi khi cập nhật trạng thái" };
  }
};
// Destination
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

export const getAactiveDestinations = async () => {
  const res = await axios.get(`/destinations/list`);
  return res.data;
};

// Services
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
