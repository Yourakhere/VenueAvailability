import { useState } from 'react';
import { Calendar, Users, MapPin, Clock, CheckCircle, AlertCircle, ExternalLink, Trash2 } from 'lucide-react';

const VenueCard = ({ venue, onBookVenue, date, refreshVenues }) => {
  const [loading, setLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  
  // Mock user - replace with actual Redux selector
  const user = { _id: '123', name: 'John Doe' };

  const getCategoryColor = (category) => {
    const colors = {
      lab: 'from-blue-500 to-blue-600',
      complab: 'from-slate-500 to-slate-600',
      classroom: 'from-amber-500 to-amber-600',
      seminar: 'from-rose-500 to-rose-600',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const bookingDetails = venue?.booking;
  const bookedBy = bookingDetails?.bookedBy;
  const bookedTime = bookingDetails?.timeSlot;
  const bookingPurpose = bookingDetails?.purpose;

  const isBooked = !!bookingDetails;
  const isUserBooked = user?._id === bookedBy?._id;

  const handleAddToCalendar = () => {
    try {
      if (!bookingDetails) return;

      const eventTitle = `${venue.name} - ${bookingPurpose || 'Venue Booking'}`;
      const eventDetails = `Venue: ${venue.name}\nCapacity: ${venue?.capacity || '65'}\nBooked by: ${bookedBy?.username || bookedBy?.name || 'Unknown User'}\nPurpose: ${bookingPurpose || 'N/A'}`;
      
      let startTime = '09:00';
      let endTime = '10:00';
      
      if (bookedTime && bookedTime.includes('-')) {
        const times = bookedTime.split('-');
        if (times.length === 2) {
          startTime = times[0].trim();
          endTime = times[1].trim();
        }
      }
      
      const eventDate = date ? new Date(date) : new Date();
      const year = eventDate.getFullYear();
      const month = String(eventDate.getMonth() + 1).padStart(2, '0');
      const day = String(eventDate.getDate()).padStart(2, '0');
      const startTimeFormatted = startTime.replace(':', '');
      const endTimeFormatted = endTime.replace(':', '');
      
      const startDateTime = `${year}${month}${day}T${startTimeFormatted}00`;
      const endDateTime = `${year}${month}${day}T${endTimeFormatted}00`;
      
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(venue.name)}`;
      
      window.open(googleCalendarUrl, '_blank');
    } catch (error) {
      console.error('Error creating calendar event:', error);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      setLoading(true);
      // await axiosInstance.delete(`/bookings`, { data: { ... } });
      refreshVenues?.();
    } catch (error) {
      console.error('Error canceling booking:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gray-200">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop';
          }}
        />
        
        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg backdrop-blur-sm ${
          isBooked 
            ? 'bg-red-500/90 text-white' 
            : 'bg-emerald-500/90 text-white'
        }`}>
          {isBooked ? (
            <>
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Booked</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Available</span>
            </>
          )}
        </div>

        {/* Category Badge */}
        {venue.category && (
          <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(venue.category)} shadow-lg`}>
            {venue.category.charAt(0).toUpperCase() + venue.category.slice(1)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title and Day */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{venue.name}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Capacity: <span className="font-semibold text-gray-900">{venue?.capacity || '65'}</span></span>
            </div>
            {venue.selectedDay && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-blue-600 capitalize">{venue.selectedDay}</span>
              </div>
            )}
          </div>
        </div>

        {/* Time Slot Info */}
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">
              {isBooked ? 'Booked Time' : 'Available Time'}
            </span>
          </div>
          <p className={`text-sm font-bold ${isBooked ? 'text-red-700' : 'text-green-700'}`}>
            {isBooked ? bookedTime : venue?.availableTimes || 'Check availability'}
          </p>
        </div>

        {/* Purpose */}
        {bookingDetails && bookingPurpose && (
          <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-semibold text-purple-700 mb-1">Purpose</p>
            <p className="text-sm text-purple-800 font-medium">{bookingPurpose}</p>
          </div>
        )}

        {/* Booked By Info */}
        {bookedBy && (
          <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg">
            <p className="text-xs font-semibold text-orange-700 mb-1">Booked By</p>
            <p className="text-sm font-bold text-orange-900">
              {(bookedBy?.username || bookedBy?.name || 'Unknown User').toUpperCase()}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2.5 mt-auto">
          {isBooked && (
            <button
              onClick={handleAddToCalendar}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              Add to Calendar
            </button>
          )}

          {user ? (
            !isBooked ? (
              <button
                onClick={() => onBookVenue(venue)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.01] shadow-md hover:shadow-lg active:scale-95"
              >
                Book Now
              </button>
            ) : isUserBooked ? (
              <button
                onClick={handleCancelBooking}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                <Trash2 className="w-4 h-4" />
                {loading ? 'Canceling...' : 'Cancel Booking'}
              </button>
            ) : (
              <div className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg text-center text-sm border border-gray-300">
                Booked by Someone Else
              </div>
            )
          ) : (
            <button
              onClick={() => setLoginModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
              Login to Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueCard;