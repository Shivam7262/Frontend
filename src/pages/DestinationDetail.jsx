import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Heart, 
  Share2, 
  Calendar,
  Users,
  Camera,
  Edit,
  Trash2,
  Plane,
  Train,
  Car,
  Bus,
  Clock,
  DollarSign,
  Home,
  UtensilsCrossed,
  PartyPopper,
  Shield,
  Wifi,
  Navigation as NavigationIcon,
  Thermometer,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';
import { HARDCODED_DESTINATIONS } from '../data/hardcodedDestinations';

const DestinationDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchDestination();
    fetchReviews();
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchDestination = async () => {
    try {
      // Check hardcoded destinations first
      const hardcodedDestination = HARDCODED_DESTINATIONS.find(d => d.id === parseInt(id));
      
      if (hardcodedDestination) {
        console.log('Found hardcoded destination:', hardcodedDestination);
        setDestination({
          ...hardcodedDestination,
          images: hardcodedDestination.images || [],
          attractions: hardcodedDestination.attractions || [],
          tips: hardcodedDestination.tips || [],
          longDescription: hardcodedDestination.longDescription || hardcodedDestination.description,
          isFavorite: false
        });
        setLoading(false);
        return;
      }

      // If not found in hardcoded, try API
      const response = await fetch(`${API_BASE_URL}/destinations/${id}`);
      
      if (!response.ok) {
        throw new Error('Destination not found');
      }

      const destinationData = await response.json();
      console.log('Fetched destination:', destinationData);
      
      // Ensure required fields exist
      setDestination({
        ...destinationData,
        images: destinationData.images || [],
        attractions: destinationData.attractions || [],
        tips: destinationData.tips || [],
        longDescription: destinationData.longDescription || destinationData.description,
        isFavorite: false // This will be handled separately if needed
      });
    } catch (error) {
      console.error('Error fetching destination:', error);
      toast.error('Failed to load destination details');
      // You might want to redirect to destinations page or show error state
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/destination/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const result = await response.json();
      console.log('Fetched reviews:', result);
      
      // Transform API response to match expected format
      const transformedReviews = (result.reviews || []).map(review => ({
        id: review.id,
        user: {
          name: review.userName,
          avatar: review.userAvatar || null
        },
        rating: review.rating,
        comment: review.comment,
        date: review.createdAt ? new Date(review.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        helpful: review.helpfulCount || 0
      }));
      
      setReviews(transformedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to add favorites');
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: user?.username || user?.name, destinationId: parseInt(id) })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to toggle favorite');
      }

      const isFavorited = data.isFavorited;
      setDestination(prev => ({ ...prev, isFavorite: isFavorited }));
      toast.success(isFavorited ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(error.message || 'Failed to update favorites');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const reviewData = {
        destination: { id: parseInt(id) },
        userName: user?.name || 'Anonymous User',
        userAvatar: user?.avatar || null,
        rating: newReview.rating,
        comment: newReview.comment
      };

      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      const result = await response.json();
      console.log('Review submitted:', result);
      
      // Refresh reviews list
      await fetchReviews();
      
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      toast.success('Review added successfully');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete review');
      }

      toast.success('Review deleted');
      await fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const shareDestination = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: destination.name,
          text: destination.description,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 animate-slide-down">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/destinations"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Destinations</span>
        </Link>

        {/* Image Gallery */}
        <div className="mb-8">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 2000 }}
            className="rounded-lg overflow-hidden shadow-lg h-64 md:h-96"
          >
            {destination.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`${destination.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {(destination.categories && Array.isArray(destination.categories) 
                  ? destination.categories 
                  : [destination.category]).filter(Boolean).map((category, idx) => (
                  <span key={idx} className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
                    {category}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{destination.location}</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {destination.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium text-gray-900 dark:text-white">{destination.rating}</span>
                  <span className="text-gray-500 dark:text-gray-400">({destination.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button
                onClick={toggleFavorite}
                className={`p-3 rounded-lg transition-colors ${
                  destination.isFavorite
                    ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${destination.isFavorite ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={shareDestination}
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {user && user.role === 'ADMIN' && (
                <Link
                  to={`/destinations/${id}/edit`}
                  className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {destination.description}
          </p>
        </div>

        {/* Detailed Information */}
        <div className="space-y-8 mb-8">
          {/* About */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {destination.longDescription}
            </p>
          </div>

          {/* How to Reach */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <NavigationIcon className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
              How to Reach
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.nearestAirport && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Plane className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">By Air</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{destination.nearestAirport}</p>
                </div>
              )}
              
              {destination.railwayStation && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Train className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">By Train</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{destination.railwayStation}</p>
                </div>
              )}
              
              {destination.roadRoutes && destination.roadRoutes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Car className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">By Road</h3>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {destination.roadRoutes.map((route, index) => (
                      <li key={index}>• {route}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Local Transport & Entry Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Local Transport */}
            {destination.localTransport && destination.localTransport.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Bus className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Local Transport
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {destination.localTransport.map((transport, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full"></span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{transport}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Entry Fee & Permits */}
            {destination.entryFee && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Entry Fee & Permits
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {destination.entryFee}
                </p>
              </div>
            )}
          </div>

          {/* Opening Hours & Duration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {destination.openingHours && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Opening Hours
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {destination.openingHours}
                </p>
              </div>
            )}

            {destination.recommendedDuration && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Recommended Duration
                </h3>
                <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                  {destination.recommendedDuration}
                </p>
              </div>
            )}
          </div>

          {/* Budget Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <DollarSign className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
              Budget Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {destination.budgetLow && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2">Budget</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">{destination.budgetLow}</p>
                </div>
              )}
              
              {destination.budgetMedium && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">Mid-Range</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">{destination.budgetMedium}</p>
                </div>
              )}
              
              {destination.budgetHigh && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-400 mb-2">Luxury</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300">{destination.budgetHigh}</p>
                </div>
              )}
            </div>
          </div>

          {/* Accommodation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Home className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
              Recommended Accommodation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {destination.budgetHotels && destination.budgetHotels.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Budget Hotels</h3>
                  <ul className="space-y-2">
                    {destination.budgetHotels.map((hotel, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                        <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                        <span>{hotel}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {destination.midrangeHotels && destination.midrangeHotels.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Mid-Range Hotels</h3>
                  <ul className="space-y-2">
                    {destination.midrangeHotels.map((hotel, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                        <span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
                        <span>{hotel}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {destination.luxuryHotels && destination.luxuryHotels.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Luxury Hotels</h3>
                  <ul className="space-y-2">
                    {destination.luxuryHotels.map((hotel, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                        <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                        <span>{hotel}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Food & Dining */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {destination.localCuisine && destination.localCuisine.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <UtensilsCrossed className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Local Cuisine
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {destination.localCuisine.map((dish, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{dish}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {destination.restaurants && destination.restaurants.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <UtensilsCrossed className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Recommended Restaurants
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {destination.restaurants.map((restaurant, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{restaurant}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Weather Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Thermometer className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
              Weather by Season
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {destination.weatherSummer && (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-400 mb-2">Summer</h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300">{destination.weatherSummer}</p>
                </div>
              )}
              
              {destination.weatherMonsoon && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Monsoon</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{destination.weatherMonsoon}</p>
                </div>
              )}
              
              {destination.weatherWinter && (
                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-cyan-800 dark:text-cyan-400 mb-2">Winter</h3>
                  <p className="text-sm text-cyan-700 dark:text-cyan-300">{destination.weatherWinter}</p>
                </div>
              )}
            </div>
          </div>

          {/* Attractions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Top Attractions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {destination.attractions.map((attraction, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-gray-700 dark:text-gray-300">{attraction}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Festivals & Events */}
          {destination.festivals && destination.festivals.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <PartyPopper className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
                Festivals & Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.festivals.map((festival, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{festival}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety & Etiquette */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {destination.safetyTips && destination.safetyTips.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Safety Tips
                </h3>
                <ul className="space-y-2">
                  {destination.safetyTips.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {destination.localEtiquette && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Local Etiquette
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {destination.localEtiquette}
                </p>
              </div>
            )}
          </div>

          {/* Connectivity & Nearby Destinations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {destination.connectivity && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Wifi className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Connectivity
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {destination.connectivity}
                </p>
              </div>
            )}

            {destination.nearbyDestinations && destination.nearbyDestinations.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <NavigationIcon className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Nearby Destinations
                </h3>
                <div className="space-y-2">
                  {destination.nearbyDestinations.map((nearby, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{nearby}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Travel Tips */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Travel Tips</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {destination.tips.map((tip, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                  <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Reviews ({reviews.length})
            </h2>
            {isAuthenticated() && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-gradient-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Write Review
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      className={`p-1 ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Review
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="Share your experience..."
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-gradient-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                <div className="flex flex-col md:flex-row md:items-start md:space-x-4 space-y-3 md:space-y-0">
                  {review.user.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-200">
                      {review.user.name ? review.user.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'A'}
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{review.user.name}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                          Helpful ({review.helpful})
                        </button>

                        {user && user.role === 'ADMIN' && (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
                            aria-label="Delete review"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
