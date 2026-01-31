import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

function ExpiryNotification() {
  const [expiringItems, setExpiringItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const token = Cookies.get('accesstoken');

  useEffect(() => {
    if (!token) return;

    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (error) {
      console.error('Invalid token:', error);
      return;
    }

    const fetchExpiringItems = async () => {
      try {
        const res = await fetch(`http://localhost:2806/grocery/expiring/${userId}?days=3`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setExpiringItems(data.items || []);
        if (data.count > 0) {
          setHasNew(true);
        }
      } catch (err) {
        console.error('Error fetching expiring items:', err);
      }
    };

    fetchExpiringItems();
    // Check every 5 minutes
    const interval = setInterval(fetchExpiringItems, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'expired':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'expires-today':
        return 'bg-red-50 border-red-400 text-red-700';
      case 'critical':
        return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-400 text-yellow-700';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'expired':
        return '⛔';
      case 'expires-today':
        return '🚨';
      case 'critical':
        return '⚠️';
      case 'warning':
        return '📢';
      default:
        return '📦';
    }
  };

  if (expiringItems.length === 0) return null;

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setHasNew(false);
        }}
        className="relative p-2 rounded hover:bg-gray-100 transition-colors"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {hasNew && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {expiringItems.length}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 fade-in">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Expiry Alerts</h3>
            <p className="text-sm text-gray-500">{expiringItems.length} item(s) need attention</p>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {expiringItems.map((item, index) => (
              <div
                key={item._id || index}
                className={`p-3 border-b border-gray-100 last:border-b-0 ${getStatusColor(item.expiryStatus?.status)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getStatusIcon(item.expiryStatus?.status)}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs mt-1">{item.expiryStatus?.message}</p>
                    <p className="text-xs mt-1 opacity-75">
                      Qty: {item.quantity} • Expires: {new Date(item.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Use expiring items first to reduce waste!
            </p>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default ExpiryNotification;
