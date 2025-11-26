import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapHeatMap.css';

interface Location {
  latitude: number;
  longitude: number;
  count: number;
  city?: string;
  country?: string;
}

interface MapHeatMapProps {
  locations: Location[];
}

export const MapHeatMap = ({ locations }: MapHeatMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Criar mapa
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([20, 0], 2);

      // Adicionar tile layer em preto e branco (CartoDB Positron)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap, © CartoDB',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Limpar marcadores anteriores
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (locations.length === 0) return;

    // Encontrar max count para intensidade
    const maxCount = Math.max(...locations.map(l => l.count), 1);

    // Agrupar localizações próximas
    const groupedLocations = locations.reduce((acc: Location[], curr) => {
      const existing = acc.find(
        loc =>
          Math.abs(loc.latitude - curr.latitude) < 5 &&
          Math.abs(loc.longitude - curr.longitude) < 5
      );

      if (existing) {
        existing.count += 1;
        if (!existing.city && curr.city) existing.city = curr.city;
        if (!existing.country && curr.country) existing.country = curr.country;
      } else {
        acc.push({ ...curr, count: 1 });
      }

      return acc;
    }, []);

    // Adicionar marcadores ao mapa
    groupedLocations.forEach((location) => {
      const intensity = Math.min(location.count / maxCount, 1);
      const size = 30 + intensity * 40;

      // HTML customizado para o marker com halos
      const html = `
        <div class="heat-marker" style="width: ${size}px; height: ${size}px;">
          <div class="heat-marker-halo heat-marker-halo-3"></div>
          <div class="heat-marker-halo heat-marker-halo-2"></div>
          <div class="heat-marker-halo heat-marker-halo-1"></div>
          <div class="heat-marker-inner"></div>
          <span class="heat-marker-count">${location.count}</span>
        </div>
      `;

      const icon = L.divIcon({
        html,
        iconSize: [size, size],
        className: 'heat-icon',
        popupAnchor: [0, -size / 2],
      });

      const marker = L.marker([location.latitude, location.longitude], { icon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div class="marker-popup">
            <strong>${location.count} scans</strong><br/>
            ${location.city && location.country ? `${location.city}, ${location.country}` : 'Localização desconhecida'}<br/>
            <small>${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°</small>
          </div>
        `);

      markersRef.current.push(marker);
    });

    // Ajustar zoom para mostrar todos os marcadores
    if (groupedLocations.length > 0 && mapRef.current) {
      const group = new L.FeatureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [locations]);

  return (
    <div className="map-heatmap-wrapper">
      <div ref={mapContainerRef} className="map-container"></div>
    </div>
  );
};
