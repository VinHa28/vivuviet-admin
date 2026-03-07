/* eslint-disable react-hooks/set-state-in-effect */
import React from "react";
import Sidebar from "../dashboard/SideBar";
import { useParams } from "react-router-dom";
import { getPartnerService, getPartnerStats } from "../services/adminService";
import { useEffect } from "react";
import { useState } from "react";
import { LoaderPinwheel } from "lucide-react";

export default function PartnerDetails() {
  const { id } = useParams();
  const [partner, setParner] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const getPartnerInfo = async () => {
    try {
      const data = await getPartnerStats(id);
      setParner(data.partner);
      setStats(data.statistics);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getServices = async () => {
    try {
      const data = await getPartnerService(id);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getPartnerInfo();
    getServices();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F9FAFE]">
      <Sidebar />
      {loading ? (
        <LoaderPinwheel />
      ) : (
        <main className="ml-64 flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4 mt-[20px]">
              <img
                src={partner.logo}
                className="w-[50px] h-[50px] rounded-full"
              />
              <div>
                <h1 className="text-3xl font-bold text-[#252525] mb-2">
                  {partner?.businessName}{" "}
                  <span className="text-[10px] font-medium py-[4px] px-[8px] bg-[#a5190e] flex justify-center items-center text-white rounded-[4px] ml-2 inline-block">
                    {partner.partnerTier}
                  </span>
                </h1>
                <p className="text-gray-600">
                  {partner?.email} - {partner?.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-50">
              <p className="text-[10px] text-[#848484] uppercase font-semibold">
                Số lượng dịch vụ
              </p>
              <h2 className="text-3xl font-bold text-[#a5190e] mt-2">
                {loading ? "..." : stats.services.activeServices}
              </h2>
              <p className="text-[12px] text-[#848484] mt-2">
                {loading ? "" : `${stats.services.pendingServices} chờ duyệt`}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-50">
              <p className="text-[10px] text-[#848484] uppercase font-semibold">
                Tổng số lượt xem
              </p>
              <h2 className="text-3xl font-bold text-[#a5190e] mt-2">
                {loading ? "..." : stats.services.totalViews}
              </h2>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-50">
              <p className="text-[10px] text-[#848484] uppercase font-semibold">
                Số bài viết
              </p>
              <h2 className="text-3xl font-bold text-[#a5190e] mt-2">
                {loading ? "..." : stats.posts.approvedPosts}
              </h2>
              <p className="text-[12px] text-[#848484] mt-2">
                <span className="text-[#a5190e]">
                  {stats.posts.totalPosts - stats.posts.approvedPosts}
                </span>{" "}
                chờ duyệt
              </p>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
