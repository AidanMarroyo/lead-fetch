'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { LeadFilter } from '@/lib/types';
import { Lead } from '../lead-table/types';

const getMarkerColor = (score: number) => {
  if (score >= 80) return 'green';
  if (score >= 50) return 'orange';
  return 'red';
};

const createIcon = (color: string) =>
  new L.Icon({
    iconUrl: `/icons/marker-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

export function LeadsMap({ filters }: { filters: LeadFilter }) {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await fetch('/api/leads', {
        method: 'POST',
        body: JSON.stringify({ filters }),
      });
      const data = await res.json();
      setLeads(data);
    };

    fetchLeads();
  }, [filters]);

  return (
    <MapContainer
      center={[43.6532, -79.3832]} // Default center (Toronto)
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: '600px', width: '100%' }}
      className='rounded-lg border'
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {leads
        .filter((lead) => !!lead.lat && !!lead.lng)
        .map((lead) => {
          const color = getMarkerColor(lead.score);
          return (
            <Marker
              key={lead.id}
              position={[Number(lead.lat), Number(lead.lng)]}
              icon={createIcon(color)}
            >
              <Popup>
                <strong>{lead.name}</strong>
                <br />
                Score: {lead.score}
                <br />
                {lead.address}
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
}
