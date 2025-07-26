import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  bgColor = 'bg-blue-500',
  textColor = 'text-white',
  className = '' 
}) => {
  return (
    <div className={`${bgColor} rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${className}`}>
      <div className="p-6">
        <p className={`${textColor} text-sm font-medium mb-1 opacity-80`}>{title}</p>
        <h3 className={`${textColor} text-3xl font-bold`}>{value}</h3>
      </div>
    </div>
  );
};

export default StatCard; 