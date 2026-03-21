import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid3X3, MapPin } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchDestinationsByCategory(selectedCategory.id);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      
      if (response.ok) {
        const categoriesData = await response.json();
        const transformedCategories = categoriesData.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || `Explore amazing ${cat.name.toLowerCase()} destinations`,
          icon: cat.icon || getCategoryIcon(cat.name),
          destinationCount: cat.destinationCount || 0,
          image: cat.imageUrl || getCategoryImage(cat.name)
        }));
        setCategories(transformedCategories);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to empty array - let user know about error
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to get default icon for category
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Beach': '🏖️',
      'Mountain': '🏔️',
      'City': '🏙️',
      'Adventure': '🎒',
      'Historical': '🏛️',
      'Wildlife': '🦁',
      'Culture': '🎭',
      'Nature': '🌿',
      'Food': '🍜',
      'Spiritual': '🕌',
      'Heritage':'🛕'
    };
    return iconMap[categoryName] || '📍';
  };
  
  // Helper function to get default image for category
  const getCategoryImage = (categoryName) => {
    const imageMap = {
      'Beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Mountain': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'City': 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Adventure': 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Historical': '',
      'Wildlife': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Culture': 'https://images.unsplash.com/photo-1478099526619-856b604aa849?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Nature': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Architecture': 'https://images.unsplash.com/photo-1507160591892-f910933f3ded?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Spiritual': '',
      'Heritage': 'https://images.unsplash.com/photo-1516156282330-a418892ebb3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Honeymoon': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    };
    return imageMap[categoryName] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  };

  const fetchDestinationsByCategory = async (categoryId) => {
    try {
      // Find the selected category to get its name
      const selectedCat = categories.find(cat => cat.id === categoryId);
      if (!selectedCat) return;
      
      const response = await fetch(`${API_BASE_URL}/destinations/category/${selectedCat.name}?size=4`);
      
      if (response.ok) {
        const result = await response.json();
        const transformedDestinations = (result.destinations || []).map(dest => ({
          id: dest.id,
          name: dest.name,
          location: dest.location,
          image: (dest.images && dest.images.length > 0) 
            ? dest.images[0] 
            : 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300',
          rating: dest.rating || 0,
          reviewCount: dest.reviewCount || 0,
          categories: dest.categories || [dest.category].filter(Boolean)
        }));
        setDestinations(transformedDestinations);
      } else {
        setDestinations([]);
      }
    } catch (error) {
      console.error('Error fetching destinations by category:', error);
      setDestinations([]);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore by Category
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find your perfect adventure based on what you love most
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 shimmer"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded shimmer mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded shimmer mb-4"></div>
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => navigate(`/destinations?category=${encodeURIComponent(category.name)}`)}
                  className={`group cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <h3 className="text-xl font-bold">{category.name}</h3>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-sm font-medium text-gray-900">
                        {category.destinationCount} places
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {category.destinationCount} destinations
                      </span>
                      <span className="text-primary-600 dark:text-primary-400 font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300">
                        Explore →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Category Destinations */}
            {selectedCategory && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{selectedCategory.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedCategory.name} Destinations
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedCategory.description}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/destinations?category=${selectedCategory.name}`}
                    className="bg-gradient-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    View All
                  </Link>
                </div>

                {destinations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {destinations.slice(0, 4).map((destination) => (
                      <Link
                        key={destination.id}
                        to={`/destinations/${destination.id}`}
                        className="group block"
                      >
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="relative h-32 overflow-hidden">
                            <img
                              src={destination.image}
                              alt={destination.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-xs font-medium text-gray-900">{destination.rating}</span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {destination.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {destination.reviewCount} reviews
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Grid3X3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No destinations found in this category yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No categories found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search query
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;
