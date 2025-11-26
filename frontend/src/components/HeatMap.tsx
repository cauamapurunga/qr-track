import { Card } from '../components';
import './HeatMap.css';

interface Location {
  latitude: number;
  longitude: number;
  count: number;
  city?: string;
  country?: string;
}

interface HeatMapProps {
  locations: Location[];
}

export const HeatMap = ({ locations }: HeatMapProps) => {
  // Agrupar localizações próximas (raio muito maior para visão bem ampla)
  const groupedLocations = locations.reduce((acc: Location[], curr) => {
    const existing = acc.find(
      loc => 
        Math.abs(loc.latitude - curr.latitude) < 20 && 
        Math.abs(loc.longitude - curr.longitude) < 20
    );
    
    if (existing) {
      existing.count += 1;
      // Atualizar cidade/país se não existir
      if (!existing.city && curr.city) existing.city = curr.city;
      if (!existing.country && curr.country) existing.country = curr.country;
    } else {
      acc.push({ ...curr, count: 1 });
    }
    
    return acc;
  }, []);

  // Encontrar o maior valor para normalizar
  const maxCount = Math.max(...groupedLocations.map(l => l.count), 1);

  // Calcular posição no mapa (para SVG 960x600)
  const getPosition = (lat: number, lon: number) => {
    // Web Mercator projection simplificado
    const x = ((lon + 180) / 360) * 960;
    const y = (90 - lat) * (600 / 180);
    return { x, y };
  };

  // Calcular intensidade da cor (escala mais suave)
  const getIntensity = (count: number) => {
    return Math.min(count / maxCount, 1);
  };

  if (locations.length === 0) {
    return (
      <Card className="heatmap-card">
        <h2>Mapa de Calor</h2>
        <div className="heatmap-empty">
          <p>Nenhuma localização disponível ainda</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="heatmap-card">
      <h2>Mapa de Calor - Localizações dos Scans</h2>
      <div className="heatmap-info">
        <p><strong>{locations.length}</strong> scans de <strong>{groupedLocations.length}</strong> localizações diferentes</p>
      </div>
      
      <div className="heatmap-container">
        <div className="world-map">
          {/* Mapa mundial com SVG */}
          <svg className="map-svg" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid meet">
            {/* Fundo - oceano em azul claro */}
            <rect width="960" height="600" fill="#e8f4f8" stroke="#000000" strokeWidth="2"/>
            
            {/* Continentes - terra em cinza claro com bordas pretas */}
            <g fill="#f5f5f5" stroke="#333333" strokeWidth="1.5">
              {/* América do Norte */}
              <path d="M 80 120 Q 150 100 200 140 L 210 200 Q 160 220 120 200 Z"/>
              {/* América Central e Caribe */}
              <path d="M 120 200 L 210 200 L 200 260 L 110 250 Z"/>
              {/* América do Sul */}
              <path d="M 110 250 L 200 260 Q 180 350 130 380 L 100 300 Z"/>
              
              {/* Europa e Reino Unido */}
              <path d="M 380 100 Q 420 80 450 100 L 460 180 Q 400 190 360 160 Z"/>
              {/* Norte da África e Oriente Médio */}
              <path d="M 380 180 L 460 180 Q 520 200 560 220 L 500 280 L 400 260 Z"/>
              {/* África */}
              <path d="M 400 260 L 500 280 Q 520 350 480 430 L 400 420 L 380 300 Z"/>
              
              {/* Rússia */}
              <path d="M 420 80 Q 550 60 680 100 L 680 180 Q 550 200 450 160 Z"/>
              {/* Ásia Central e Sul */}
              <path d="M 450 160 L 680 180 Q 700 240 650 300 L 550 280 L 480 200 Z"/>
              {/* Ásia do Leste */}
              <path d="M 650 300 Q 720 280 750 320 L 720 380 Q 680 360 600 340 Z"/>
              {/* Austrália e Oceania */}
              <path d="M 720 380 Q 760 400 780 430 L 750 460 Q 720 440 700 410 Z"/>
              
              {/* Groenlândia */}
              <path d="M 420 30 L 450 40 L 440 80 L 410 70 Z"/>
              {/* Islândia */}
              <path d="M 340 80 L 360 75 L 365 95 L 345 100 Z"/>
              {/* Nova Zelândia */}
              <path d="M 820 420 L 840 410 L 845 450 L 825 460 Z"/>
            </g>
            
            {/* Linhas de latitude e longitude bem sutis */}
            <g stroke="#d0d0d0" strokeWidth="0.8" opacity="0.4" strokeDasharray="4,4">
              {/* Equador */}
              <line x1="0" y1="300" x2="960" y2="300"/>
              {/* Trópicos */}
              <line x1="0" y1="180" x2="960" y2="180"/>
              <line x1="0" y1="420" x2="960" y2="420"/>
              {/* Meridiano de Greenwich */}
              <line x1="480" y1="0" x2="480" y2="600"/>
            </g>
            
            {/* Pontos de atividade com bolinhas */}
            {groupedLocations.map((location, idx) => {
              const pos = getPosition(location.latitude, location.longitude);
              const intensity = getIntensity(location.count);
              const size = 6 + (intensity * 14);
              
              return (
                <g key={idx}>
                  {/* Halo externo bem suave */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size * 5}
                    fill="rgba(0, 191, 166, 0.1)"
                  />
                  {/* Halo médio */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size * 3}
                    fill="rgba(0, 191, 166, 0.2)"
                  />
                  {/* Halo interno */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size * 1.5}
                    fill="rgba(0, 191, 166, 0.35)"
                  />
                  {/* Ponto principal */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size}
                    fill="#00BFA6"
                    stroke="#000"
                    strokeWidth="1"
                  />
                  {/* Número de scans */}
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontSize={Math.max(6, size * 0.7)}
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {location.count}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="heatmap-legend">
        <h3>Legenda</h3>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'rgba(0, 191, 166, 0.3)' }}></div>
            <span>Baixa atividade</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'rgba(0, 191, 166, 0.6)' }}></div>
            <span>Média atividade</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'rgba(0, 191, 166, 1)' }}></div>
            <span>Alta atividade</span>
          </div>
        </div>
      </div>

      <div className="heatmap-locations">
        <h3>Top Localizações</h3>
        <div className="locations-list">
          {groupedLocations
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .map((location, idx) => (
              <div key={idx} className="location-item">
                <div className="location-info">
                  <span className="location-name">
                    {location.city && location.country 
                      ? `${location.city}, ${location.country}`
                      : 'Localização desconhecida'
                    }
                  </span>
                  <span className="location-coords">
                    ({location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°)
                  </span>
                </div>
                <span className="location-count">{location.count} scans</span>
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
};
