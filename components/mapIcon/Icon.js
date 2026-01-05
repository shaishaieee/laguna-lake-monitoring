import L from 'leaflet';

const createMarkerIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const icons = {
  green: createMarkerIcon('green'),
  yellow: createMarkerIcon('gold'), 
  red: createMarkerIcon('red'),
  black: createMarkerIcon('black'),
  gray: createMarkerIcon('grey')
};

export const getQuarterlyIcon = (monitoringData) => {
  if (!monitoringData || monitoringData.length === 0) return icons.gray;

  const q3Months = ["Jul", "Aug", "Sep"];
  const q3Data = monitoringData.filter(d => q3Months.includes(d.month));

  if (q3Data.length === 0) return icons.gray;

  const getAvg = (key) => {
    const values = q3Data.map(d => d[key]).filter(v => v !== null && v !== undefined);
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
  };

  const avgDO = getAvg("DO");
  const avgBOD = getAvg("BOD");
  const avgFecal = getAvg("Fecal_Coliform");

  if (avgDO < 3 || avgBOD > 10 || avgFecal > 1000) return icons.black;
  if (avgDO < 5 || avgBOD > 7 || avgFecal > 400) return icons.red;
  if (avgBOD > 3 || avgFecal > 100) return icons.yellow;
  
  return icons.green;
};