import api from './api';

export interface ScanAnalytic {
  id: number;
  ip_address: string;
  browser: string | null;
  browser_version: string | null;
  os: string | null;
  os_version: string | null;
  device: string | null;
  country: string | null;
  city: string | null;
  latitude: string | null;
  longitude: string | null;
  timezone: string | null;
  isp: string | null;
  scanned_at: string;
}

export interface BrowserStats {
  name: string;
  count: number;
}

export interface OSStats {
  name: string;
  count: number;
}

export interface DeviceStats {
  type: string;
  count: number;
}

export interface CityStats {
  name: string;
  count: number;
}

export interface CountryStats {
  name: string;
  count: number;
  top_cities: CityStats[];
}

export interface AnalyticsData {
  qr_code: {
    id: number;
    code: string;
    destination_url: string;
    created_at: string;
    scan_count: number;
  };
  total_scans: number;
  unique_visitors: number;
  scans: ScanAnalytic[];
  top_browsers: BrowserStats[];
  top_os: OSStats[];
  top_devices: DeviceStats[];
  top_countries: CountryStats[];
}

export const analyticsService = {
  getAnalytics: async (code: string, days?: number): Promise<AnalyticsData> => {
    const params = days ? { days } : {};
    const response = await api.get(`/analytics/${code}`, { params });
    return response.data;
  }
};
