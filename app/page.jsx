import MapWrapper from '@/components/leaflet/MapWrapper';

export default function Page() {
  return (
    <main className='flex flex-col h-full'>
      <div className='px-8 py-4'>
        <MapWrapper />
      </div>
    </main>
  );
}