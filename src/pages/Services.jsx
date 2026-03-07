import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import Sidebar from "../dashboard/SideBar";
import { getServices, updateServiceStatus } from "../services/adminService";

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [selectedService, setSelectedService] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchServices();
    }, [filter]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const params = filter === "all" ? {} : { status: filter };
            const data = await getServices(params);
            setServices(data.data || []);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (serviceId) => {
        try {
            await updateServiceStatus(serviceId, "approved");
            fetchServices();
        } catch (error) {
            console.error("Error approving service:", error);
        }
    };

    const handleReject = async (serviceId, reason) => {
        try {
            await updateServiceStatus(serviceId, "rejected", reason);
            fetchServices();
            setShowModal(false);
        } catch (error) {
            console.error("Error rejecting service:", error);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-700",
            approved: "bg-green-100 text-green-700",
            rejected: "bg-red-100 text-red-700",
        };
        const labels = {
            pending: "Chờ duyệt",
            approved: "Đã duyệt",
            rejected: "Từ chối",
        };
        return { style: styles[status], label: labels[status] };
    };

    const getTypeBadge = (type) => {
        const colors = {
            tour: "bg-blue-100 text-blue-700",
            hotel: "bg-green-100 text-green-700",
            restaurant: "bg-orange-100 text-orange-700",
            transport: "bg-purple-100 text-purple-700",
            experience: "bg-pink-100 text-pink-700",
        };
        const labels = {
            tour: "Tour",
            hotel: "Khách sạn",
            restaurant: "Nhà hàng",
            transport: "Vận chuyển",
            experience: "Trải nghiệm",
        };
        return { style: colors[type] || "bg-gray-100 text-gray-700", label: labels[type] || type };
    };

    return (
        <div className="flex min-h-screen bg-[#F9FAFE]">
            <Sidebar />

            <main className="ml-64 flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#252525] mb-2">Quản lý Dịch vụ</h1>
                    <p className="text-gray-600">Duyệt và quản lý các dịch vụ từ đối tác</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-4 mb-6">
                    {["all", "pending", "approved", "rejected"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${filter === status
                                    ? "bg-[#a5190e] text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {status === "all" ? "Tất cả" :
                                status === "pending" ? "Chờ duyệt" :
                                    status === "approved" ? "Đã duyệt" : "Từ chối"}
                        </button>
                    ))}
                </div>

                {/* Services Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a5190e]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => {
                            const statusBadge = getStatusBadge(service.status);
                            const typeBadge = getTypeBadge(service.type);

                            return (
                                <div key={service._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    {/* Image */}
                                    <div className="relative h-48">
                                        <img
                                            src={service.images?.[0] || "https://via.placeholder.com/400x300"}
                                            alt={service.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${typeBadge.style}`}>
                                                {typeBadge.label}
                                            </span>
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusBadge.style}`}>
                                                {statusBadge.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{service.name}</h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {service.description || "Không có mô tả"}
                                        </p>

                                        <div className="flex justify-between items-center mb-3">
                                            <div>
                                                <span className="text-lg font-bold text-[#a5190e]">
                                                    {service.priceFrom?.toLocaleString('vi-VN')}đ
                                                </span>
                                                {service.priceTo && service.priceTo !== service.priceFrom && (
                                                    <span className="text-sm text-gray-500">
                                                        {' '}- {service.priceTo?.toLocaleString('vi-VN')}đ
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-500 mb-3">
                                            <div>Đối tác: <span className="font-medium">{service.partner?.businessName || "N/A"}</span></div>
                                            <div>Gói: <span className="font-medium">{service.partner?.partnerTier || "N/A"}</span></div>
                                        </div>

                                        {/* Actions */}
                                        {service.status === "pending" && (
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => handleApprove(service._id)}
                                                    className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                                                >
                                                    Duyệt
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedService(service);
                                                        setShowModal(true);
                                                    }}
                                                    className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                                                >
                                                    Từ chối
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && services.length === 0 && (
                    <div className="text-center py-12">
                        <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">Không có dịch vụ nào</p>
                    </div>
                )}

                {/* Rejection Modal */}
                {showModal && selectedService && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-lg font-bold mb-4">Từ chối dịch vụ</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Bạn có chắc muốn từ chối dịch vụ <strong>{selectedService.name}</strong>?
                            </p>
                            <textarea
                                placeholder="Lý do từ chối (tùy chọn)"
                                className="w-full border border-gray-300 rounded-md p-3 mb-4"
                                rows="3"
                                id="rejection-reason-service"
                            ></textarea>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => {
                                        const reason = document.getElementById('rejection-reason-service').value;
                                        handleReject(selectedService._id, reason);
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Xác nhận từ chối
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Services;
