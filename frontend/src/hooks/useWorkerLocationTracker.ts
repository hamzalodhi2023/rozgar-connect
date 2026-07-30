import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useSocket } from '../context/SocketContext';

export function useWorkerLocationTracker() {
  const { user, isAuthenticated } = useAuth();
  const socket = useSocket();
  
  useEffect(() => {
    // Only track if user is authenticated and has the 'worker' role
    if (!isAuthenticated || !user || !user.roles?.includes('worker')) return;
    if (!socket) return;

    let watchId: number;

    if ('geolocation' in navigator) {
      // Start watching position
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Emit to socket
          socket.emit('updateLocation', { latitude, longitude });
          // console.log(`Location updated: ${latitude}, ${longitude}`);
        },
        (error) => {
          console.error('Error watching location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
    }

    // Cleanup when component unmounts or user changes
    return () => {
      if (watchId !== undefined && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isAuthenticated, user]);
}
