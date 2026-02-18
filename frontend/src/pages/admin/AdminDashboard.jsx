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
      
    </div>
  );
}