export const HARDCODED_DESTINATIONS = [
  {
    id: 1,
    name: 'Taj Mahal',
    description: 'One of the most beautiful monuments in the world, a symbol of eternal love.',
    longDescription: 'The Taj Mahal is an ivory-white marble mausoleum on the south bank of the river Yamuna in a vast Mughal garden that encompasses nearly 17 hectares, in Agra. It was built by Mughal emperor Shah Jahan in memory of his favourite wife, Mumtaz Mahal. The Taj Mahal is widely recognized as one of the finest examples of Mughal architecture and a masterpiece of world heritage.',
    location: 'Agra, Uttar Pradesh, India',
    categories: ['Historical', 'Architecture', 'Heritage'],
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
      'https://images.unsplash.com/photo-1518495285542-4542c06a5479?w=800',
      'https://images.unsplash.com/photo-1486299267070-83823e5ca538?w=800'
    ],
    rating: 4.9,
    reviewCount: 8542,
    bestTimeToVisit: 'October to March',
    nearestAirport: 'Indira Gandhi International Airport, Delhi (206 km)',
    railwayStation: 'Agra Cantonment Railway Station',
    roadRoutes: ['From Delhi: NH-48 via Mathura'],
    localTransport: ['Auto Rickshaw', 'Taxi', 'Local Bus'],
    entryFee: '₹250 (Indian) / $15 (Foreigner)',
    openingHours: '06:00 AM - 07:00 PM (Closed every Friday)',
    attractions: [
      'Main Mausoleum',
      'Mosque and Guest House',
      'Fountain Gardens',
      'Museum',
      'Architectural details and inlay work'
    ],
    tips: [
      'Visit early morning to avoid crowds',
      'Wear comfortable walking shoes',
      'Bring sun protection and hat',
      'Photography allowed but no flash',
      'Hire a guide for better understanding',
      'Best viewed during sunset'
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false
  },
  {
    id: 2,
    name: 'Goa Beaches Paradise',
    description: 'Tropical beaches with vibrant nightlife and water sports.',
    longDescription: 'Goa is a coastal state in western India known for its pristine beaches, abundant coconut palms, and vibrant cultural heritage. It offers a perfect blend of beach relaxation, water sports, historic temples, spice plantations, and Portuguese architecture. From the bustling North Goa to the serene South Goa, this destination attracts millions of tourists seeking sun, sand, and adventure.',
    location: 'Goa, India',
    categories: ['Beach', 'Honeymoon', 'Adventure'],
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
    images: [
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1439405326519-c128bbd27d86?w=800'
    ],
    rating: 4.8,
    reviewCount: 6234,
    bestTimeToVisit: 'November to February',
    nearestAirport: 'Dabolim Airport, Goa (30 km)',
    railwayStation: 'Madgaon Railway Station',
    roadRoutes: ['From Bangalore: NH-48', 'From Pune: NH-44'],
    localTransport: ['Auto Rickshaw', 'Motorcycle Rental', 'Taxis', 'Scooters'],
    entryFee: 'Free (Water sports activities: ₹500-2000)',
    openingHours: '24/7 - Beach accessible anytime',
    attractions: [
      'Baga Beach',
      'Calangute Beach',
      'Anjuna Beach',
      'Fort Aguada',
      'Basilica of Bom Jesus',
      'Spice Plantations',
      'Water Sports',
      'Night Markets'
    ],
    tips: [
      'Visit beaches early morning for swimming',
      'Carry high SPF sunscreen',
      'Try local seafood at shacks',
      'Respect local customs',
      'Avoid peak season traffic',
      'Hire bikes for exploration',
      'Book water sports in advance'
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false
  },
  {
    id: 3,
    name: 'Himalayas - Himachal Pradesh',
    description: 'Stunning mountain peaks with snow-capped vistas and adventure trails.',
    longDescription: 'The Himalayas in Himachal Pradesh offer breathtaking mountain landscapes, pristine valleys, and adventure opportunities. Home to popular hill stations like Shimla, Manali, and Dharamshala, this region combines natural beauty with cultural experiences. The snow-capped peaks, rushing rivers, and dense forests make it a paradise for trekkers, adventurers, and nature lovers seeking an escape from city life.',
    location: 'Himachal Pradesh, India',
    categories: ['Mountain', 'Nature', 'Adventure'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      'https://images.unsplash.com/photo-1548253481-a5b4bb5a5c8b?w=800'
    ],
    rating: 4.7,
    reviewCount: 5897,
    bestTimeToVisit: 'May to October (Summer), December to February (Snow)',
    nearestAirport: 'Kullu-Manali Airport (Bhuntar)',
    railwayStation: 'Kalka Railway Station (Toy Train via Shimla)',
    roadRoutes: ['From Delhi: NH-1 to Chandigarh, then NH-5', 'From Punjab: Direct routes to Manali'],
    localTransport: ['Buses', 'Taxis', 'Rental Cars', 'Shared Ride Services'],
    entryFee: 'Free (Trekking permits vary by location)',
    openingHours: '24/7 - Season dependent',
    attractions: [
      'Rohtang Pass',
      'Solang Valley',
      'Old Manali Town',
      'Beas River',
      'Hadimba Temple',
      'Paragliding Sites',
      'Trekking Trails',
      'Spiti Valley'
    ],
    tips: [
      'Pack warm clothing even in summer',
      'Acclimatize before high altitude activities',
      'Check road conditions in winter',
      'Hire local guides for trekking',
      'Bring proper hiking gear',
      'Altitude sickness is common',
      'Weather changes rapidly'
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false
  },
  {
    id: 4,
    name: 'Kerala Backwaters',
    description: 'Serene backwaters, houseboat cruises, and lush green landscapes.',
    longDescription: 'Kerala, known as God\'s Own Country, is famous for its mesmerizing backwaters, pristine beaches, and lush green landscapes. The backwaters of Kumarakom and Alleppey offer peaceful houseboat experiences amidst coconut groves and paddy fields. With its ayurvedic treatments, spice markets, historic temples, and warm hospitality, Kerala provides a perfect blend of relaxation and cultural immersion.',
    location: 'Kerala, India',
    categories: ['Beach', 'Nature', 'Spiritual'],
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
    images: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1439405326519-c128bbd27d86?w=800'
    ],
    rating: 4.6,
    reviewCount: 7123,
    bestTimeToVisit: 'October to February',
    nearestAirport: 'Cochin International Airport (Kochi)',
    railwayStation: 'Ernakulathappan Railway Station (Kochi), Alleppey Station',
    roadRoutes: ['From Bangalore: NH-44', 'From Tamil Nadu: State Highways'],
    localTransport: ['Houseboats', 'Backwater Tours', 'Auto Rickshaw', 'Ferries'],
    entryFee: 'Free (Houseboat rentals: ₹4000-15000 per day)',
    openingHours: '24/7 - Backwater accessible anytime',
    attractions: [
      'Alleppey Backwaters',
      'Kumarakom Bird Sanctuary',
      'Munnar Tea Plantations',
      'Kanyakumari Beach',
      'Padmanabhapuram Palace',
      'Spice Markets',
      'Ayurveda Centers',
      'Traditional Temples'
    ],
    tips: [
      'Book houseboat in advance',
      'Carry light and breathable clothing',
      'Early morning backwater tours are beautiful',
      'Try ayurvedic massage therapy',
      'Fresh seafood is a must-try',
      'Mosquito repellent is essential',
      'Monsoon season offers discount rates'
    ],
    createdAt: new Date().toISOString(),
    isFavorite: false
  }
];
