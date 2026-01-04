"use client";
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import StatRow from '../helper/StatRow';

const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

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

    return (
      <div className="flex flex-col md:flex-row h-auto md:h-full w-full overflow-hidden bg-white">

        {/* Map Section */}
        <div className="h-[50vh] md:h-[80vh] md:flex-grow relative z-10"> 
            <MapContainer center={[14.35, 121.18]} zoom={10} className="h-full w-full z-0">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                {stations.map((station)=> (
                  <Marker 
                    key={station.id} 
                    position={station.position}
                    icon={greenIcon}
                    eventHandlers={{ click: () => setSelectedStation(station) }}
                  >
                    <Popup>
                      <div className='p-1'>
                        <h3 className='font-bold text-[#315E26]'>Station {station.id}</h3>
                        <p className='text-sm text-gray-600'>{station.name}</p>
                        <p className='text-[10px] text-blue-500 font-bold mt-1 uppercase'>Latest: {station.currentMonth}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}        
            </MapContainer>
        </div>

        {/* Details Section */}
        <div className="h-auto md:h-[80vh] md:w-1/3 bg-white border-gray-200 overflow-visible md:overflow-hidden">
          <div className="px-2 py-5 md:p-8 flex flex-col gap-6 h-full md:overflow-y-auto custom-scrollbar">
              <header>
                  <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#315E26] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">STATION</span>
                      <h2 className="text-2xl font-black text-[#315E26]">{selectedStation.id}</h2>
                  </div>
                  <p className="text-slate-500 font-medium text-sm">{selectedStation.name}</p>
                 
                  <p className="text-[10px] inline-block bg-blue-50 text-blue-600 px-2 py-0.5 rounded mt-2 font-bold uppercase tracking-wider">
                    Data Period: {selectedStation.currentMonth} 2025
                  </p>
              </header>

              <div className="w-full aspect-video rounded-2xl overflow-hidden border shadow-sm bg-gray-100 shrink-0">
                  <img 
                      src={selectedStation.imageUrl || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"} 
                      alt={selectedStation.name}
                      className="w-full h-full object-cover"
                  />
              </div>

              <div className="flex flex-col gap-3 pr-1 pb-10 md:pb-0">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Monitoring Metrics</h3>
                  <StatRow label="Dissolved Oxygen (DO)" value={selectedStation.data.do} unit="mg/L" />
                  <StatRow label="pH Level" value={selectedStation.data.ph} unit="pH" />
                  <StatRow label="Biochemical Oxygen Demand (BOD)" value={selectedStation.data.bod} unit="mg/L" />
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