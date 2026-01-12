import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function EventManager() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });
    if (data) setEvents(data);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
        Gestion des Événements
      </h2>
      <button className="mb-6 flex items-center space-x-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg">
        <Plus className="w-5 h-5" />
        <span>Ajouter un événement</span>
      </button>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-lg">{event.name}</h3>
            <p className="text-sm text-gray-600">{event.location}</p>
            <p className="text-sm text-pink-600">{new Date(event.event_date).toLocaleDateString('fr-FR')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
