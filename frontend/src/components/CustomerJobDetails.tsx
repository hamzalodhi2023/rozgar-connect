import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useMap } from 'react-leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { createConversation } from '../services/chat.service.js';
import toast from 'react-hot-toast';

// Fix leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

function UpdateMapCenter({ center }: { center: {lat: number, lng: number} }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([center.lat, center.lng], map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

export default function CustomerJobDetails({ job }: { job: any }) {
  const navigate = useNavigate();
  const socket = useSocket();
  const profile = job.workerProfile;
  
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(
    profile?.latitude && profile?.longitude 
      ? { lat: profile.latitude, lng: profile.longitude } 
      : null
  );

  useEffect(() => {
    if (!profile || !socket) return;
    
    const workerId = job.workerId._id;
    socket.emit('subscribeToLocation', workerId);

    const handleLocationUpdate = (data: any) => {
      if (data.workerId === workerId) {
        setCurrentLocation({ lat: data.latitude, lng: data.longitude });
      }
    };

    socket.on('workerLocationUpdate', handleLocationUpdate);

    return () => {
      socket.emit('unsubscribeFromLocation', workerId);
      socket.off('workerLocationUpdate', handleLocationUpdate);
    };
  }, [profile, socket, job.workerId._id]);

  if (!profile) return null;

  const handleChat = async () => {
    try {
      const response = await createConversation(job.workerId._id);
      if (response.success) {
        navigate('/chat');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to start chat session');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-800">
      <h4 className="text-sm font-bold text-slate-300 mb-3">Worker Details & Location</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Info */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-center">
          <div className="pt-2">
            <button
              onClick={handleChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl transition-all shadow-md"
            >
              <FiMessageSquare className="w-5 h-5" />
              Chat with Worker
            </button>
          </div>
          <p className="text-xs text-slate-500 text-center mt-2 px-2">
            For your security and to keep a record of communication, please use the in-app chat.
          </p>
        </div>

        {/* Map */}
        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 overflow-hidden min-h-[200px] h-48 md:h-full relative z-0">
          {currentLocation ? (
            <MapContainer 
              center={[currentLocation.lat, currentLocation.lng]} 
              zoom={14} 
              className="w-full h-full rounded-lg relative z-0"
              zoomControl={false}
            >
              <UpdateMapCenter center={currentLocation} />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[currentLocation.lat, currentLocation.lng]}>
                <Popup>
                  <div className="text-center font-semibold">
                    {job.workerId.name}'s Service Location<br />
                    <span className="text-xs text-green-600 font-bold tracking-wider uppercase mt-1 inline-block">● Live</span>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-sm font-medium">
              <svg className="w-8 h-8 mb-2 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location not provided
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
