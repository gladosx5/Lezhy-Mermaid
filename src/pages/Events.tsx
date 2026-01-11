import { useEffect, useState } from 'react';
import { MapPin, Calendar as CalendarIcon, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Event {
  id: string;
  name: string;
  description: string | null;
  location: string;
  event_date: string;
  end_date: string | null;
  image_url: string | null;
  is_archived: boolean;
}

export function Events() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const today = new Date().toISOString().split('T')[0];

    const { data: upcoming } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', today)
      .eq('is_archived', false)
      .order('event_date', { ascending: true });

    const { data: past } = await supabase
      .from('events')
      .select('*')
      .lt('event_date', today)
      .order('event_date', { ascending: false });

    if (upcoming) setUpcomingEvents(upcoming);
    if (past) setPastEvents(past);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateRange = (startDate: string, endDate: string | null) => {
    if (!endDate || startDate === endDate) {
      return formatDate(startDate);
    }
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const EventCard = ({ event }: { event: Event }) => (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
      {event.image_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={event.image_url}
            alt={event.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">
          {event.name}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-start space-x-2 text-gray-600">
            <CalendarIcon className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
            <span>{formatDateRange(event.event_date, event.end_date)}</span>
          </div>
          <div className="flex items-start space-x-2 text-gray-600">
            <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <span>{event.location}</span>
          </div>
        </div>

        {event.description && (
          <p className="text-gray-600 leading-relaxed">{event.description}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full mb-4">
            <CalendarIcon className="w-5 h-5 text-pink-400" />
            <span className="text-sm font-medium text-gray-700">Conventions & événements</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Événements
          </h1>
          <p className="text-gray-600 text-lg">Retrouvez-moi lors des conventions et guest spots</p>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <span className="mr-3">✨</span>
              À venir
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 rounded-full mb-4">
              <Info className="w-10 h-10 text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun événement prévu</h3>
            <p className="text-gray-600">Les prochaines dates seront bientôt annoncées!</p>
          </div>
        )}

        {pastEvents.length > 0 && (
          <div>
            <button
              onClick={() => setShowPast(!showPast)}
              className="w-full md:w-auto mx-auto flex items-center justify-center space-x-2 bg-white px-6 py-3 rounded-full text-gray-700 font-medium shadow-lg hover:shadow-xl transition-all mb-8"
            >
              <span>{showPast ? 'Masquer' : 'Voir'} les événements passés</span>
              <span className="text-pink-400">({pastEvents.length})</span>
            </button>

            {showPast && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                  <span className="mr-3">📅</span>
                  Archives
                </h2>
                <div className="grid md:grid-cols-2 gap-6 opacity-75">
                  {pastEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
