import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, TrendingUp, Users, Globe } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [stats, setStats] = useState({
    destinations: 0,
    users: 0,
    reviews: 0
  });

  useEffect(() => {
    fetchFeaturedDestinations();
    fetchPopularCategories();
    fetchStats();
  }, []);

  const fetchFeaturedDestinations = async () => {
    try {
      // Try to get featured destinations first
      let response = await fetch(`${API_BASE_URL}/destinations/featured?size=6`);
      
      if (response.ok) {
        const featuredData = await response.json();
        if (featuredData.length > 0) {
          const transformedFeatured = featuredData.map(dest => ({
            id: dest.id,
            name: dest.name,
            description: dest.description,
            image: (dest.images && dest.images.length > 0) ? dest.images[0] : 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500',
            rating: dest.rating || 0,
            reviewCount: dest.reviewCount || 0
          }));
          setFeaturedDestinations(transformedFeatured);
          return;
        }
      }
      
      // Fallback to top-rated destinations if no featured destinations
      response = await fetch(`${API_BASE_URL}/destinations/top-rated`);
      
      if (response.ok) {
        const topRatedData = await response.json();
        const transformedTopRated = topRatedData.slice(0, 6).map(dest => ({
          id: dest.id,
          name: dest.name,
          description: dest.description,
          image: (dest.images && dest.images.length > 0) ? dest.images[0] : 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500',
          rating: dest.rating || 0,
          reviewCount: dest.reviewCount || 0
        }));
        setFeaturedDestinations(transformedTopRated);
        return;
      }
      
      // Final fallback to regular destinations
      response = await fetch(`${API_BASE_URL}/destinations?size=6&sortBy=rating&sortDir=desc`);
      
      if (response.ok) {
        const result = await response.json();
        const transformedRegular = (result.destinations || []).map(dest => ({
          id: dest.id,
          name: dest.name,
          description: dest.description,
          image: (dest.images && dest.images.length > 0) ? dest.images[0] : 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500',
          rating: dest.rating || 0,
          reviewCount: dest.reviewCount || 0
        }));
        setFeaturedDestinations(transformedRegular);
      }
    } catch (error) {
      console.error('Error fetching featured destinations:', error);
      // Set empty array on error - no fallback mock data
      setFeaturedDestinations([]);
    }
  };

  const fetchPopularCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/popular?limit=8`);
      
      if (response.ok) {
        const categoriesData = await response.json();
        const transformedCategories = categoriesData.map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon || getCategoryIcon(cat.name),
          count: cat.destinationCount || 0
        }));
        setPopularCategories(transformedCategories);
      } else {
        // Fallback to default categories if API fails
        setPopularCategories([
          { id: 1, name: 'Beach', icon: '🏖️', count: 0 },
          { id: 2, name: 'Mountain', icon: '🏔️', count: 0 },
          { id: 3, name: 'City', icon: '🏙️', count: 0 },
          { id: 4, name: 'Adventure', icon: '🎒', count: 0 },
          { id: 5, name: 'Historical', icon: '🏛️', count: 0 },
          { id: 6, name: 'Wildlife', icon: '🦁', count: 0 },
          { id: 7, name: 'Culture', icon: '🎭', count: 0 },
          { id: 8, name: 'Nature', icon: '🌿', count: 0 }
        ]);
      }
    } catch (error) {
      console.error('Error fetching popular categories:', error);
      setPopularCategories([]);
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
      'Spiritual': '🕌'
    };
    return iconMap[categoryName] || '📍';
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/destinations/stats`);
      
      if (response.ok) {
        const statsData = await response.json();
        setStats({
          destinations: statsData.totalDestinations || 0,
          users: 0, // This would need a separate user endpoint when authentication is added
          reviews: (statsData.mostReviewed && statsData.mostReviewed.length > 0) 
            ? statsData.mostReviewed.reduce((total, dest) => total + (dest.reviewCount || 0), 0) 
            : 0
        });
      } else {
        setStats({
          destinations: 0,
          users: 0,
          reviews: 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        destinations: 0,
        users: 0,
        reviews: 0
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/destinations?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-teal-600 overflow-hidden">
          <div className="absolute inset-0 bg-black/30"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-90"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&s=)',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-700/40 via-pink-600/30 to-yellow-400/25 mix-blend-multiply"></div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Your Next
            <span className="block bg-gradient-to-r from-pink-400 to-yellow-300 bg-clip-text text-transparent">
              Adventure
            </span>
            Awaits
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-slide-up">
            Discover amazing destinations, share your experiences, and plan your perfect getaway
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 animate-slide-up">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where do you want to go?"
                className="w-full pl-12 pr-4 py-4 text-lg rounded-full bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-primary text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
            <Link
              to="/destinations"
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-white/30 transition-all border border-white/30"
            >
              Explore Destinations
            </Link>
            <Link
              to="/categories"
              className="bg-gradient-primary text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 lg:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl xl:max-w-8xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 bg-gradient-primary rounded-2xl lg:rounded-3xl mx-auto mb-6 transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                <MapPin className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                {stats.destinations}+
              </h3>
              <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 font-medium">Amazing Destinations</p>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 bg-gradient-primary rounded-2xl lg:rounded-3xl mx-auto mb-6 transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Users className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                {stats.users}+
              </h3>
              <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 font-medium">Happy Travelers</p>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 bg-gradient-primary rounded-2xl lg:rounded-3xl mx-auto mb-6 transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Star className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                {stats.reviews}+
              </h3>
              <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 font-medium">Authentic Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl xl:max-w-8xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Featured Destinations
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Discover the most popular and breathtaking destinations chosen by our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8 lg:gap-10">
            {featuredDestinations.map((destination) => (
              <Link
                key={destination.id}
                to={`/destinations/${destination.id}`}
                className="group bg-white dark:bg-gray-900 rounded-3xl lg:rounded-[2rem] shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02]"
              >
                <div className="relative h-56 lg:h-64 xl:h-72 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center space-x-2 shadow-lg">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-sm font-bold text-gray-900">{destination.rating}</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {destination.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 text-base lg:text-lg leading-relaxed">
                    {destination.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm lg:text-base text-gray-500 dark:text-gray-400 font-medium">
                      {destination.reviewCount} reviews
                    </span>
                    <span className="text-primary-600 dark:text-primary-400 font-bold text-sm lg:text-base group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                      Learn more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16 lg:mt-20">
            <Link
              to="/destinations"
              className="inline-flex items-center space-x-3 bg-gradient-primary text-white px-10 py-4 lg:px-12 lg:py-5 rounded-2xl lg:rounded-3xl font-bold text-lg lg:text-xl hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <span>View All Destinations</span>
              <TrendingUp className="w-6 h-6 lg:w-7 lg:h-7" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 lg:py-28 bg-white dark:bg-gray-900">
        <div className="max-w-7xl xl:max-w-8xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Explore by Category
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Find your perfect adventure based on what you love most
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 lg:gap-8">
            {popularCategories.map((category) => (
              <Link
                key={category.id}
                to={`/categories?filter=${category.name.toLowerCase()}`}
                className="group bg-gray-50 dark:bg-gray-800 rounded-3xl lg:rounded-[2rem] p-6 lg:p-8 text-center hover:bg-gradient-primary hover:text-white transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 shadow-lg hover:shadow-2xl"
              >
                <div className="text-4xl lg:text-5xl xl:text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                <h3 className="text-lg lg:text-xl xl:text-2xl font-bold mb-3 group-hover:text-white transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 group-hover:text-white/90 font-medium transition-colors">
                  {category.count} destinations
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl xl:max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-8 lg:p-12 w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-10 lg:mb-12 shadow-2xl">
            <Globe className="w-16 h-16 lg:w-20 lg:h-20 text-white mx-auto" />
          </div>
          <h2 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 lg:mb-10 leading-tight">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl lg:text-2xl xl:text-3xl text-white/95 mb-12 lg:mb-16 max-w-4xl mx-auto leading-relaxed font-light">
            Join thousands of travelers sharing their experiences and discovering new adventures
          </p>
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center max-w-2xl mx-auto">
            <Link
              to="/destinations"
              className="bg-white text-primary-600 px-10 py-4 lg:px-12 lg:py-5 rounded-2xl lg:rounded-3xl font-bold text-lg lg:text-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Start Exploring
            </Link>
            {/* Blogs removed per project requirements */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
