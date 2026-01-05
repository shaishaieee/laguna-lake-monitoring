"use client";
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import StatRow from '../helper/StatRow';
import { getQuarterlyIcon } from '../mapIcon/Icon';
import { calculateQuarterlyStats } from '../ui/widgets';

export default function LakeMap() {
    const [isMounted, setIsMounted] = useState(false);
    const [stations, setStations] = useState([]); 
    const [selectedStation, setSelectedStation] = useState(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            fetch('/api/stations')
                .then(res => res.json())
                .then(data => {
                    const rawStations = data.laguna_lake_stations || data; 

                    const processedStations = rawStations.map(station => {
                        const history = station.monitoring_data;
                        const latest = history[history.length - 1]; 

                        return {
                            ...station,
                            data: {
                                do: latest.DO,
                                ph: latest.pH,
                                bod: latest.BOD,
                                ammonia: latest.Ammonia || "N/A",
                                nitrate: latest.Nitrate || "N/A",
                                fecal: latest.Fecal_Coliform || "N/A",
                                chloride: latest.Chloride || "N/A",
                                phosphate: latest.Phosphate || "N/A",
                            },
                            currentMonth: latest.month
                        };
                    });

                    setStations(processedStations);
                    setSelectedStation(processedStations[0]);
                })
                .catch(err => console.error("Failed to fetch stations:", err));
        }
    }, [isMounted]);
    
    if (!isMounted || !selectedStation) {
        return <div className="h-screen w-full bg-gray-100 animate-pulse flex items-center justify-center text-[#315E26] font-bold">
            FETCHING LATEST MONITORING DATA...
        </div>;
    }

    const currentMonths = ["Jul", "Aug", "Sep"]; 
    const stats = calculateQuarterlyStats(stations, currentMonths);

   return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[83vh] w-full bg-white lg:overflow-hidden">

        {/* LEFT SECTION*/}
        <div className="flex flex-col w-full lg:w-2/3 h-auto lg:h-full p-4 lg:p-6 gap-4 border-b lg:border-b-0 lg:border-r border-slate-100">
        {/* Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
            <div className="bg-[#f0fdf4] p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Lake Health Overview</span>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-sm font-bold text-slate-700">{stats.green}</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /><span className="text-sm font-bold text-slate-700">{stats.yellow}</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500" /><span className="text-sm font-bold text-slate-700">{stats.red}</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-900" /><span className="text-sm font-bold text-slate-700">{stats.black}</span></div>
            </div>
            </div>

            <div className="bg-[#f0fdf4] p-5 rounded-2xl shadow-sm border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Dissolved Oxygen</span>
            <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-black text-slate-800">{stats.finalDO}</span>
                <span className="text-xs font-medium text-slate-400">mg/L</span>
            </div>
            </div>

            <div className="bg-[#f0fdf4] p-5 rounded-2xl shadow-sm border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Biochemical Demand</span>
            <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-black text-slate-800">{stats.finalBOD}</span>
                <span className="text-xs font-medium text-slate-400">mg/L</span>
            </div>
            </div>
        </div>

        {/* Map */}
        <div className="h-[400px] lg:flex-grow relative rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-white">
            <div className="absolute z-[1000] bottom-0 left-0 right-0 sm:bottom-4 sm:right-4 sm:left-auto bg-white/90 backdrop-blur-md px-4 py-3 sm:rounded-xl shadow-lg border-t sm:border border-slate-200/50">
            {/* Legend */}
            <div className="flex flex-row sm:flex-col justify-around gap-4 sm:gap-2">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-[11px] font-semibold text-slate-600">Good</span></div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /><span className="text-[11px] font-semibold text-slate-600">Fair</span></div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /><span className="text-[11px] font-semibold text-slate-600">Poor</span></div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-900" /><span className="text-[11px] font-semibold text-slate-600">Polluted</span></div>
            </div>
            </div>

            <MapContainer center={[14.35, 121.18]} zoom={10} className="h-full w-full z-0">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
            {stations.map((station) => (
                <Marker 
                key={station.id} 
                position={station.position} 
                icon={getQuarterlyIcon(station.monitoring_data)}
                eventHandlers={{ click: () => setSelectedStation(station) }}
                >
                    <Popup minWidth={200}>
                        <div className="p-1">
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1 mb-1">
                            Station {station.id}: {station.name}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            {station.description || "Monitoring water quality parameters for Laguna Lake."}
                        </p>
                        </div>
                    </Popup>
                </Marker>
            ))}
            </MapContainer>
        </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full lg:w-1/3 h-auto bg-white overflow-visible lg:overflow-hidden">
        <div className="px-6 pt-8 flex flex-col gap-6 h-full lg:overflow-y-auto custom-scrollbar">
            <header>
                <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#315E26] text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Station</span>
                <h2 className="text-2xl font-black text-[#315E26]">{selectedStation.id}</h2>
                </div>
                <p className="text-slate-500 font-medium text-lg leading-tight">{selectedStation.name}</p>
                <p className="text-[10px] inline-block bg-blue-50 text-blue-600 px-2 py-0.5 rounded mt-2 font-bold uppercase tracking-wider">
                Data Period: {selectedStation.currentMonth} 2025
                </p>
            </header>

            <div className="w-full aspect-video rounded-2xl overflow-hidden border shadow-sm bg-slate-50 shrink-0">
                <img src={selectedStation.imageUrl} alt={selectedStation.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col gap-3 pr-1 pb-10">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Monitoring Metrics</h3>
                <StatRow label="Dissolved Oxygen (DO)" value={selectedStation.data.do} unit="mg/L" />
                <StatRow label="pH Level" value={selectedStation.data.ph} unit="pH" />
                <StatRow label="BOD" value={selectedStation.data.bod} unit="mg/L" />
                <StatRow label="Fecal Coliform" value={selectedStation.data.fecal} unit="MPN/100mL" />
                <StatRow label="Ammonia" value={selectedStation.data.ammonia} unit="mg/L" />
                <StatRow label="Nitrate" value={selectedStation.data.nitrate} unit="mg/L" />
                <StatRow label="Phosphate" value={selectedStation.data.phosphate} unit="mg/L" />
                <StatRow label="Chloride" value={selectedStation.data.chloride} unit="mg/L" />
            </div>
        </div>
        </div>
    </div>
    );
}