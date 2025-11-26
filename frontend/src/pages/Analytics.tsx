import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analyticsService, AnalyticsData } from '../services/analyticsService';
import { Button, Card, MapHeatMap } from '../components';
import './Analytics.css';

export const Analytics = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<number | undefined>(undefined);
  const [customDays, setCustomDays] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [code, filter]);

  const loadAnalytics = async () => {
    if (!code) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await analyticsService.getAnalytics(code, filter);
      setAnalytics(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="container">
          <p className="loading-text">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <div className="container">
          <Card className="error-card">
            <h2>Erro</h2>
            <p>{error}</p>
            <Button onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="analytics-container">
      <div className="container">
        <header className="analytics-header">
          <div className="header-content">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              ← Voltar
            </Button>
            <h1>Analytics - {analytics.qr_code.code}</h1>
          </div>
          
          <div className="filter-buttons">
            <button 
              className={filter === undefined ? 'filter-btn active' : 'filter-btn'}
              onClick={() => {
                setFilter(undefined);
                setShowCustomInput(false);
              }}
            >
              Tudo
            </button>
            <button 
              className={filter === 7 ? 'filter-btn active' : 'filter-btn'}
              onClick={() => {
                setFilter(7);
                setShowCustomInput(false);
              }}
            >
              7 dias
            </button>
            <button 
              className={filter === 30 ? 'filter-btn active' : 'filter-btn'}
              onClick={() => {
                setFilter(30);
                setShowCustomInput(false);
              }}
            >
              30 dias
            </button>
            <button 
              className={showCustomInput ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setShowCustomInput(!showCustomInput)}
            >
              Personalizado
            </button>
            {showCustomInput && (
              <div className="custom-filter-input">
                <input
                  type="number"
                  placeholder="Dias"
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  min="1"
                  className="days-input"
                />
                <button 
                  className="apply-btn"
                  onClick={() => {
                    const days = parseInt(customDays);
                    if (days > 0) {
                      setFilter(days);
                    }
                  }}
                >
                  Aplicar
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="analytics-grid">
          <Card className="stat-card">
            <h3>Total de Scans</h3>
            <p className="stat-value">{analytics.total_scans}</p>
          </Card>

          <Card className="stat-card">
            <h3>Visitantes Únicos</h3>
            <p className="stat-value">{analytics.unique_visitors}</p>
          </Card>

          <Card className="stat-card">
            <h3>URL de Destino</h3>
            <p className="stat-url">{analytics.qr_code.destination_url}</p>
          </Card>

          <Card className="stat-card">
            <h3>Criado em</h3>
            <p className="stat-date">{formatDate(analytics.qr_code.created_at)}</p>
          </Card>
        </div>

        <Card className="heatmap-card">
          <h2>Mapa de Calor - Localizações dos Scans</h2>
          <MapHeatMap 
            locations={analytics.scans
              .filter(scan => scan.latitude && scan.longitude)
              .map(scan => ({
                latitude: parseFloat(scan.latitude!),
                longitude: parseFloat(scan.longitude!),
                count: 1,
                city: scan.city || undefined,
                country: scan.country || undefined
              }))
            }
          />
        </Card>

        <div className="analytics-details">
          <Card className="detail-card">
            <h2>Navegadores</h2>
            {analytics.top_browsers.length > 0 ? (
              <div className="stat-list">
                {analytics.top_browsers.map((browser, idx) => (
                  <div key={idx} className="stat-item">
                    <span className="stat-label">{browser.name || 'Desconhecido'}</span>
                    <span className="stat-count">{browser.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-stat">Nenhum dado disponível</p>
            )}
          </Card>

          <Card className="detail-card">
            <h2>Sistemas Operacionais</h2>
            {analytics.top_os.length > 0 ? (
              <div className="stat-list">
                {analytics.top_os.map((os, idx) => (
                  <div key={idx} className="stat-item">
                    <span className="stat-label">{os.name || 'Desconhecido'}</span>
                    <span className="stat-count">{os.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-stat">Nenhum dado disponível</p>
            )}
          </Card>

          <Card className="detail-card">
            <h2>Dispositivos</h2>
            {analytics.top_devices.length > 0 ? (
              <div className="stat-list">
                {analytics.top_devices.map((device, idx) => (
                  <div key={idx} className="stat-item">
                    <span className="stat-label">{device.type || 'Desconhecido'}</span>
                    <span className="stat-count">{device.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-stat">Nenhum dado disponível</p>
            )}
          </Card>

          <Card className="detail-card full-width">
            <h2>Países</h2>
            {analytics.top_countries.length > 0 ? (
              <div className="countries-list">
                {analytics.top_countries.map((country, idx) => (
                  <div key={idx} className="country-item">
                    <div className="country-header">
                      <span className="stat-label">{country.name || 'Desconhecido'}</span>
                      <span className="stat-count">{country.count}</span>
                    </div>
                    {country.top_cities.length > 0 && (
                      <div className="cities-list">
                        {country.top_cities.map((city, cidx) => (
                          <div key={cidx} className="city-item">
                            <span className="city-label">{city.name}</span>
                            <span className="city-count">{city.count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-stat">Nenhum dado disponível</p>
            )}
          </Card>
        </div>

        <Card className="scans-timeline">
          <h2>Timeline de Scans</h2>
          {analytics.scans.length > 0 ? (
            <div className="timeline-list">
              {analytics.scans.slice().reverse().map((scan) => (
                <div key={scan.id} className="timeline-item">
                  <div className="timeline-date">{formatDate(scan.scanned_at)}</div>
                  <div className="timeline-details">
                    <p><strong>IP:</strong> {scan.ip_address}</p>
                    {scan.browser && <p><strong>Navegador:</strong> {scan.browser} {scan.browser_version}</p>}
                    {scan.os && <p><strong>OS:</strong> {scan.os} {scan.os_version}</p>}
                    {scan.device && <p><strong>Dispositivo:</strong> {scan.device}</p>}
                    {scan.country && <p><strong>Localização:</strong> {scan.city}, {scan.country}</p>}
                    {scan.isp && <p><strong>ISP:</strong> {scan.isp}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-stat">Nenhum scan registrado ainda</p>
          )}
        </Card>
      </div>
    </div>
  );
};
