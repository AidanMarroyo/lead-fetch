/// <reference types="@types/google.maps" />

'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Lead } from '@/components/crm-board/types';

type PlaceResult = {
  place_id: string;
  description: string;
};

export default function ManualLeadForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);

  useEffect(() => {
    let autocompleteService: google.maps.places.AutocompleteService | null =
      null;
    let debounceTimer: NodeJS.Timeout;

    const initAutocomplete = () => {
      if (!window.google?.maps?.places) return;
      autocompleteService = new window.google.maps.places.AutocompleteService();

      const handleInput = () => {
        const value = inputRef.current?.value;
        if (!value || !autocompleteService) return setSuggestions([]);

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          autocompleteService!.getPlacePredictions(
            { input: value, types: ['establishment'] },
            (
              predictions: google.maps.places.AutocompletePrediction[] | null
            ) => {
              if (predictions) {
                setSuggestions(
                  predictions.map((p) => ({
                    place_id: p.place_id,
                    description: p.description,
                  }))
                );
              }
            }
          );
        }, 300);
      };

      inputRef.current?.addEventListener('input', handleInput);

      return () => {
        inputRef.current?.removeEventListener('input', handleInput);
      };
    };

    const waitForGoogle = () => {
      if (window.google?.maps?.places) {
        initAutocomplete();
      } else {
        const interval = setInterval(() => {
          if (window.google?.maps?.places) {
            clearInterval(interval);
            initAutocomplete();
          }
        }, 200);
      }
    };

    waitForGoogle();
  }, []);

  const handleSelect = async (placeId: string) => {
    try {
      const res = await fetch(`/api/get-place-details?placeId=${placeId}`);
      const data = await res.json();
      if (res.ok) {
        setSelected(data);
      } else {
        toast.error('Failed to fetch place details');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching place details');
    }
  };

  const handleSave = async () => {
    if (!selected) return;

    const res = await fetch('/api/save-lead-manual', {
      method: 'POST',
      body: JSON.stringify(selected),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success('Lead saved successfully');
      setSelected(null);
      setSuggestions([]);
      if (inputRef.current) inputRef.current.value = '';
    } else {
      toast.error(data.error || 'Failed to save lead');
    }
  };

  return (
    <div className='space-y-4'>
      <input
        ref={inputRef}
        type='text'
        placeholder='Search business name or address'
        className='w-full p-2 border rounded'
      />

      {suggestions.length > 0 && (
        <ul className='border rounded p-2'>
          {suggestions.map((s) => (
            <li key={s.place_id}>
              <button
                onClick={() => handleSelect(s.place_id)}
                className='text-left w-full py-1 hover:underline'
              >
                {s.description}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div className='border rounded p-4 space-y-2 bg-muted'>
          <p>
            <strong>Name:</strong> {selected.name}
          </p>
          <p>
            <strong>Address:</strong> {selected.address}
          </p>
          {selected.phone && (
            <p>
              <strong>Phone:</strong> {selected.phone}
            </p>
          )}
          {selected.website && (
            <p>
              <strong>Website:</strong> {selected.website}
            </p>
          )}
          <Button onClick={handleSave}>✅ Save to Leads</Button>
        </div>
      )}
    </div>
  );
}
