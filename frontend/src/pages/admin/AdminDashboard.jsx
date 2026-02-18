import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api/client';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      adminApi.dashboard()
        .then(response => {
          setData(response);
          setLoading(false);
        })
        .catch(() => {
          setData(null);
          setLoading(false);
        });
    }
  }, [isAdmin]);

  if (!isAdmin) return <Navigate to="/login" replace />;
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500">Failed to load dashboard data</p>
      </div>
    );
  }

    const next = data.nextUpcomingEvent && Object.keys(data.nextUpcomingEvent).length ? data.nextUpcomingEvent : null;
    const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1'];

  // Prepare data for revenue pie chart
  const revenueData = [
    { name: 'Received', value: data.totalReceivedAmount || 0 },
    { name: 'Pending', value: data.totalPendingAmount || 0 }
  ];

  // Prepare data for reservation status chart
  const totalReservations = data.totalReservations || 0;
  const pendingCount = data.pendingReservations || 0;
  const cancelledCount = data.recentCancellations || 0;
  const completedCount = Math.max(0, totalReservations - pendingCount - cancelledCount);
  
  const reservationData = [
    { name: 'Completed', value: completedCount },
    { name: 'Pending', value: pendingCount },
    { name: 'Cancelled', value: cancelledCount }
  ];

  return (
    <div className="container mx-auto px-4 py-12 bg-stone-50 min-h-screen">
      
        {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-stone-500 mt-1">Welcome back! Here's your stall reservation overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-amber-500 hover:shadow-xl transition-shadow">
          <p className="text-stone-500 text-sm">Total events</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-stone-800">{data.totalEvents || 0}</p>
            <span className="text-amber-500 text-xl">📅</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
          <p className="text-stone-500 text-sm">Pending amount</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-stone-800">Rs.{Number(data.totalPendingAmount || 0).toFixed(2)}</p>
            <span className="text-blue-500 text-xl">⏳</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
          <p className="text-stone-500 text-sm">Received amount</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-stone-800">Rs.{Number(data.totalReceivedAmount || 0).toFixed(2)}</p>
            <span className="text-green-500 text-xl">💰</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
          <p className="text-stone-500 text-sm">Reservations</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-stone-800">{data.totalReservations || 0}</p>
            <span className="text-purple-500 text-xl">🎫</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-pink-500 hover:shadow-xl transition-shadow">
          <p className="text-stone-500 text-sm">Vendors</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-stone-800">{data.totalVendors || 0}</p>
            <span className="text-pink-500 text-xl">👥</span>
          </div>
        </div>
      </div>

      {/* Next Event Banner */}
      {next && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">NEXT UPCOMING EVENT</p>
              <h2 className="text-2xl font-bold mt-1">{next.name}</h2>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1 text-amber-100">📅 {next.eventDate}</span>
                <span className="flex items-center gap-1 text-amber-100">📍 {next.location}</span>
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <span className="text-4xl">🎪</span>
            </div>
          </div>
        </div>
      )}

       {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Revenue Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
          <h2 className="font-display font-semibold text-lg mb-6">Revenue Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `Rs.${Number(value).toFixed(2)}`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
              <span className="text-sm">Received: Rs.{Number(data.totalReceivedAmount || 0).toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
              <span className="text-sm">Pending: Rs.{Number(data.totalPendingAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Reservation Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
          <h2 className="font-display font-semibold text-lg mb-6">Reservation Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reservationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#78716c" />
              <YAxis stroke="#78716c" />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {reservationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Genre Distribution */}
        {data.genreDistribution && data.genreDistribution.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 lg:col-span-2">
            <h2 className="font-display font-semibold text-lg mb-6">Genre Distribution</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.genreDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.genreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-4">
                {data.genreDistribution.map((genre, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-stone-600">{genre.name}</span>
                      <span className="font-semibold">{Math.round(genre.percent)}%</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${genre.percent}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}