import React from 'react'
import Sidebar from '../dashboard/SideBar'

export default function Destinations() {
  return (
    <div className="flex min-h-screen bg-[#F9FAFE]">
        <Sidebar/>
        <main className="ml-64 flex-1 p-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#252525] mb-2">
            Quản lý địa điểm
          </h1>
          <p className="text-gray-600">
          </p>
        </div>
      </main>
    </div>
  )
}
