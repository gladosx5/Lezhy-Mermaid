import { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AvailabilitySlot {
  id: string;
  date: string;
  time_slot: string;
  is_available: boolean;
  notes: string | null;
}

export function Availability() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);

  useEffect(() => {
    loadAvailability();
  }, [currentMonth]);

  const loadAvailability = async () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const { data } = await supabase
      .from('availability')
      .select('*')
      .gte('date', startOfMonth.toISOString().split('T')[0])
      .lte('date', endOfMonth.toISOString().split('T')[0]);

    if (data) {
      setAvailability(data);
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getAvailabilityForDate = (day: number) => {
    const dateStr = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    ).toISOString().split('T')[0];

    return availability.filter(slot => slot.date === dateStr);
  };

  const isDateInPast = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full mb-4">
            <Calendar className="w-5 h-5 text-pink-400" />
            <span className="text-sm font-medium text-gray-700">Calendrier de disponibilités</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Disponibilités
          </h1>
          <p className="text-gray-600 text-lg">Consultez mes créneaux disponibles pour votre tatouage</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={previousMonth}
              className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-pink-600" />
            </button>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent capitalize">
              {monthName}
            </h2>
            <button
              onClick={nextMonth}
              className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-pink-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth().map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const slots = getAvailabilityForDate(day);
              const isAvailable = slots.some(slot => slot.is_available);
              const isPast = isDateInPast(day);

              return (
                <div
                  key={day}
                  className={`aspect-square rounded-xl p-2 border-2 transition-all ${
                    isPast
                      ? 'bg-gray-50 border-gray-200 opacity-50'
                      : isAvailable
                      ? 'bg-gradient-to-br from-pink-100 to-purple-100 border-pink-300 hover:shadow-lg cursor-pointer'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                  {slots.length > 0 && !isPast && (
                    <div className="space-y-1">
                      {slots.slice(0, 2).map(slot => (
                        <div
                          key={slot.id}
                          className={`text-xs px-1 py-0.5 rounded ${
                            slot.is_available
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {slot.time_slot}
                        </div>
                      ))}
                      {slots.length > 2 && (
                        <div className="text-xs text-gray-500">+{slots.length - 2}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-pink-300"></div>
              <span className="text-sm text-gray-600">Disponible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gray-50 border-2 border-gray-200"></div>
              <span className="text-sm text-gray-600">Indisponible</span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl shadow-xl p-8 text-white text-center">
          <Clock className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Envie de réserver?</h3>
          <p className="mb-6 text-white/90">
            Contactez-moi par Instagram ou via le formulaire de contact pour prendre rendez-vous
          </p>
          <button className="bg-white text-pink-600 px-8 py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all">
            Me contacter
          </button>
        </div>
      </div>
    </div>
  );
}
