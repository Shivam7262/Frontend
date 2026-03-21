import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Heart, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { HARDCODED_DESTINATIONS } from '../data/hardcodedDestinations';

const Destinations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const { isAdmin, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDestinations();
    fetchCategories();
  }, [searchQuery, selectedCategory, sortBy]);

  const fetchDestinations = async () => {
    setLoading(true);
    
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: '0',
        size: '50', // Get more destinations initially
        sortBy: sortBy,
        sortDir: 'asc'
      });

      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);

      const response = await fetch(`${API_BASE_URL}/destinations?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch destinations');
      }

      const result = await response.json();
      console.log('Fetched destinations:', result);
      
      // Merge API destinations with hardcoded destinations
      const apiDestinations = result.destinations || [];
      const mergedDestinations = [...HARDCODED_DESTINATIONS, ...apiDestinations];
      
      // Set destinations from merged data
      setDestinations(mergedDestinations);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast.error('Failed to load destinations');
      // Use hardcoded destinations as fallback
      setDestinations(HARDCODED_DESTINATIONS);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const categoriesData = await response.json();
      console.log('Fetched categories:', categoriesData);
      
      // Transform categories to match expected format
      const transformedCategories = categoriesData.map(cat => ({
        id: cat.id,
        name: cat.name
      }));
      
      setCategories(transformedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories if API fails
      setCategories([
        { id: 1, name: 'Beach' },
        { id: 2, name: 'Mountain' },
        { id: 3, name: 'City' },
        { id: 4, name: 'Adventure' },
        { id: 5, name: 'Historical' },
        { id: 6, name: 'Wildlife' },
        { id: 7, name: 'Culture' },
        { id: 8, name: 'Nature' },
        { id: 9, name: 'Architecture' },
        { id: 10, name: 'Spiritual' },
        { id: 11, name: 'Heritage' },
        { id: 12, name: 'Honeymoon' }

      ]);
    }
  };

  const toggleFavorite = async (destinationId) => {
    if (!isAuthenticated()) {
      toast.error('Please login to add favorites');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: user?.username || user?.name, destinationId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to toggle favorite');
      }

      const isFavorited = data.isFavorited;

      setDestinations(prev => prev.map(dest => 
        dest.id === destinationId 
          ? { ...dest, isFavorite: isFavorited }
          : dest
      ));

      toast.success(isFavorited ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(error.message || 'Failed to update favorites');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = !searchQuery || 
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      (dest.categories && Array.isArray(dest.categories) 
        ? dest.categories.includes(selectedCategory)
        : dest.category === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 lg:py-16">
      <div className="max-w-7xl xl:max-w-8xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 lg:mb-16">
          <div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Discover Destinations
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400">
              Explore amazing places around the world
            </p>
          </div>
          
          {isAdmin() && (
            <Link
              to="/destinations/new"
              className="mt-6 md:mt-0 inline-flex items-center space-x-3 bg-gradient-primary text-white px-8 py-4 lg:px-10 lg:py-5 rounded-2xl lg:rounded-3xl font-bold text-lg hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <Plus className="w-6 h-6" />
              <span>Add Destination</span>
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl shadow-xl p-8 lg:p-10 mb-12 lg:mb-16">
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations, locations, or descriptions..."
                className="w-full pl-14 pr-6 py-4 lg:py-5 border border-gray-300 dark:border-gray-600 rounded-2xl lg:rounded-3xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg shadow-lg transition-all duration-300 focus:shadow-xl"
              />
            </div>
          </form>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>

              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  // Update URL params
                  if (e.target.value) {
                    setSearchParams({ category: e.target.value });
                  } else {
                    setSearchParams({});
                  }
                }}
                className="px-6 py-3 lg:py-4 border border-gray-300 dark:border-gray-600 rounded-2xl lg:rounded-3xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base lg:text-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-3 lg:py-4 border border-gray-300 dark:border-gray-600 rounded-2xl lg:rounded-3xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base lg:text-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="reviews">Sort by Reviews</option>
              </select>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {sortedDestinations.length} destinations found
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 shimmer"></div>
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-8 lg:gap-12">
            {sortedDestinations.map((destination) => {
              // Determine if this is a newly added destination (user-added, within last 7 days)
              const isNew = destination.createdAt && 
                new Date() - new Date(destination.createdAt) < 7 * 24 * 60 * 60 * 1000;
              
              // Get the main image (from images array or fallback)
              const mainImage = Array.isArray(destination.images) && destination.images.length > 0
                ? destination.images[0] 
                : destination.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500';
              
              return (
                <Link
                  to={`/destinations/${destination.id}`}
                  key={destination.id}
                  className="group bg-white dark:bg-gray-800 rounded-3xl lg:rounded-[2rem] shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] w-full max-w-lg mx-auto block"
                >
                  <div className="relative h-64 lg:h-72 xl:h-80 overflow-hidden">
                    <img
                      src={mainImage || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500'}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-6 left-6 flex flex-wrap gap-2 max-w-[calc(100%-3rem)]">

                      {/* this is commented beacause remove category name on destinatio photo  */}

                      {/* {(destination.categories && Array.isArray(destination.categories) 
                        ? destination.categories.slice(0, 2) 
                        : [destination.category]).filter(Boolean).map((category, idx) => (
                        <span key={idx} className="bg-primary-600 text-white px-3 py-1 rounded-xl text-xs lg:text-sm font-bold shadow-lg">
                          {category}
                        </span>
                      ))} */}
                      {destination.categories && destination.categories.length > 2 && (
                        <span className="bg-primary-800 text-white px-2 py-1 rounded-xl text-xs font-bold shadow-lg">
                          +{destination.categories.length - 2}
                        </span>
                      )}
                    </div>
                    
                    {/* New badge for recently added destinations */}
                    {isNew && (
                      <div className="absolute top-6 left-6 ml-24 bg-green-500 text-white px-3 py-2 rounded-2xl text-xs lg:text-sm font-bold animate-pulse shadow-lg">
                        NEW
                      </div>
                    )}
                    
                    <div className="absolute top-6 right-6 flex space-x-3">
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center space-x-2 shadow-lg">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-sm lg:text-base font-bold text-gray-900">{destination.rating || 0}</span>
                      </div>
                      <button
                        onClick={() => toggleFavorite(destination.id)}
                        className={`p-3 rounded-2xl backdrop-blur-sm transition-all duration-300 shadow-lg hover:scale-110 ${
                          destination.isFavorite
                            ? 'bg-red-500 text-white'
                            : 'bg-white/95 text-gray-600 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${destination.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-8 lg:p-10">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
                        {destination.name}
                      </h3>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm lg:text-base font-medium">
                        <MapPin className="w-4 h-4 lg:w-5 lg:h-5 mr-1" />
                        {destination.location}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 text-base lg:text-lg leading-relaxed">
                      {destination.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm lg:text-base text-gray-500 dark:text-gray-400 font-medium">
                        {destination.reviewCount || 0} reviews
                      </span>
                      <span className="text-primary-600 dark:text-primary-400 font-bold text-sm lg:text-base">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && sortedDestinations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No destinations found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search criteria or explore different categories
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
              }}
              className="bg-gradient-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
