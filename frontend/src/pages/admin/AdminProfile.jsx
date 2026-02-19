import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api/client';

export default function AdminProfile() {
  const { isAdmin, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (isAdmin) {
      loadProfileData();
      loadAdmins();
      loadDashboardStats();
    }
  }, [isAdmin]);

    const loadProfileData = async () => {
    try {
      const data = await adminApi.profile.get();
      setProfile(data);
      setEditedProfile({ name: data.name, phone: data.phone || '' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load profile' });
    }
  };

    if (!isAdmin) return <Navigate to="/login" replace />;
  if (!profile) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-500 border-r-transparent"></div>
          <p className="mt-4 text-stone-600">Loading profile...</p>
        </div>
      </div>
    );
  }

   return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 py-8">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header with breadcrumb */}
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-stone-800">
            Admin Profile
          </h1>
          <p className="text-stone-600 mt-1">
            Manage your account and administrator settings
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-stone-200 bg-stone-50 px-6">
            <nav className="flex space-x-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('admins')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'admins'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                }`}
              >
                Admin Management
              </button>
            </nav>
          </div>

          {/* Alert Message */}
          {message.text && (
            <div className={`mx-6 mt-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                <p className="text-sm font-medium">{message.text}</p>
                <button
                  onClick={() => setMessage({ type: '', text: '' })}
                  className="ml-auto text-stone-400 hover:text-stone-600"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

           {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Header with Edit Button */}
                <div className="flex items-center justify-between pb-6 border-b border-stone-200">
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {profile.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-stone-800">{profile.name}</h2>
                      <p className="text-stone-500">Administrator</p>
                    </div>
                  </div>
                 </div>

                  {/* Profile Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-stone-50 p-4 rounded-lg">
                      <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Full Name</label>
                      <p className="mt-1 text-lg text-stone-800">{profile.name}</p>
                    </div>
                    
                    <div className="bg-stone-50 p-4 rounded-lg">
                      <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Email Address</label>
                      <p className="mt-1 text-lg text-stone-800">{profile.email}</p>
                    </div>
                    
                    <div className="bg-stone-50 p-4 rounded-lg">
                      <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Phone Number</label>
                      <p className="mt-1 text-lg text-stone-800">{profile.phone || 'Not provided'}</p>
                    </div>
                    
                    <div className="bg-stone-50 p-4 rounded-lg">
                      <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Account Type</label>
                      <p className="mt-1">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                          Administrator
                        </span>
                      </p>
                    </div>
                  </div>

              </div>
            )}

            
          </div>            
        </div>
      </div>
    </div>
   );
}
