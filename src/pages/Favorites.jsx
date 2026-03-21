import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Trash2, Grid, List } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const Favorites = () => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    if (!isAuthenticated()) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/user/${user?.username || user?.name}?size=50`);
      if (!response.ok) throw new Error('Failed to fetch favorites');

      const result = await response.json();
      const favs = (result.favorites || []).map(f => {
        const dest = f.destination || f;
        return {
          id: dest.id,
          name: dest.name,
          description: dest.description,
          image: (dest.images && dest.images.length > 0) ? dest.images[0] : (dest.image || ''),
          rating: dest.rating || 0,
          reviewCount: dest.reviewCount || 0,
          category: dest.category || (dest.categories && dest.categories[0]) || '',
          location: dest.location || '',
          addedAt: f.createdAt
        };
      });

      setFavorites(favs);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (destinationId) => {
    if (!isAuthenticated()) {
      toast.error('Please login to manage favorites');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/favorites?userName=${encodeURIComponent(user?.username || user?.name)}&destinationId=${destinationId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to remove favorite');

      setFavorites(prev => prev.filter(fav => fav.id !== destinationId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error(error.message || 'Failed to remove favorite');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Favorites
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your saved destinations for future adventures
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-4'}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className={viewMode === 'grid' ? 'h-48' : 'h-24'}>
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 shimmer"></div>
                </div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded shimmer mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded shimmer mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start exploring destinations and save your favorites for easy access
            </p>
            <Link
              to="/destinations"
              className="bg-gradient-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Explore Destinations
            </Link>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favorites.map((destination) => (
                  <Link
                    to={`/destinations/${destination.id}`}
                    key={destination.id}
                    className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 block"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 bg-primary-600 text-white px-2 py-1 rounded text-sm font-medium">
                        {destination.category}
                      </div>
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900">{destination.rating}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeFavorite(destination.id);
                          }}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {destination.name}
                        </h3>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {destination.location}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {destination.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <span>{destination.reviewCount} reviews</span>
                          <span className="mx-2">•</span>
                          <span>Added {new Date(destination.addedAt).toLocaleDateString()}</span>
                        </div>
                        <span className="text-primary-600 dark:text-primary-400 font-medium">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {favorites.map((destination) => (
                  <Link
                    to={`/destinations/${destination.id}`}
                    key={destination.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow block"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {destination.name}
                              </h3>
                              <span className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 px-2 py-1 rounded text-xs font-medium">
                                {destination.category}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 mb-2">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{destination.rating}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">({destination.reviewCount} reviews)</span>
                              </div>
                              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                                <MapPin className="w-4 h-4 mr-1" />
                                {destination.location}
                              </div>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
                              {destination.description}
                            </p>
                            
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              Added on {new Date(destination.addedAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-3 ml-4">
                            <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                              View Details
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                removeFavorite(destination.id);
                              }}
                              className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
