import { useEffect, useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import bgPaper from '../image/206b86d0-0557-48d0-b2a5-90e81096dfa7.png';
import { useAuth } from '../hooks/useAuth';

interface AvailabilitySlot {
  id: string;
  date: string; // YYYY-MM-DD
  time_slot: string; // e.g. "10h00/14h00"
  is_available: boolean;
  notes: string | null;
}

export function Availability() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);

  useEffect(() => { loadAvailability(); }, [currentMonth]);

  const loadAvailability = async () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const { data } = await supabase
      .from('availability')
      .select('*')
      .gte('date', startOfMonth.toISOString().split('T')[0])
      .lte('date', endOfMonth.toISOString().split('T')[0]);

    if (data) setAvailability(data as AvailabilitySlot[]);
  };

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const out: Array<number | null> = [];
    for (let i = 0; i < startingDayOfWeek; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(d);
    return out;
  }, [currentMonth]);

  const getSlotsFor = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
    return availability.filter(s => s.date === dateStr);
  };

  const getSlotStatus = (slots: AvailabilitySlot[]) => {
    let morningSlot: AvailabilitySlot | null = null;
    let afternoonSlot: AvailabilitySlot | null = null;

    for (const s of slots) {
      const raw = (s.time_slot || '').toLowerCase();
      if (!morningSlot && /\b10\s*h?\b|\b10h?/i.test(raw)) morningSlot = s;
      if (!afternoonSlot && /\b14\s*h?\b|\b14h?/i.test(raw)) afternoonSlot = s;
      if (morningSlot && afternoonSlot) break;
    }

    const morningTaken = !!(morningSlot && !morningSlot.is_available);
    const afternoonTaken = !!(afternoonSlot && !afternoonSlot.is_available);

    return { morningTaken, afternoonTaken, morningSlot, afternoonSlot };
  };

  const isPast = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const t = new Date(); t.setHours(0,0,0,0);
    return d < t;
  };

  const previousMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const today = new Date(); today.setHours(0,0,0,0);

  const { isAdmin } = useAuth();

  const [lastToggled, setLastToggled] = useState<string | null>(null);

  // Debug helper: explicit click wrapper to ensure clicks register
  const handleHalfClick = (e: React.MouseEvent, day: number, half: '10' | '14') => {
    e.preventDefault();
    e.stopPropagation();
    console.log('handleHalfClick', { isAdmin, day, half, target: (e.target as HTMLElement).tagName });
    if (!isAdmin) return;
    void toggleHalf(day, half);
  };

  const toggleHalf = async (day: number, half: '10' | '14') => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];

    try {
      console.log('Admin toggleHalf', { day, half, dateStr });
      const { data: existing } = await supabase
        .from('availability')
        .select('*')
        .eq('date', dateStr)
        .like('time_slot', `%${half}%`);

      if (existing && existing.length > 0) {
        const row = existing[0] as AvailabilitySlot;
        await supabase.from('availability').update({ is_available: !row.is_available }).eq('id', row.id);
      } else {
        await supabase.from('availability').insert({ date: dateStr, time_slot: `${half}h`, is_available: false, notes: null });
      }
    } catch (err) {
      console.error('Toggle half failed', err);
    }
    // Trigger a short animation for feedback
    setLastToggled(`${dateStr}-${half}`);
    await loadAvailability();
    setTimeout(() => setLastToggled(null), 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-5 py-2 rounded-full mx-auto mb-4">
            <Calendar className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-medium text-pink-600">Calendrier de disponibilités</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-2" style={{ fontFamily: '"Brush Script MT", Pacifico, cursive', color: '#8b2bd9' }}>{monthName}</h1>
          <p className="text-gray-600">Consultez mes créneaux disponibles pour votre tatouage</p>
        </div>

        {isAdmin && (
          <div className="max-w-4xl mx-auto mb-4">
            <div className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded-full bg-yellow-100 text-yellow-800 shadow">ADMIN MODE</div>
          </div>
        )}

        <div className="mx-auto max-w-4xl">
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundImage: `url(${bgPaper})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="backdrop-blur-sm bg-white/80 p-8">
              <div className="flex items-center justify-between mb-6">
                <button onClick={previousMonth} className="w-10 h-10 rounded-full bg-pink-50 border border-rose-100 flex items-center justify-center shadow-sm">
                  <ChevronLeft className="w-4 h-4 text-pink-500" />
                </button>
                <div className="text-center">
                  <div className="text-xs uppercase text-pink-400">Mois</div>
                  <div className="text-2xl font-bold text-pink-600">{monthName}</div>
                </div>
                <button onClick={nextMonth} className="w-10 h-10 rounded-full bg-pink-50 border border-rose-100 flex items-center justify-center shadow-sm">
                  <ChevronRight className="w-4 h-4 text-pink-500" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-0 text-center text-sm font-medium text-pink-500 mb-2">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(d => (
                  <div key={d} className="py-3 border-b border-r border-gray-200">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0">
                {days.map((day, idx) => {
                  if (day === null) return <div key={`empty-${idx}`} className="min-h-[100px] border-r border-b border-gray-200 bg-transparent" />;

                  const slots = getSlotsFor(day);
                  const past = isPast(day);
                  const isToday = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getTime() === today.getTime();
                  const { morningTaken, afternoonTaken } = getSlotStatus(slots);
                  const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];

                  return (
                    <div key={day} className={`min-h-[110px] border-r border-b border-gray-200 p-3 relative ${past ? 'bg-gray-50 opacity-70' : 'bg-white'}`}>
                      <div className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${isToday ? 'bg-pink-100 text-pink-600 border border-pink-200' : 'text-gray-400'}`}>
                        {day}
                      </div>

                      <div className="h-full flex flex-col pt-6">
                        {!past ? (
                          // both halves taken -> show both sky-blue
                          morningTaken && afternoonTaken ? (
                            <>
                              <div className={`flex-1 flex items-center justify-center border-b bg-sky-300 text-white transition-transform ${lastToggled === `${dateStr}-10` ? 'scale-105 ring-2 ring-white' : ''}`}>
                                <span className="font-semibold">10h</span>
                              </div>
                              <div className={`flex-1 flex items-center justify-center bg-sky-300 text-white transition-transform ${lastToggled === `${dateStr}-14` ? 'scale-105 ring-2 ring-white' : ''}`}>
                                <span className="font-semibold">14h</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                onClick={() => isAdmin && toggleHalf(day, '10')}
                                role={isAdmin ? 'button' : undefined}
                                aria-label={isAdmin ? `Toggle 10h for ${day}` : undefined}
                                className={`flex-1 flex items-center justify-center border-b ${morningTaken ? 'bg-pink-400 text-white' : 'bg-white text-gray-400'} ${isAdmin ? 'cursor-pointer hover:scale-[1.03] transition-all' : ''} ${lastToggled === `${dateStr}-10` && morningTaken ? 'scale-105 ring-2 ring-white' : ''}`}
                              >
                                <span className={morningTaken ? 'font-semibold' : 'text-sm'}>10h</span>
                              </div>
                              <div
                                onClick={() => isAdmin && toggleHalf(day, '14')}
                                role={isAdmin ? 'button' : undefined}
                                aria-label={isAdmin ? `Toggle 14h for ${day}` : undefined}
                                className={`flex-1 flex items-center justify-center ${afternoonTaken ? 'bg-purple-500 text-white' : 'bg-white text-gray-400'} ${isAdmin ? 'cursor-pointer hover:scale-[1.03] transition-all' : ''} ${lastToggled === `${dateStr}-14` && afternoonTaken ? 'scale-105 ring-2 ring-white' : ''}`}
                              >
                                <span className={afternoonTaken ? 'font-semibold' : 'text-sm'}>14h</span>
                              </div>
                            </>
                          )
                        ) : (
                          <div className="flex-1 flex items-center justify-center text-sm text-gray-400">—</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-pink-300 border border-pink-200" /> <span className="text-sm text-gray-600">Disponible</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" /> <span className="text-sm text-gray-600">Indisponible</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl shadow-xl p-8 text-white text-center">
          <Clock className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Envie de réserver?</h3>
          <p className="mb-6 text-white/90">Contactez-moi par Instagram ou via le formulaire de contact pour prendre rendez-vous</p>
          <button className="bg-white text-pink-600 px-8 py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all">Me contacter</button>
        </div>
      </div>
    </div>
  );
}
