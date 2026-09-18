import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Compass,
  Layers,
  MapPin,
  Bike,
  Store,
  Navigation,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crosshair,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import { Delivery, DeliveryWaypoint } from '../../types';

interface DeliveryTrackingMapProps {
  delivery: Delivery;
  height?: string;
  showRouteOptimizerToggle?: boolean;
  onSelectRouteMode?: (mode: 'OPTIMIZED' | 'STANDARD') => void;
  selectedRouteMode?: 'OPTIMIZED' | 'STANDARD';
  autoFollowRider?: boolean;
}

export const DeliveryTrackingMap: React.FC<DeliveryTrackingMapProps> = ({
  delivery,
  height = '460px',
  showRouteOptimizerToggle = true,
  onSelectRouteMode,
  selectedRouteMode = 'OPTIMIZED',
  autoFollowRider = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const riderMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const altPolylineRef = useRef<L.Polyline | null>(null);
  const riderAnimationRef = useRef<number | null>(null);

  const [isLockedOnRider, setIsLockedOnRider] = useState(autoFollowRider);
  const [showTraffic, setShowTraffic] = useState(true);
  const [routeMode, setRouteMode] = useState<'OPTIMIZED' | 'STANDARD'>(selectedRouteMode);

  // This is the GeoJSON geometry returned by OSRM. Never fall back to a
  // coordinate-to-coordinate line or to the former generated demo paths.
  const activeRoutePath = delivery?.roadRoute?.geometry ?? [];
  const altRoutePath: DeliveryWaypoint[] = [];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent duplicate map instances & reset container ID
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch {}
      mapInstanceRef.current = null;
    }
    if (mapContainerRef.current) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    const sLat = delivery?.stallLat ?? 15.8522;
    const sLng = delivery?.stallLng ?? 74.5042;
    const dLat = delivery?.destinationLat ?? 15.8647;
    const dLng = delivery?.destinationLng ?? 74.5124;
    const cLat = delivery?.currentLat ?? sLat;
    const cLng = delivery?.currentLng ?? sLng;

    try {
      const map = L.map(mapContainerRef.current, {
        center: [cLat, cLng],
        zoom: 14,
        zoomControl: false
      });

      mapInstanceRef.current = map;

      // OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors • Khau Katta Belagavi Navigation'
      }).addTo(map);

      // Vendor Stall Marker Icon
      const stallIcon = L.divIcon({
        className: 'custom-stall-marker',
        html: `
          <div style="background-color: #b85018; color: white; padding: 8px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      if (!['picked_up', 'out_for_delivery', 'arrived_at_customer', 'delivered'].includes(delivery.status)) {
        L.marker([sLat, sLng], { icon: stallIcon })
          .addTo(map)
          .bindPopup(`<b>Stall: ${delivery?.stallName || 'Vendor Stall'}</b><br>Belagavi Khau Katta Hub`);
      }

      // Customer Destination Marker Icon
      const destIcon = L.divIcon({
        className: 'custom-dest-marker',
        html: `
          <div style="background-color: #047857; color: white; padding: 8px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });

      if (['picked_up', 'out_for_delivery', 'arrived_at_customer', 'delivered'].includes(delivery.status)) {
        L.marker([dLat, dLng], { icon: destIcon })
          .addTo(map)
          .bindPopup(`<b>Customer: ${delivery?.customerName || 'Customer'}</b><br>${delivery?.deliveryAddress || 'Belagavi'}`);
      }

      // Initial fit bounds
      const bounds = L.latLngBounds([
        [sLat, sLng],
        [dLat, dLng],
        [cLat, cLng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } catch {
      // Graceful map init catch
    }

    return () => {
      if (riderAnimationRef.current !== null) cancelAnimationFrame(riderAnimationRef.current);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {}
        mapInstanceRef.current = null;
      }
    };
  }, [delivery?.stallLat, delivery?.stallLng, delivery?.destinationLat, delivery?.destinationLng, delivery.status]);

  // Update Rider Marker & Polylines dynamically when location / route mode changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      // Draw Alternate Route Polyline (dashed gray)
      if (altPolylineRef.current) {
        try { map.removeLayer(altPolylineRef.current); } catch {}
      }
      const altCoords: [number, number][] = altRoutePath
        .filter(w => typeof w?.lat === 'number' && typeof w?.lng === 'number')
        .map(w => [w.lat, w.lng]);

      if (altCoords.length > 0) {
        altPolylineRef.current = L.polyline(altCoords, {
          color: '#9ca3af',
          weight: 4,
          dashArray: '8, 8',
          opacity: 0.6
        }).addTo(map);
      }

      // Draw Primary Selected Route Polyline (solid emerald/terracotta)
      if (routePolylineRef.current) {
        try { map.removeLayer(routePolylineRef.current); } catch {}
      }
      const mainCoords: [number, number][] = activeRoutePath
        .filter(w => typeof w?.lat === 'number' && typeof w?.lng === 'number')
        .map(w => [w.lat, w.lng]);

      if (mainCoords.length > 0) {
        routePolylineRef.current = L.polyline(mainCoords, {
          color: '#10b981',
          weight: 6,
          opacity: 0.95
        }).addTo(map);
        map.fitBounds(routePolylineRef.current.getBounds(), { padding: [50, 50], maxZoom: 16 });
      }

      // Update Animated Rider Marker Icon
      const riderLat = delivery?.currentLat ?? delivery?.stallLat ?? 15.8522;
      const riderLng = delivery?.currentLng ?? delivery?.stallLng ?? 74.5042;
      const heading = delivery?.headingDeg || 0;

      const riderIcon = L.divIcon({
        className: 'custom-rider-marker',
        html: `
          <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 0; background-color: #d97706; opacity: 0.25; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="transform: rotate(${heading}deg); transition: transform 0.4s ease-out; background-color: #d97706; color: white; padding: 10px; border-radius: 50%; border: 3px solid white; box-shadow: 0 6px 16px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; width: 42px; height: 42px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      if (riderMarkerRef.current) {
        // GPS arrives in discrete updates. Interpolate each update so the
        // rider appears to travel continuously rather than jumping point-to-point.
        if (riderAnimationRef.current !== null) cancelAnimationFrame(riderAnimationRef.current);
        const previous = riderMarkerRef.current.getLatLng();
        const startedAt = performance.now();
        const duration = 1300;
        const animate = (now: number) => {
          const progress = Math.min(1, (now - startedAt) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          riderMarkerRef.current?.setLatLng([
            previous.lat + (riderLat - previous.lat) * eased,
            previous.lng + (riderLng - previous.lng) * eased
          ]);
          if (progress < 1) riderAnimationRef.current = requestAnimationFrame(animate);
        };
        riderAnimationRef.current = requestAnimationFrame(animate);
        riderMarkerRef.current.setIcon(riderIcon);
      } else {
        riderMarkerRef.current = L.marker([riderLat, riderLng], { icon: riderIcon })
          .addTo(map)
          .bindPopup(`<b>Delivery Partner: ${delivery?.partnerName || 'Rider'}</b><br>Speed: ${delivery?.speedKmh ?? 24} km/h`);
      }

      // Auto-follow rider camera lock
      if (isLockedOnRider) {
        map.panTo([riderLat, riderLng], { animate: true, duration: 0.8 });
      }
    } catch {
      // Graceful error catch
    }
  }, [delivery?.currentLat, delivery?.currentLng, delivery?.headingDeg, delivery?.speedKmh, activeRoutePath, altRoutePath, routeMode, isLockedOnRider]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    const sLat = delivery?.stallLat ?? 15.8522;
    const sLng = delivery?.stallLng ?? 74.5042;
    const dLat = delivery?.destinationLat ?? 15.8647;
    const dLng = delivery?.destinationLng ?? 74.5124;
    const cLat = delivery?.currentLat ?? sLat;
    const cLng = delivery?.currentLng ?? sLng;

    const bounds = L.latLngBounds([
      [sLat, sLng],
      [dLat, dLng],
      [cLat, cLng]
    ]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    setIsLockedOnRider(false);
  };

  const handleToggleRouteMode = (mode: 'OPTIMIZED' | 'STANDARD') => {
    setRouteMode(mode);
    if (onSelectRouteMode) onSelectRouteMode(mode);
  };

  const roadKm = delivery?.roadRoute?.distanceKm;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-[#f0bd9b] shadow-lg font-sans" style={{ height }}>
      {/* Map Container Element */}
      <div ref={mapContainerRef} className="w-full h-full z-10 bg-[#f9f5f0]" />

      <div className="absolute top-4 left-4 z-20 rounded-2xl border border-[#b7e4d2] bg-[#fff8f2]/95 px-3 py-2 text-xs font-bold text-emerald-800 shadow-md">
        🛣️ Recommended driving route{roadKm !== undefined ? ` (${roadKm.toFixed(1)} km)` : ''}
      </div>
      {delivery?.routeError && <div className="absolute top-14 left-4 z-20 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900 shadow">{delivery.routeError}</div>}

      {/* TOP RIGHT OVERLAY: Live Telemetry Speed Badge */}
      <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-[#291305] to-[#3d2314] text-white px-3.5 py-2 rounded-2xl border border-[#f0bd9b]/30 shadow-md flex items-center gap-3 backdrop-blur-md">
        <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-amber-300">
          <Navigation size={14} className="animate-spin text-amber-400" />
          <span>{delivery?.speedKmh ?? 24} km/h</span>
        </div>
        <span className="w-px h-4 bg-[#f0bd9b]/30" />
        <span className="text-[10px] uppercase font-bold text-[#eed7c2]">
          {delivery?.simulationMode ? 'SIMULATION DEMO' : 'LIVE GPS'}
        </span>
      </div>

      {/* RIGHT CONTROLS OVERLAY: Zoom, Lock, Recenter */}
      <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-2xl bg-[#fff8f2] hover:bg-[#fce5d2] text-[#3c1e0a] border border-[#f0bd9b] shadow-md flex items-center justify-center transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>

        <button
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-2xl bg-[#fff8f2] hover:bg-[#fce5d2] text-[#3c1e0a] border border-[#f0bd9b] shadow-md flex items-center justify-center transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>

        <button
          onClick={() => setIsLockedOnRider(!isLockedOnRider)}
          className={`w-10 h-10 rounded-2xl border shadow-md flex items-center justify-center transition-all cursor-pointer ${
            isLockedOnRider
              ? 'bg-[#b85018] text-white border-[#b85018]'
              : 'bg-[#fff8f2] text-[#7c4d2e] border-[#f0bd9b] hover:bg-[#fce5d2]'
          }`}
          title={isLockedOnRider ? 'Tracking Rider Camera Lock ON' : 'Lock Camera on Rider'}
        >
          <Crosshair size={18} className={isLockedOnRider ? 'animate-pulse' : ''} />
        </button>

        <button
          onClick={handleRecenter}
          className="w-10 h-10 rounded-2xl bg-[#fff8f2] hover:bg-[#fce5d2] text-[#3c1e0a] border border-[#f0bd9b] shadow-md flex items-center justify-center transition-colors cursor-pointer"
          title="Fit All Markers"
        >
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
};
