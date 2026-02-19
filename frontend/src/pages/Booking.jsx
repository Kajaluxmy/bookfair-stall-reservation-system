import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventsApi, publicApi, reservationsApi, mlApi } from '../api/client';
import { useStallSync } from '../hooks/useStallSync';
import FloorPlanMap, { toLogicalCoordinates } from '../components/FloorPlanMap';

const MAX_STALLS = 3;
const ADVANCE_PERCENT = 10;

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isVendor, isAdmin } = useAuth();
  const [event, setEvent] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedStallIds, setSelectedStallIds] = useState([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState([]);
  const [stallDescription, setStallDescription] = useState('');
  const [bookedStallIds, setBookedStallIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const selectedStalls = useMemo(() => {
    return event?.stalls ? event.stalls.filter(s => selectedStallIds.includes(s.id)) : [];
  }, [event, selectedStallIds]);

  const onStallUpdate = useCallback((ids) => {
    setBookedStallIds(ids);
  }, []);

  useStallSync(id, onStallUpdate);

  useEffect(() => {
    if (!isVendor) {
      navigate(isAdmin ? '/admin' : '/login');
      return;
    }
    Promise.all([eventsApi.get(id), publicApi.genres()])
      .then(([ev, g]) => {
        setEvent(ev);
        setGenres(g);
        setBookedStallIds(ev.bookedStallIds || []);
      })
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id, isVendor, isAdmin, navigate]);

  const handleStallClick = (stall) => {
    if (stall.blocked) return;
    const booked = bookedStallIds.includes(stall.id);
    if (booked) return;
    setSelectedStallIds(prev => {
      if (prev.includes(stall.id)) return prev.filter(x => x !== stall.id);
      if (prev.length >= MAX_STALLS) {
        setError(`Maximum ${MAX_STALLS} stalls per booking.`);
        return prev;
      }
      setError('');
      return [...prev, stall.id];
    });
  };

  const toggleGenre = (genreId) => {
    setSelectedGenreIds(prev =>
      prev.includes(genreId) ? prev.filter(x => x !== genreId) : [...prev, genreId]
    );
  };

  const stalls = event?.stalls || [];
  const total = selectedStallIds.reduce((sum, sid) => {
    const s = stalls.find(x => x.id === sid);
    return sum + (s ? Number(s.price) : 0);
  }, 0);
  const advance = (total * ADVANCE_PERCENT) / 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (selectedStallIds.length === 0) {
      setError('Select at least one stall.');
      return;
    }

    const selectedStallNames = stalls
      .filter(s => selectedStallIds.includes(s.id))
      .map(s => `${s.stallCode} (${s.size})`);

    navigate('/payment/new', {
      state: {
        eventId: Number(id),
        eventName: event.name,
        eventDate: event.eventDate,
        stallIds: selectedStallIds,
        stallNames: selectedStallNames,
        stallDescription,
        genreIds: selectedGenreIds,
        totalAmount: total
      }
    });
  };

  if (loading || !event)
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">Loading...</div>;

  const selectedIdSet = new Set(selectedStallIds);
  const bookedIdSet = new Set(bookedStallIds);

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 text-gray-100">
      <div className="container mx-auto max-w-5xl space-y-6">
        <h1 className="text-3xl font-bold mb-6 text-white">Book Stalls – {event.name}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Floor Plan Selection */}
          <section className="bg-black rounded-xl shadow-lg border border-gray-700 p-6">
            <h2 className="font-semibold text-xl mb-2 flex items-center gap-2 text-blue-300">
              Select Stalls (Maximum {MAX_STALLS} Stalls)
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Click available stalls on the map to select them for booking.
            </p>

            <FloorPlanMap
              stalls={stalls}
              selectedSet={selectedIdSet}
              onStallClick={handleStallClick}
              mode="book"
              bookedIds={bookedIdSet}
            />

            {selectedStallIds.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedStallIds.map(sid => {
                  const s = stalls.find(x => x.id === sid);
                  return s ? (
                    <span key={sid} className="px-3 py-1 bg-green-700 text-white rounded-full text-sm font-medium">
                      {s.stallCode} · ₹{s.price}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </section>

          {/* Stall Description */}
          <div className="space-y-2">
            <label className="block text-xl font-semibold text-blue-300">
            Add Stall Description
            </label>

            <textarea
              value={stallDescription}
              onChange={(e) => setStallDescription(e.target.value)}
              rows={4}
              placeholder="Describe your stall..."
              className="
                w-full
                bg-gray-800/70
                backdrop-blur-md
                border border-gray-600
                rounded-xl
                px-4 py-3
                text-sm text-white
                placeholder-gray-400
                shadow-lg
                focus:outline-none
                focus:ring-2
                focus:ring-green-500/40
                focus:border-green-500
                transition-all
                duration-300
              "
            />
          </div>

          {/* Genres */}
          <div className="space-y-3">
            <label className="block text-xl font-semibold text-blue-300">
              Select your Genres
            </label>

            <div className="grid grid-cols-2 gap-3">
              {genres.map((g) => {
                const selected = selectedGenreIds.includes(g.id);

                return (
                  <label
                    key={g.id}
                    className={`
                      cursor-pointer
                      px-4 py-2
                      rounded-md
                      border
                      text-sm
                      transition-all
                      duration-200
                      ${selected
                        ? "bg-green-600 text-white border-green-500"
                        : "bg-gray-700 text-gray-300 border-gray-600 hover:border-green-500"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selected}
                      onChange={() => toggleGenre(g.id)}
                    />
                    {g.name}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Summary */}
<div className="p-5 rounded-2xl bg-gray-800/80 backdrop-blur-md border border-gray-700 shadow-lg flex flex-col gap-2">
  <p className="text-gray-100 text-base font-medium flex justify-between">
    <span>Total:</span> 
    <span className="font-semibold text-amber-400">Rs. {total.toFixed(2)}</span>
  </p>
  <p className="text-gray-100 text-base font-medium flex justify-between">
    <span>Advance ({ADVANCE_PERCENT}%):</span> 
    <span className="font-semibold text-amber-400">Rs. {advance.toFixed(2)}</span>
  </p>
</div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-amber-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {submitting ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
}