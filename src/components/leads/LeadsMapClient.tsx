'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngBounds } from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { LeadFilter } from '@/lib/types';
import { Lead } from '../lead-table/types';

const getMarkerColor = (score: number) => {
  if (score >= 71) return 'green'; // best leads
  if (score >= 31) return 'orange'; // mid
  return 'red'; // less valuable
};

const createIcon = (color: string) =>
  new L.Icon({
    iconUrl: `/icons/marker-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

export default function LeadsMap({ filters }: { filters: LeadFilter }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await fetch('/api/leads', {
        method: 'POST',
        body: JSON.stringify({ filters }),
      });

      const data: Lead[] = await res.json();
      setLeads(data);

      // After leads load, fit the map to their bounds
      if (mapRef.current && data.length > 0) {
        const bounds = new LatLngBounds(
          data
            .filter((l) => l.lat && l.lng)
            .map((l) => [Number(l.lat), Number(l.lng)] as [number, number])
        );

        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds, { padding: [40, 40] });
        }
      }
    };

    fetchLeads();
  }, [filters]);

  return (
    <MapContainer
      center={[43.6532, -79.3832]} // initial center = Toronto
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: '600px', width: '100%' }}
      className='rounded-lg border'
      ref={(mapElement) => {
        if (mapElement) {
          mapRef.current = mapElement;
        }
      }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {leads
        .filter((lead) => lead.lat && lead.lng)
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
