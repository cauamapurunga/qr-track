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

  // Calcular posição no mapa (simplificado)
  const getPosition = (lat: number, lon: number) => {
    // Normalizar para 0-100%
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  // Calcular intensidade da cor (escala mais suave)
  const getIntensity = (count: number) => {
    return Math.min(count / maxCount, 1);
  };

  // Gerar cor baseada na intensidade (mais visível)
  const getColor = (intensity: number) => {
    const green = Math.round(191 * (0.5 + intensity * 0.5)); // Mínimo 50% de verde
    const alpha = 0.5 + (intensity * 0.5); // Mínimo 50% de opacidade
    return `rgba(0, ${green}, 166, ${alpha})`;
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
          {/* Mapa mundial simplificado */}
          <svg className="map-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
            {/* Fundo do mapa branco com borda preta */}
            <rect width="1000" height="500" fill="#ffffff" stroke="#000" strokeWidth="3"/>
            
            {/* Linhas de grid sutis */}
            {[...Array(9)].map((_, i) => (
              <line 
                key={`v-${i}`}
                x1={(i + 1) * 100} 
                y1="0" 
                x2={(i + 1) * 100} 
                y2="500" 
                stroke="#e0e0e0" 
                strokeWidth="1"
              />
            ))}
            {[...Array(5)].map((_, i) => (
              <line 
                key={`h-${i}`}
                x1="0" 
                y1={i * 100} 
                x2="1000" 
                y2={i * 100} 
                stroke="#e0e0e0" 
                strokeWidth="1"
              />
            ))}
            
            {/* Pontos verdes de calor */}
            {groupedLocations.map((location, idx) => {
              const pos = getPosition(location.latitude, location.longitude);
              const intensity = getIntensity(location.count);
              const size = 25 + (intensity * 60);
              
              return (
                <g key={idx}>
                  {/* Halo externo verde claro bem amplo */}
                  <circle
                    cx={pos.x * 10}
                    cy={pos.y * 10}
                    r={size * 3}
                    fill="rgba(0, 191, 166, 0.08)"
                  />
                  {/* Halo médio */}
                  <circle
                    cx={pos.x * 10}
                    cy={pos.y * 10}
                    r={size * 2}
                    fill="rgba(0, 191, 166, 0.2)"
                  />
                  {/* Ponto principal verde */}
                  <circle
                    cx={pos.x * 10}
                    cy={pos.y * 10}
                    r={size}
                    fill="#00BFA6"
                    stroke="#000"
                    strokeWidth="3"
                  />
                  {/* Contador */}
                  <text
                    x={pos.x * 10}
                    y={pos.y * 10}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontSize="16"
                    fontWeight="bold"
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
