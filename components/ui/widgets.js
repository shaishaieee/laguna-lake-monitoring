export const calculateQuarterlyStats = (stations, targetMonths = ["Jul", "Aug", "Sep"]) => {
  let stats = {
    green: 0, yellow: 0, red: 0, black: 0,
    totalDO: 0, totalBOD: 0, count: 0
  };

  if (!stations || stations.length === 0) {
    return { ...stats, finalDO: "0.0", finalBOD: "0.0" };
  }

  stations.forEach(s => {
    const periodicData = s.monitoring_data?.filter(d => targetMonths.includes(d.month)) || [];
    
    if (periodicData.length > 0) {
      const avgDO = periodicData.reduce((a, b) => a + (b.DO || 0), 0) / periodicData.length;
      const avgBOD = periodicData.reduce((a, b) => a + (b.BOD || 0), 0) / periodicData.length;
      const avgFecal = periodicData.reduce((a, b) => a + (b.Fecal_Coliform || 0), 0) / periodicData.length;

      stats.totalDO += avgDO;
      stats.totalBOD += avgBOD;
      stats.count++;

      if (avgDO < 3 || avgBOD > 10 || avgFecal > 1000) stats.black++;
      else if (avgDO < 5 || avgBOD > 7 || avgFecal > 400) stats.red++;
      else if (avgBOD > 3 || avgFecal > 100) stats.yellow++;
      else stats.green++;
    }
  });

  return {
    ...stats,
    finalDO: stats.count > 0 ? (stats.totalDO / stats.count).toFixed(1) : "0.0",
    finalBOD: stats.count > 0 ? (stats.totalBOD / stats.count).toFixed(1) : "0.0"
  };
};