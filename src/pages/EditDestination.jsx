import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  MapPin, 
  Star, 
  Calendar,
  Info,
  Camera,
  Plus,
  X,
  Save,
  Plane,
  Train,
  Car,
  Bus,
  Bike,
  Car as Taxi,
  DollarSign,
  Clock,
  Home,
  UtensilsCrossed,
  Thermometer,
  PartyPopper,
  Shield,
  Wifi,
  Navigation as NavigationIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const EditDestination = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    location: '',
    categories: [],
    bestTimeToVisit: '',
    images: [],
    attractions: [''],
    tips: [''],
    rating: 0,
    reviewCount: 0,
    isFeatured: false,
    // New transportation fields
    nearestAirport: '',
    railwayStation: '',
    roadRoutes: [''],
    localTransport: [''],
    // Entry and timing fields
    entryFee: '',
    openingHours: '',
    recommendedDuration: '',
    // Budget fields
    budgetLow: '',
    budgetMedium: '',
    budgetHigh: '',
    // Accommodation fields
    budgetHotels: [''],
    midrangeHotels: [''],
    luxuryHotels: [''],
    // Food fields
    localCuisine: [''],
    restaurants: [''],
    // Weather fields
    weatherSummer: '',
    weatherMonsoon: '',
    weatherWinter: '',
    // Events and culture
    festivals: [''],
    localEtiquette: '',
    // Safety and connectivity
    safetyTips: [''],
    connectivity: '',
    nearbyDestinations: ['']
  });

  const [imageUrls, setImageUrls] = useState(['']);

  const categories = [
    'Beach',
    'Mountain',
    'City',
    'Adventure',
    'Historical',
    'Wildlife',
    'Culture',
    'Nature',
    'Food',
    'Spiritual'
  ];

  useEffect(() => {
    fetchDestination();
  }, [id]);

  const fetchDestination = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/destinations/${id}`);
      
      if (!response.ok) {
        throw new Error('Destination not found');
      }

      const destinationData = await response.json();
      console.log('Fetched destination for editing:', destinationData);
      
      // Handle backward compatibility - convert single category to array
      let categories = [];
      if (destinationData.categories && Array.isArray(destinationData.categories)) {
        categories = destinationData.categories;
      } else if (destinationData.category) {
        categories = [destinationData.category];
      }
      
      setFormData({
        name: destinationData.name || '',
        description: destinationData.description || '',
        longDescription: destinationData.longDescription || '',
        location: destinationData.location || '',
        categories: categories,
        bestTimeToVisit: destinationData.bestTimeToVisit || '',
        images: destinationData.images || [],
        attractions: destinationData.attractions || [''],
        tips: destinationData.tips || [''],
        rating: destinationData.rating || 0,
        reviewCount: destinationData.reviewCount || 0,
        isFeatured: destinationData.isFeatured || false,
        // New transportation fields
        nearestAirport: destinationData.nearestAirport || '',
        railwayStation: destinationData.railwayStation || '',
        roadRoutes: destinationData.roadRoutes || [''],
        localTransport: destinationData.localTransport || [''],
        // Entry and timing fields
        entryFee: destinationData.entryFee || '',
        openingHours: destinationData.openingHours || '',
        recommendedDuration: destinationData.recommendedDuration || '',
        // Budget fields
        budgetLow: destinationData.budgetLow || '',
        budgetMedium: destinationData.budgetMedium || '',
        budgetHigh: destinationData.budgetHigh || '',
        // Accommodation fields
        budgetHotels: destinationData.budgetHotels || [''],
        midrangeHotels: destinationData.midrangeHotels || [''],
        luxuryHotels: destinationData.luxuryHotels || [''],
        // Food fields
        localCuisine: destinationData.localCuisine || [''],
        restaurants: destinationData.restaurants || [''],
        // Weather fields
        weatherSummer: destinationData.weatherSummer || '',
        weatherMonsoon: destinationData.weatherMonsoon || '',
        weatherWinter: destinationData.weatherWinter || '',
        // Events and culture
        festivals: destinationData.festivals || [''],
        localEtiquette: destinationData.localEtiquette || '',
        // Safety and connectivity
        safetyTips: destinationData.safetyTips || [''],
        connectivity: destinationData.connectivity || '',
        nearbyDestinations: destinationData.nearbyDestinations || ['']
      });

      // Set image URLs for editing
      setImageUrls(destinationData.images && destinationData.images.length > 0 
        ? destinationData.images 
        : ['']);
        
    } catch (error) {
      console.error('Error fetching destination:', error);
      toast.error('Failed to load destination details');
      navigate('/destinations');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
    
    setFormData(prev => ({
      ...prev,
      images: newImageUrls.filter(url => url.trim() !== '')
    }));
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
    
    setFormData(prev => ({
      ...prev,
      images: newImageUrls.filter(url => url.trim() !== '')
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description || !formData.location || formData.categories.length === 0) {
      toast.error('Please fill in all required fields including at least one category');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('Please add at least one image URL');
      return;
    }

    setLoading(true);

    try {
      // Create updated destination object for API
      const destinationData = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        longDescription: formData.longDescription,
        categories: formData.categories,
        bestTimeToVisit: formData.bestTimeToVisit,
        images: formData.images.filter(img => img.trim() !== ''),
        attractions: formData.attractions.filter(item => item.trim() !== ''),
        tips: formData.tips.filter(item => item.trim() !== ''),
        rating: parseFloat(formData.rating) || 0,
        reviewCount: parseInt(formData.reviewCount) || 0,
        isFeatured: formData.isFeatured,
        // New transportation fields
        nearestAirport: formData.nearestAirport,
        railwayStation: formData.railwayStation,
        roadRoutes: formData.roadRoutes.filter(item => item.trim() !== ''),
        localTransport: formData.localTransport.filter(item => item.trim() !== ''),
        // Entry and timing fields
        entryFee: formData.entryFee,
        openingHours: formData.openingHours,
        recommendedDuration: formData.recommendedDuration,
        // Budget fields
        budgetLow: formData.budgetLow,
        budgetMedium: formData.budgetMedium,
        budgetHigh: formData.budgetHigh,
        // Accommodation fields
        budgetHotels: formData.budgetHotels.filter(item => item.trim() !== ''),
        midrangeHotels: formData.midrangeHotels.filter(item => item.trim() !== ''),
        luxuryHotels: formData.luxuryHotels.filter(item => item.trim() !== ''),
        // Food fields
        localCuisine: formData.localCuisine.filter(item => item.trim() !== ''),
        restaurants: formData.restaurants.filter(item => item.trim() !== ''),
        // Weather fields
        weatherSummer: formData.weatherSummer,
        weatherMonsoon: formData.weatherMonsoon,
        weatherWinter: formData.weatherWinter,
        // Events and culture
        festivals: formData.festivals.filter(item => item.trim() !== ''),
        localEtiquette: formData.localEtiquette,
        // Safety and connectivity
        safetyTips: formData.safetyTips.filter(item => item.trim() !== ''),
        connectivity: formData.connectivity,
        nearbyDestinations: formData.nearbyDestinations.filter(item => item.trim() !== '')
      };

      // Make API call to backend
      const response = await fetch(`${API_BASE_URL}/destinations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(destinationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update destination');
      }

      const result = await response.json();
      console.log('Destination updated:', result);
      
      toast.success('Destination updated successfully!');
      navigate(`/destinations/${id}`);
    } catch (error) {
      console.error('Error updating destination:', error);
      toast.error(error.message || 'Failed to update destination');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 lg:py-16">
        <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-8"></div>
              <div className="space-y-6">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 lg:py-16">
      <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 lg:mb-16">
          <div className="flex items-center space-x-4">
            <Link
              to={`/destinations/${id}`}
              className="inline-flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-lg font-medium transition-colors duration-300 hover:scale-105 transform"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>Back to Destination</span>
            </Link>
          </div>
          <div className="text-right">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-3">Edit Destination</h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400">Update destination information</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-12 lg:space-y-16">
          <div className="bg-white dark:bg-gray-800 rounded-3xl lg:rounded-[2rem] shadow-xl p-8 lg:p-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-8 lg:mb-10 flex items-center">
              <Info className="w-7 h-7 mr-3" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {/* Destination Name */}
              <div className="lg:col-span-2">
                <label className="block text-base lg:text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
                  Destination Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Santorini, Greece"
                  className="w-full px-6 py-4 lg:py-5 border border-gray-300 dark:border-gray-600 rounded-2xl lg:rounded-3xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg shadow-lg transition-all duration-300 focus:shadow-xl"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-base lg:text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Greece, Europe"
                    className="w-full pl-14 pr-6 py-4 lg:py-5 border border-gray-300 dark:border-gray-600 rounded-2xl lg:rounded-3xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg shadow-lg transition-all duration-300 focus:shadow-xl"
                    required
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-base lg:text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
                  Categories * (Select multiple)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map(category => (
                    <label key={category} className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              categories: [...prev.categories, category]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              categories: prev.categories.filter(c => c !== category)
                            }));
                          }
                        }}
                        className="w-5 h-5 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:bg-gray-700"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                    </label>
                  ))}
                </div>
                {formData.categories.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.categories.map(category => (
                      <span key={category} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                        {category}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              categories: prev.categories.filter(c => c !== category)
                            }));
                          }}
                          className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Best Time to Visit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Best Time to Visit
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="bestTimeToVisit"
                    value={formData.bestTimeToVisit}
                    onChange={handleInputChange}
                    placeholder="e.g., April to October"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Featured Toggle */}
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:bg-gray-700"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured Destination</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Short Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="A brief, engaging description of the destination..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Long Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detailed Description
              </label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                placeholder="A comprehensive description with history, culture, and detailed information..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Images *
            </h2>

            <div className="space-y-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addImageUrl}
                className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                <Plus className="w-5 h-5" />
                <span>Add Another Image</span>
              </button>
            </div>

            {formData.images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.slice(0, 3).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image';
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Attractions Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Top Attractions
            </h2>

            <div className="space-y-3">
              {formData.attractions.map((attraction, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={attraction}
                      onChange={(e) => handleArrayInputChange('attractions', index, e.target.value)}
                      placeholder="e.g., Oia Village, Red Beach"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  {formData.attractions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('attractions', index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayField('attractions')}
                className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                <Plus className="w-5 h-5" />
                <span>Add Another Attraction</span>
              </button>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Travel Tips
            </h2>

            <div className="space-y-3">
              {formData.tips.map((tip, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => handleArrayInputChange('tips', index, e.target.value)}
                      placeholder="e.g., Book accommodation early for sunset views"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  {formData.tips.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('tips', index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayField('tips')}
                className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                <Plus className="w-5 h-5" />
                <span>Add Another Tip</span>
              </button>
            </div>
          </div>

          {/* How to Reach Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Plane className="w-5 h-5 mr-2" />
              How to Reach
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nearest Airport
                </label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="nearestAirport"
                    value={formData.nearestAirport}
                    onChange={handleInputChange}
                    placeholder="e.g., Kheria Airport (AGR) - 12km"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Railway Station
                </label>
                <div className="relative">
                  <Train className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="railwayStation"
                    value={formData.railwayStation}
                    onChange={handleInputChange}
                    placeholder="e.g., Agra Cantt Railway Station - 5km"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Road Routes
                </label>
                <div className="space-y-3">
                  {formData.roadRoutes.map((route, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Car className="text-gray-400 w-5 h-5 flex-shrink-0" />
                      <input
                        type="text"
                        value={route}
                        onChange={(e) => handleArrayInputChange('roadRoutes', index, e.target.value)}
                        placeholder="e.g., Delhi to Agra via Yamuna Expressway (200km, 3 hours)"
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      {formData.roadRoutes.length > 1 && (
                        <button type="button" onClick={() => removeArrayField('roadRoutes', index)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayField('roadRoutes')} className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                    <Plus className="w-5 h-5" />
                    <span>Add Route</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Local Transport Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Bus className="w-5 h-5 mr-2" />
              Local Transport
            </h2>
            <div className="space-y-3">
              {formData.localTransport.map((transport, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Taxi className="text-gray-400 w-5 h-5 flex-shrink-0" />
                  <input
                    type="text"
                    value={transport}
                    onChange={(e) => handleArrayInputChange('localTransport', index, e.target.value)}
                    placeholder="e.g., Auto-rickshaws, Cycle-rickshaws, Taxis, Buses"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  {formData.localTransport.length > 1 && (
                    <button type="button" onClick={() => removeArrayField('localTransport', index)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayField('localTransport')} className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                <Plus className="w-5 h-5" />
                <span>Add Transport Option</span>
              </button>
            </div>
          </div>

          {/* Entry Fee & Permits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Entry Fee & Permits
              </h3>
              <textarea
                name="entryFee"
                value={formData.entryFee}
                onChange={handleInputChange}
                placeholder="e.g., Indians: ₹50, Foreigners: ₹1100, Children under 15: Free"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Opening Hours & Duration
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    name="openingHours"
                    value={formData.openingHours}
                    onChange={handleInputChange}
                    placeholder="e.g., 6:00 AM - 7:00 PM (Closed on Fridays)"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recommended Duration
                  </label>
                  <input
                    type="text"
                    name="recommendedDuration"
                    value={formData.recommendedDuration}
                    onChange={handleInputChange}
                    placeholder="e.g., 2-3 hours for main monument, 1 day for full complex"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Budget Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Budget Information (Per Person Per Day)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                  Budget (Low)
                </label>
                <input
                  type="text"
                  name="budgetLow"
                  value={formData.budgetLow}
                  onChange={handleInputChange}
                  placeholder="e.g., ₹1,500 - ₹2,500"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-2">
                  Budget (Medium)
                </label>
                <input
                  type="text"
                  name="budgetMedium"
                  value={formData.budgetMedium}
                  onChange={handleInputChange}
                  placeholder="e.g., ₹3,000 - ₹5,000"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700 dark:text-purple-400 mb-2">
                  Budget (High)
                </label>
                <input
                  type="text"
                  name="budgetHigh"
                  value={formData.budgetHigh}
                  onChange={handleInputChange}
                  placeholder="e.g., ₹8,000+"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Accommodation Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Home className="w-5 h-5 mr-2" />
              Accommodation Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                  Budget Hotels
                </label>
                <div className="space-y-2">
                  {formData.budgetHotels.map((hotel, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={hotel}
                        onChange={(e) => handleArrayInputChange('budgetHotels', index, e.target.value)}
                        placeholder="e.g., Hotel Sidhartha"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                      />
                      {formData.budgetHotels.length > 1 && (
                        <button type="button" onClick={() => removeArrayField('budgetHotels', index)} className="p-1 text-red-600 hover:text-red-800">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayField('budgetHotels')} className="text-sm text-primary-600 dark:text-primary-400 flex items-center">
                    <Plus className="w-4 h-4 mr-1" /> Add Hotel
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-2">
                  Mid-Range Hotels
                </label>
                <div className="space-y-2">
                  {formData.midrangeHotels.map((hotel, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={hotel}
                        onChange={(e) => handleArrayInputChange('midrangeHotels', index, e.target.value)}
                        placeholder="e.g., Hotel Taj Resorts"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                      />
                      {formData.midrangeHotels.length > 1 && (
                        <button type="button" onClick={() => removeArrayField('midrangeHotels', index)} className="p-1 text-red-600 hover:text-red-800">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayField('midrangeHotels')} className="text-sm text-primary-600 dark:text-primary-400 flex items-center">
                    <Plus className="w-4 h-4 mr-1" /> Add Hotel
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700 dark:text-purple-400 mb-2">
                  Luxury Hotels
                </label>
                <div className="space-y-2">
                  {formData.luxuryHotels.map((hotel, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={hotel}
                        onChange={(e) => handleArrayInputChange('luxuryHotels', index, e.target.value)}
                        placeholder="e.g., The Oberoi Amarvilas"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                      />
                      {formData.luxuryHotels.length > 1 && (
                        <button type="button" onClick={() => removeArrayField('luxuryHotels', index)} className="p-1 text-red-600 hover:text-red-800">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayField('luxuryHotels')} className="text-sm text-primary-600 dark:text-primary-400 flex items-center">
                    <Plus className="w-4 h-4 mr-1" /> Add Hotel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Food & Dining */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <UtensilsCrossed className="w-5 h-5 mr-2" />
                Local Cuisine
              </h3>
              <div className="space-y-3">
                {formData.localCuisine.map((dish, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={dish}
                      onChange={(e) => handleArrayInputChange('localCuisine', index, e.target.value)}
                      placeholder="e.g., Petha, Mughlai cuisine"
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    {formData.localCuisine.length > 1 && (
                      <button type="button" onClick={() => removeArrayField('localCuisine', index)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addArrayField('localCuisine')} className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                  <Plus className="w-5 h-5" />
                  <span>Add Dish</span>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <UtensilsCrossed className="w-5 h-5 mr-2" />
                Recommended Restaurants
              </h3>
              <div className="space-y-3">
                {formData.restaurants.map((restaurant, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={restaurant}
                      onChange={(e) => handleArrayInputChange('restaurants', index, e.target.value)}
                      placeholder="e.g., Pinch of Spice"
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    {formData.restaurants.length > 1 && (
                      <button type="button" onClick={() => removeArrayField('restaurants', index)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addArrayField('restaurants')} className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                  <Plus className="w-5 h-5" />
                  <span>Add Restaurant</span>
                </button>
              </div>
            </div>
          </div>

          {/* Weather Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Thermometer className="w-5 h-5 mr-2" />
              Weather by Season
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-orange-700 dark:text-orange-400 mb-2">
                  Summer
                </label>
                <textarea
                  name="weatherSummer"
                  value={formData.weatherSummer}
                  onChange={handleInputChange}
                  placeholder="e.g., Very hot, 35-45°C, early morning visits recommended"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
                  Monsoon
                </label>
                <textarea
                  name="weatherMonsoon"
                  value={formData.weatherMonsoon}
                  onChange={handleInputChange}
                  placeholder="e.g., Hot and humid, 30-35°C, occasional heavy rains"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-700 dark:text-cyan-400 mb-2">
                  Winter
                </label>
                <textarea
                  name="weatherWinter"
                  value={formData.weatherWinter}
                  onChange={handleInputChange}
                  placeholder="e.g., Pleasant, 15-25°C, best time to visit"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Festivals & Events */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <PartyPopper className="w-5 h-5 mr-2" />
              Festivals & Events
            </h2>
            <div className="space-y-3">
              {formData.festivals.map((festival, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={festival}
                    onChange={(e) => handleArrayInputChange('festivals', index, e.target.value)}
                    placeholder="e.g., Taj Mahotsav - February (cultural festival)"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  {formData.festivals.length > 1 && (
                    <button type="button" onClick={() => removeArrayField('festivals', index)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayField('festivals')} className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                <Plus className="w-5 h-5" />
                <span>Add Festival</span>
              </button>
            </div>
          </div>

          {/* Safety & Etiquette */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Safety Tips
              </h3>
              <div className="space-y-3">
                {formData.safetyTips.map((tip, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => handleArrayInputChange('safetyTips', index, e.target.value)}
                      placeholder="e.g., Beware of touts and unofficial guides"
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    {formData.safetyTips.length > 1 && (
                      <button type="button" onClick={() => removeArrayField('safetyTips', index)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addArrayField('safetyTips')} className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                  <Plus className="w-5 h-5" />
                  <span>Add Safety Tip</span>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Local Etiquette & Customs
              </h3>
              <textarea
                name="localEtiquette"
                value={formData.localEtiquette}
                onChange={handleInputChange}
                placeholder="e.g., Remove shoes before entering. No photography inside main tomb. Dress modestly."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Connectivity & Nearby Destinations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Wifi className="w-5 h-5 mr-2" />
                Connectivity
              </h3>
              <textarea
                name="connectivity"
                value={formData.connectivity}
                onChange={handleInputChange}
                placeholder="e.g., Excellent 4G/5G coverage, WiFi in hotels"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <NavigationIcon className="w-5 h-5 mr-2" />
                Nearby Destinations
              </h3>
              <div className="space-y-3">
                {formData.nearbyDestinations.map((destination, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => handleArrayInputChange('nearbyDestinations', index, e.target.value)}
                      placeholder="e.g., Agra Fort (3km)"
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    {formData.nearbyDestinations.length > 1 && (
                      <button type="button" onClick={() => removeArrayField('nearbyDestinations', index)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addArrayField('nearbyDestinations')} className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                  <Plus className="w-5 h-5" />
                  <span>Add Nearby Destination</span>
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center lg:justify-end space-x-6 lg:space-x-8 pt-8">
            <Link
              to={`/destinations/${id}`}
              className="px-8 py-4 lg:px-10 lg:py-5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl lg:rounded-3xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-bold text-lg hover:scale-105 transform shadow-lg"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 lg:px-10 lg:py-5 bg-gradient-primary text-white rounded-2xl lg:rounded-3xl hover:opacity-90 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-3 font-bold text-lg shadow-xl"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  <span>Update Destination</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDestination;
