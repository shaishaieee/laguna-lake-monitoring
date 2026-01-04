"use client";

import dynamic from 'next/dynamic';

const LakeMap = dynamic(() => import('@/components/leaflet/LakeMap'), { 
  ssr: false, 
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">
      Loading Map...
    </div>
  )
});

export default function MapWrapper() {
  return <LakeMap/>;
}