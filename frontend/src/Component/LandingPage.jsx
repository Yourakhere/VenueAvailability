import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, MapPin, CheckCircle, Star, ArrowRight, Menu, X, Building2, Coffee, Bell, Monitor, Target } from 'lucide-react';
import Navbar from './Navbar';
import Lab from '../assets/lab.webp';
import Lab1 from '../assets/lab1.png';
import Room from '../assets/class.png';
import Room1 from '../assets/class0.png';
import Room2 from '../assets/class1.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleLogin = () => {
    navigate('/login'); 
  };

  return (
    <div className="min-h-screen bg-white">
      
    <Navbar/>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Book Your Venue{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Effortlessly
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Book rooms for club meetings and group study sessions effortlessly.
                Perfect for student organizations, project teams, and collaborative 
                learning - all in one simple app.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </button>

                <button 
                  onClick={() => document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200 font-semibold text-lg"
                >
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-gray-600">Venues Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">90+</div>
                  <div className="text-sm text-gray-600">Bookings Made</div>
                </div> 
              </div>
            </div>

            {/* Right side - Venue Showcase */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl shadow-xl p-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 h-32 rounded-lg mb-3"><img src={Lab1}/></div>
                    <h4 className="font-semibold text-gray-800">Lab Room 206</h4>
                    <p className="text-sm text-gray-600">Capacity: 55+  </p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-600">Available</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-xl p-4 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 h-32 rounded-lg mb-3"><img src={Room1}/></div>
                    <h4 className="font-semibold text-gray-800">Lecture Hall 201</h4>
                    <p className="text-sm text-gray-600">Capacity: 90+</p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-xs text-red-600">Booked</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-white rounded-2xl shadow-xl p-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="bg-gradient-to-br from-green-100 to-teal-100 h-32 rounded-lg mb-3"><img src={Lab}/></div>
                    <h4 className="font-semibold text-gray-800">Lab Room 305</h4>
                    <p className="text-sm text-gray-600">Capacity: 55+</p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-600">Available</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-xl p-4 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                    <div className="bg-gradient-to-br from-orange-100 to-red-100 h-32 rounded-lg mb-3"><img src={Room}/></div>
                    <h4 className="font-semibold text-gray-800">Lecture Hall 407</h4>
                    <p className="text-sm text-gray-600">Capacity: 100+ </p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-xs text-red-600">Booked</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
        <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Features for Club Meetings & Group Study
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything student organizations need to book and manage discussion spaces effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Real-Time Availability */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-Time Availability</h3>
              <p className="text-gray-600 mb-6">
                See which rooms are free right now or plan ahead with our live booking calendar for club meetings.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Live room status updates
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Conflict-free booking system
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Weekly schedule view
                </li>
              </ul>
            </div>

            {/* Feature 2 - Club Meeting Focused */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Perfect for Club Meetings</h3>
              <p className="text-gray-600 mb-6">
                Find ideal spaces for your student organizations, from intimate committee meetings to large assembly halls.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Student council meetings
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Club activities & events
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Committee discussions
                </li>
              </ul>
            </div>

             

            {/* Feature 6 - Purpose Tracking */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-rose-600 rounded-lg flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Purpose & Organization</h3>
              <p className="text-gray-600 mb-6">
                Track meeting purposes and organize bookings by club activities for better coordination.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Meeting purpose tracking
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Club activity categorization
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Booking history & reports
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-300 to-indigo-800 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Venue Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of organizations already using venueify to streamline their booking process.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 px-10 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2"
          >
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
       
      
    </div>
  );
};

export default LandingPage;