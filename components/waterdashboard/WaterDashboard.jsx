"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { MapPin, Droplets, Calendar } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function WaterDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [stations, setStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState("I");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      fetch('/api/stations')
        .then(res => res.json())
        .then(data => {
          const rawStations = data.laguna_lake_stations || data;
          setStations(rawStations);
          
          if (rawStations.length > 0) {
            setSelectedStationId(rawStations[0].id);
          }
        })
        .catch(err => console.error("Failed to fetch stations:", err));
    }
  }, [isMounted]);

  const activeStation = useMemo(() => 
    stations.find(s => s.id === selectedStationId) || stations[0],
    [selectedStationId, stations]
  );

  const chartData = useMemo(() => {
    if (!activeStation || !activeStation.monitoring_data) {
      return { labels: [], datasets: [] };
    }
    
    const rawData = activeStation.monitoring_data;

    return {
      labels: rawData.map(d => d.month),
      datasets: [
        { label: 'DO (mg/L)', data: rawData.map(d => d.DO), borderColor: '#0ea5e9', backgroundColor: 'rgba(14, 165, 233, 0.1)', fill: true, tension: 0.3 },
        { label: 'pH', data: rawData.map(d => d.pH), borderColor: '#10b981', tension: 0.3 },
        { label: 'BOD (mg/L)', data: rawData.map(d => d.BOD), borderColor: '#f59e0b', tension: 0.3 },
        { label: 'Nitrate (mg/L)', data: rawData.map(d => d.Nitrate), borderColor: '#8b5cf6', tension: 0.3 },
        { label: 'Phosphate (mg/L)', data: rawData.map(d => d.Phosphate), borderColor: '#ec4899', tension: 0.3 },
        { label: 'Ammonia (mg/L)', data: rawData.map(d => d.Ammonia), borderColor: '#64748b', tension: 0.3 },
        { label: 'Chloride (mg/L)', data: rawData.map(d => d.Chloride), borderColor: '#ef4444', tension: 0.3 },
        { label: 'Fecal Coliform', data: rawData.map(d => d.Fecal_Coliform), borderColor: '#78350f', tension: 0.3 },
      ],
    };
  }, [activeStation]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: { 
      y: { beginAtZero: true }, 
      x: { grid: { display: false } } 
    },
  };

  if (!isMounted || stations.length === 0) {
    return (
      <div className="h-screen w-full bg-gray-50 flex items-center justify-center text-[#315E26] font-bold animate-pulse">
        LOADING ANALYTICS DATA...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 md:h-[83vh] md:flex md:flex-col md:overflow-hidden">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 shrink-0">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Droplets className="text-blue-600" /> Water Quality Trends
            </h1>
            <div className="mt-1">
            <p className="text-slate-600 text-sm font-medium">
                Station: {activeStation?.name}
            </p>
            <p className="text-slate-400 text-xs flex items-center gap-1">
                <Calendar size={12} />
                Monitoring Period: {activeStation?.monitoring_data?.[0]?.month} — {activeStation?.monitoring_data?.[activeStation.monitoring_data.length - 1]?.month} 2025
            </p>
            </div>
        </div>

        <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <MapPin size={16} className="text-slate-400" />
            <select 
                value={selectedStationId} 
                onChange={(e) => setSelectedStationId(e.target.value)}
                className="bg-transparent text-xs font-bold outline-none cursor-pointer text-slate-700"
            >
                {stations.map(s => (
                <option key={s.id} value={s.id}>
                    Station {s.id}: {s.name}
                </option>
                ))}
            </select>
            </div>
        </div>
        </header>

        {/* CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1 min-h-[300px] relative">
        <div className="absolute inset-6"> 
            <Line data={chartData} options={options} />
        </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 shrink-0 pb-2">
        {chartData.datasets.map((ds) => (
            <div 
            key={ds.label} 
            className="p-3 rounded-xl border-t-4 text-center shadow-sm flex flex-col justify-center transition-all"
            style={{ 
                backgroundColor: ds.backgroundColor || `${ds.borderColor}15`, 
                borderTopColor: ds.borderColor,
                borderLeftColor: 'rgba(241, 245, 249, 1)', 
                borderRightColor: 'rgba(241, 245, 249, 1)',
                borderBottomColor: 'rgba(241, 245, 249, 1)'
            }}
            >
            <p 
                className="text-[10px] font-bold uppercase truncate mb-1"
                style={{ color: ds.borderColor }} 
            >
                {ds.label}
            </p>
            <p className="text-lg font-black text-slate-900">
                {ds.data[ds.data.length - 1] ?? 'N/A'}
            </p>
            </div>
        ))}
        </div>
    </div>
    );
}