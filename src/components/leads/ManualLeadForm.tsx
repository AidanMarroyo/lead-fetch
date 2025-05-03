/// <reference types="@types/google.maps" />

'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '../ui/input';

type PlaceResult = {
  place_id: string;
  description: string;
};

type GoogleAuditLead = {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  place_id: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: { weekday_text: string[] };
  photos?: {
    height: number;
    html_attributions: string[];
    photo_reference: string;
    width: number;
  }[];
  types?: string[];
};

export default function ManualLeadForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [selected, setSelected] = useState<GoogleAuditLead | null>(null);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const res = await fetch(`/api/get-place-details?placeId=${placeId}`);
      const data = await res.json();
      if (res.ok) {
        setSelected(data);
        setLoading(false);
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
      <Input
        ref={inputRef}
        type='text'
        placeholder='Search business name or address'
        disabled={loading}
      />

      {loading && (
        <div className='text-sm text-muted-foreground flex items-center gap-2'>
          <svg
            className='animate-spin h-4 w-4 text-muted-foreground'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8v8H4z'
            ></path>
          </svg>
          Fetching place details...
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <ul className='border rounded p-2'>
          {suggestions.map((s) => (
            <li key={s.place_id}>
              <button
                onClick={() => handleSelect(s.place_id)}
                className='text-left w-full py-1 hover:underline hover:cursor-pointer disabled:opacity-50'
                disabled={loading}
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
          {selected.rating && (
            <p>
              <strong>Rating:</strong> {selected.rating} ⭐
            </p>
          )}
          {selected.user_ratings_total !== undefined && (
            <p>
              <strong>Total Reviews:</strong> {selected.user_ratings_total}
            </p>
          )}
          {selected.opening_hours?.weekday_text && (
            <div>
              <strong>Hours:</strong>
              <ul className='list-disc ml-5 text-sm'>
                {selected.opening_hours.weekday_text.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}
          {(selected.types ?? []).length > 0 && (
            <p>
              <strong>Categories:</strong> {(selected.types ?? []).join(', ')}
            </p>
          )}
          <Button onClick={handleSave}>✅ Save to Leads</Button>
        </div>
      )}
    </div>
  );
}
