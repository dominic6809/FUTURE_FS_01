// client/src/components/common/Loader.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400 mb-4"></div>
      {message && (
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
};

Loader.propTypes = {
  message: PropTypes.string
};

Loader.defaultProps = {
  message: 'Loading...'
};

export default Loader;