//LoadingSpinner.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/types'; 
import './LoadingSpinner.css'; 



const LoadingAnimation: React.FC = () => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  
  return isLoading ? (
    <div className="loader-container">
        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  ) :null ;
};

export default LoadingAnimation;
