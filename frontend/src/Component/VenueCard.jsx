import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Config/apiconfig';
import { useState } from 'react';
import Loader from './Loader';
import { LogInIcon, Target, Calendar } from 'lucide-react';
import LoginModal from './LoginModal';

const VenueCard = ({ venue, onBookVenue, date, refreshVenues }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
    setMobileMenuOpen(false);
  };

  const getCategoryColor = (category) => {
    const colors = {
      lab: 'bg-blue-100 text-blue-800',
      complab: 'bg-gray-100 text-blue-800',
      classroom: 'bg-yellow-100 text-yellow-800',
      seminar: 'bg-red-100 text-red-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const bookingDetails = venue?.booking;
  const bookedBy = bookingDetails?.bookedBy;
  const bookedTime = bookingDetails?.timeSlot;
  const bookingPurpose = bookingDetails?.purpose;

  const getAvailabilityStatus = () => {
    if (!bookingDetails) {
      return {
        text: 'Available',
        className: 'bg-green-600 text-white',
        dotClass: 'bg-green-400',
      };
    }
    return {
      text: 'Booked',
      className: 'bg-red-600 text-white',
      dotClass: 'bg-red-400',
    };
  };

  const handleAddToCalendar = () => {
    try {
      if (!bookingDetails) return;

      const eventTitle = `${venue.name} - ${bookingPurpose || 'Venue Booking'}`;
      const eventDetails = `Venue: ${venue.name}\nCapacity: ${venue?.capacity || '65'}\nBooked by: ${bookedBy?.username || bookedBy?.name || 'Unknown User'}\nPurpose: ${bookingPurpose || 'N/A'}`;
      
      // Parse time with fallback
      let startTime = '09:00';
      let endTime = '10:00';
      
      if (bookedTime && bookedTime.includes('-')) {
        const times = bookedTime.split('-');
        if (times.length === 2) {
          startTime = times[0].trim();
          endTime = times[1].trim();
        }
      }
      
      // Parse date with fallback to today
      const eventDate = date ? new Date(date) : new Date();
      
      // Format datetime strings
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
      alert('Unable to create calendar event. Please try again.');
    }
  };

  const handleCancelBooking = async (venueName) => {
    try {
      setLoading(true);
      const res = await axiosInstance.delete(`/bookings`, {
        data: {
          day: venue.selectedDay,
          date: date,
          timeSlot: venue.availableTimes,
          venue: venueName,
        },
      });
      refreshVenues();
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert(error.response?.data?.message || 'Cancel failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-8 flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  const status = getAvailabilityStatus();

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="relative">
          <img
            src={venue.image}
            alt={venue.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop';
            }}
          />
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${status.className} shadow-sm`}>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${status.dotClass}`}></div>
              {status.text}
            </div>
          </div>
          {venue.category && (
            <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(venue.category)} shadow-sm`}>
              {venue.category.toUpperCase()}
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="mb-3">
            <h2 className="text-lg font-bold text-gray-900 mb-1">{venue.name}</h2>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Capacity: {venue?.capacity || '65'}
              </span>
              {venue.selectedDay && (
                <span className="capitalize font-medium text-blue-600">{venue.selectedDay}</span>
              )}
            </div>
          </div>
          <div className="mb-4">
            {!bookingDetails ? (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">Available Time</span>
                {venue?.availableTimes && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    {venue.availableTimes}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-700">Booked Time</span>
                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                  {bookedTime}
                </span>
              </div>
            )}
          </div>
          {bookingDetails && bookingPurpose && (
            <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">Purpose</span>
              </div>
              <p className="text-sm text-purple-800 font-medium">{bookingPurpose}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {bookingDetails && (
              <button
                onClick={handleAddToCalendar}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md"
              >
                <Calendar className="w-4 h-4" />
                Add to Google Calendar
              </button>
            )}
            
            {user ? (
              !bookingDetails ? (
                <button
                  onClick={() => onBookVenue(venue)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md"
                >
                  Book Now
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => handleCancelBooking(venue?.booking?.venue)}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {loading ? 'Canceling...' : 'Cancel Booking'}
                  </button>
                  {bookedBy && (
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600 mb-1">Booked By</p>
                      <p className="text-sm font-bold text-blue-800">
                        {(bookedBy?.username || bookedBy?.name || 'Unknown User').toUpperCase()}
                      </p>
                    </div>
                  )}
                </div>
              )
            ) : (
              <button
                onClick={openLoginModal}
                className="w-full flex items-center justify-center space-x-3 py-3 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <LogInIcon className="h-5 w-5" />
                <span>Login Required to Book</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {loginModalOpen && (
        <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      )}
    </>
  );
};

export default VenueCard;