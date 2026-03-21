import React from 'react';

const Blogs = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl text-center px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Travel Stories Removed</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The blog section has been removed from this site. Please explore destinations and categories instead.</p>
        <div className="flex justify-center gap-4">
          <a href="/destinations" className="bg-gradient-primary text-white px-6 py-3 rounded-lg">Explore Destinations</a>
          <a href="/categories" className="bg-white text-primary-600 px-6 py-3 rounded-lg">Browse Categories</a>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
