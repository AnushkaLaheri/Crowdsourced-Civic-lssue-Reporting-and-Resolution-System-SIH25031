import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, ChevronRight, Star, Download, Award, ArrowRight, Play } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Jharkhand issued districts coordinates (replace with actual issued area data)
const issuedAreas = [
    { name: 'Ranchi', coords: [23.3441, 85.3096], issues: 120 },
              { name: 'Jamshedpur', coords: [22.8046, 86.2029], issues: 80 },
              { name: 'Dhanbad', coords: [23.7957, 86.4304], issues: 50 },
              { name: 'Bokaro', coords: [23.6693, 86.1514], issues: 40 },
              { name: 'Giridih', coords: [24.1830, 86.3000], issues: 30 },
              { name: 'Hazaribagh', coords: [23.9950, 85.3610], issues: 25 },
              { name: 'Saraikela', coords: [22.7869, 86.1201], issues: 15 },
];

// Custom Leaflet icon using lucide MapPin
const pinIcon = new L.DivIcon({
  html: '<div style="color:white"><svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21c-4-4-8-11-8-15a8 8 0 1116 0c0 4-4 11-8 15z" /></svg></div>',
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

export default function Hero({ currentSlide, heroSlides, showMap, setShowMap, setCurrentSlide }) {
  return (
    <section id="home" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background YouTube Video */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <iframe
          className="absolute w-[120%] h-[120%] -left-[10%] -top-[10%] object-cover"
          src="https://www.youtube.com/embed/Zs_ewLWC2lk?autoplay=1&mute=1&loop=1&playlist=Zs_ewLWC2lk&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Embedded YouTube Video"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-purple-600/40 to-pink-500/40 pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          layout
          className="flex items-center gap-8 min-h-[70vh]"
          initial={{ opacity: 1 }}
          animate={{ 
            justifyContent: showMap ? "space-between" : "center",
            width: "100%"
          }}
          transition={{ 
            duration: 0.6, 
            ease: "easeInOut",
            justifyContent: { duration: 0.6, ease: "easeInOut" }
          }}
        >
          {/* Left Content */}
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              width: showMap ? "50%" : "100%",
              x: showMap ? 0 : "0%"
            }}
            transition={{ 
              duration: 0.6,
              ease: "easeInOut",
              width: { duration: 0.6, ease: "easeInOut" },
              x: { duration: 0.6, ease: "easeInOut" }
            }}
            className="space-y-8 flex flex-col items-center justify-center text-center"
          >
            {/* Government Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-orange-100/60 text-orange-800 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm"
            >
              <span>🏛️</span>
              <span>Government of Jharkhand Initiative</span>
            </motion.div>

            {/* Hero Title & Slide */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <div className="text-xl lg:text-2xl text-blue-200 font-semibold mt-2">
                  {heroSlides[currentSlide].subtitle}
                </div>
                <p className="text-lg text-white/90 mt-6 leading-relaxed">
                  {heroSlides[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <span>Start Reporting Issues</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="bg-white/80 border-2 border-blue-600 text-blue-600 hover:bg-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300">
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </button>
            </motion.div>

            {/* Map Icon and Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-col items-center space-y-4 mt-8"
            >
              <MapPin className="h-12 w-12 text-white animate-pulse" />
              <button
                onClick={() => setShowMap(!showMap)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300 backdrop-blur-sm hover:scale-105"
              >
                <span>View Coverage Map</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>

          {/* Map Card with MapPins */}
          <AnimatePresence>
            {showMap && (
              <motion.div
                layout
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeInOut",
                  opacity: { duration: 0.4 },
                  x: { duration: 0.6, ease: "easeInOut" }
                }}
                className="flex-1 flex items-center justify-end"
              >
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl w-[500px] lg:w-[600px] h-[400px] lg:h-[600px]">
                  <MapContainer
                    center={[23.6101, 85.2799]}
                    zoom={7}
                    scrollWheelZoom={false}
                    style={{ width: '100%', height: '100%', borderRadius: '16px', opacity: 0.9 }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {issuedAreas.map(area => (
                      <Marker key={area.name} position={area.coords} icon={pinIcon}>
                        <Popup>
                          <div className="text-black">
                            <strong>{area.name}</strong><br/>
                            Issues Reported: {area.issues}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Slide Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex justify-center space-x-2 mt-12"
        >
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-blue-600 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white"
        >
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </motion.div>
    </section>
  );
}
