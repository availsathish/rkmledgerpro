import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBack = false, 
  rightContent 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isTopLevel = ['/', '/customers', '/reports', '/settings'].includes(location.pathname);

  return (
    <header className="bg-surface shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center">
          {showBack && !isTopLevel ? (
            <button
              onClick={() => navigate(-1)}
              className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={22} className="text-gray-700" />
            </button>
          ) : null}
          
          {isTopLevel ? (
             <h1 className="text-lg font-bold text-primary-dark">RKM LOOM SPARES</h1>
          ) : (
             <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          )}
        </div>
        
        {rightContent && (
          <div>{rightContent}</div>
        )}
      </div>
    </header>
  );
};

export default Header;
