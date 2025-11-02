import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { X, Calendar, Clock, MapPin, Users, Target, CheckCircle, AlertCircle } from 'lucide-react';
import axiosInstance from '../Config/apiconfig';
import Loader from './Loader';

const BookingModal = ({ venue, date, isOpen, onClose, refreshVenues }) => {
  const [purpose, setPurpose] = useState('');
  const [filteredVenue, setFilteredVenue] = useState(venue);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    setFilteredVenue(venue);
  }, [venue]);

  const validateForm = () => {
    const newErrors = {};

    if (!purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    } else if (purpose.trim().length < 5) {
      newErrors.purpose = 'Purpose must be at least 5 characters long';
    } else if (purpose.trim().length > 100) {
      newErrors.purpose = 'Purpose must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!venue || !venue.availableTimes || !venue.selectedDay || !venue.name) {
      alert('Venue details should not be empty');
      return;
    }

    const bookingData = {
      venue: venue.name,
      bookedBy: user.name,
      date: date,
      day: venue.selectedDay,
      timeSlot: venue.availableTimes,
      purpose: purpose.trim(),
    };

    try {
      setLoading(true);
      const res = await axiosInstance.post(`/bookings`, bookingData);
      if (res.data) {
        alert('Successfully booked the venue');
        onClose();
      }
      refreshVenues();
    } catch (error) {
      console.error('Error booking venue:', error);
      alert(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !venue) return null;

  if (loading) {
    return <Loader />;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Book {venue.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{venue.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{venue.category || 'Room'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4" />
                <span>Capacity: {venue.capacity || '65'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="capitalize">{venue.selectedDay}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 col-span-2">
                <Clock className="h-4 w-4" />
                <span>{venue.availableTimes}</span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Date
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  Purpose of Booking *
                </div>
              </label>
              <textarea
                value={purpose}
                onChange={(e) => {
                  setPurpose(e.target.value);
                  if (errors.purpose) {
                    setErrors({ ...errors, purpose: '' });
                  }
                }}
                placeholder="e.g., Club meeting, Group study session, Project discussion..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors ${
                  errors.purpose ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.purpose && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {errors.purpose}
                </div>
              )}
              <div className="mt-1 text-xs text-gray-500 text-right">
                {purpose.length}/100 characters
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">Booking Summary</span>
              </div>
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex justify-between">
                  <span>Venue:</span>
                  <span className="font-medium">{venue.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium capitalize">{venue.selectedDay}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{venue.availableTimes}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !purpose.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Booking...
                  </div>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;