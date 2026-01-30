
import React from 'react';

interface ServicePlaceholderProps {
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  name: string;
}

const ServicePlaceholder: React.FC<ServicePlaceholderProps> = ({ icon: Icon, name }) => {
  return (
    <div className={`w-72 h-72 relative flex flex-col items-center justify-center text-gray-300`}>
      {Icon && <Icon className="w-24 h-24 opacity-50" />}
      <p className="text-2xl font-semibold mt-4 opacity-70">{name}</p>
      <p className="text-sm opacity-50">Data coming soon</p>
    </div>
  );
};

export default ServicePlaceholder;
