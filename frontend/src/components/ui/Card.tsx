import React from 'react';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ icon, title, description, className = '' }) => {
  return (
    <div
      className={`
        flex items-start gap-4 p-6 rounded-lg
        bg-gray-900/50 border border-gray-800
        hover:border-gray-700 transition-colors duration-200
        ${className}
      `}
    >
      <div className="flex-shrink-0 text-orange-500">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Card;
