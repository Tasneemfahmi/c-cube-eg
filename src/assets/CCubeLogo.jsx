import React from 'react';

    const CCubeLogo = ({ className }) => {
      return (
        <svg 
          className={className}
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="pastelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#F2BED1', stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: '#FDCEDF', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#F8E8EE', stopOpacity: 1}} />
            </linearGradient>
          </defs>
          
          <path d="M20 25 L50 10 L80 25 L80 75 L50 90 L20 75 Z" fill="url(#pastelGradient)" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
          
          <path d="M50 10 L50 50" stroke="currentColor" strokeWidth="3" />
          <path d="M20 25 L50 50" stroke="currentColor" strokeWidth="3" />
          <path d="M80 25 L50 50" stroke="currentColor" strokeWidth="3" />
          
          <path d="M50 90 L50 50" stroke="currentColor" strokeWidth="3" />
          <path d="M20 75 L20 45" stroke="currentColor" strokeWidth="3" strokeDasharray="4 4" opacity="0.7" />
          <path d="M80 75 L80 45" stroke="currentColor" strokeWidth="3" strokeDasharray="4 4" opacity="0.7" />


          <circle cx="50" cy="50" r="8" fill="white" stroke="currentColor" strokeWidth="2" />
          <text x="50" y="55" fontFamily="Playfair Display, serif" fontSize="12" fill="currentColor" textAnchor="middle" fontWeight="bold">C³</text>
        </svg>
      );
    };

    export default CCubeLogo;