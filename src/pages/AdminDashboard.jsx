import { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  MessageSquare, 
  TrendingUp, 
  Settings, 
  Edit,
  Trash2,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDestinations: 0,
    totalReviews: 0,
    pendingReviews: 0
  });
  const [destinations, setDestinations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch real destinations from backend
      const destResponse = await fetch(`${API_BASE_URL}/destinations?page=0&size=100`);
      if (destResponse.ok) {
        const destData = await destResponse.json();
        setDestinations(destData.destinations || []);
        setStats(prev => ({ ...prev, totalDestinations: destData.totalElements || 0 }));
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
      // On error, leave destinations empty so admin can load real data later
      setDestinations([]);
    }
    
    // Clear mock reviews and users; rely on backend for real data
    setStats(prev => ({ ...prev, totalUsers: 0, totalReviews: 0, pendingReviews: 0 }));
    setReviews([]);
    setUsers([]);
    setLoading(false);
  };

  const approveReview = async (reviewId) => {
    // Mock approval - just update local state
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, status: 'approved' } : review
    ));
    toast.success('Review approved');
  };

  const rejectReview = async (reviewId) => {
    // Mock rejection - just update local state
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, status: 'rejected' } : review
    ));
    toast.success('Review rejected');
  };

  const deleteDestination = async (destinationId) => {
    if (!confirm('Are you sure you want to delete this destination? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/destinations/${destinationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        // Remove from local state
        setDestinations(prev => prev.filter(dest => dest.id !== destinationId));
        toast.success('Destination deleted successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete destination');
      }
    } catch (error) {
      console.error('Error deleting destination:', error);
      toast.error('Failed to delete destination');
    }
  };


  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'users', label: 'Users', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage destinations, reviews, and users
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Users</p>
                        <p className="text-3xl font-bold">{stats.totalUsers}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Destinations</p>
                        <p className="text-3xl font-bold">{stats.totalDestinations}</p>
                      </div>
                      <MapPin className="w-8 h-8 text-green-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Total Reviews</p>
                        <p className="text-3xl font-bold">{stats.totalReviews}</p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-purple-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100">Pending Reviews</p>
                        <p className="text-3xl font-bold">{stats.pendingReviews}</p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-orange-200" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-4 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <MessageSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <span className="text-gray-900 dark:text-white">Review Pending Reviews</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('destinations')}
                      className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-4 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <span className="text-gray-900 dark:text-white">Manage Destinations</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('users')}
                      className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-4 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <span className="text-gray-900 dark:text-white">Manage Users</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Destinations Tab */}
            {activeTab === 'destinations' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Manage Destinations
                  </h3>
                  <button className="bg-gradient-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Add Destination
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Reviews
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {destinations.map((destination) => (
                        <tr key={destination.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {destination.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Created {new Date(destination.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 px-2 py-1 rounded text-sm">
                              {destination.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {destination.reviewCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-sm ${
                              destination.status === 'published'
                                ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                            }`}>
                              {destination.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => deleteDestination(destination.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                  Review Management
                </h3>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {review.user}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">reviewed</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {review.destination}
                            </span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">
                            {review.comment}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded ${
                              review.status === 'pending'
                                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                                : review.status === 'approved'
                                ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                            }`}>
                              {review.status}
                            </span>
                          </div>
                        </div>
                        
                        {review.status === 'pending' && (
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => approveReview(review.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectReview(review.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                  User Management
                </h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-sm ${
                              user.role === 'ADMIN'
                                ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-sm ${
                              user.status === 'active'
                                ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(user.joinedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300">
                              <Edit className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
