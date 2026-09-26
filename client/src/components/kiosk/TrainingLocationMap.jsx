import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Compass, MapPin } from 'lucide-react';
import { TRANSLATIONS } from '../../data/translations';

// Haversine Distance Calculation (km)
export function calcDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 4.5;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// Master Government Training & NSQF Centers categorized by District
export const DISTRICT_CENTERS = {
  rewa: [
    {
      id: 'sc-rew-01',
      title_hi: 'शासकीय पॉलिटेक्निक एवं पीएमकेके रीवा',
      title_en: 'Govt Polytechnic & PMKK Rewa',
      lat: 24.5362,
      lng: 81.3037,
      type: 'pmkk',
      color: '#f59e0b'
    },
    {
      id: 'sc-rew-02',
      title_hi: 'रीवा सौर ऊर्जा प्रशिक्षण एवं सर्विस हब',
      title_en: 'Rewa Solar Park Training & Service Hub',
      lat: 24.4800,
      lng: 81.2500,
      type: 'solar',
      color: '#ea580c'
    },
    {
      id: 'sc-rew-03',
      title_hi: 'कृषि विज्ञान केंद्र (KVK) रीवा - जैविक कृषि',
      title_en: 'Krishi Vigyan Kendra (KVK) Rewa',
      lat: 24.5200,
      lng: 81.3300,
      type: 'kvk',
      color: '#10b981'
    },
    {
      id: 'sc-rew-04',
      title_hi: 'आरसेटी रीवा (ग्रामीण बैंक स्वरोजगार केंद्र)',
      title_en: 'RSETI Rewa Rural Enterprise Hub',
      lat: 24.5420,
      lng: 81.2980,
      type: 'rseti',
      color: '#0284c7'
    }
  ],
  ratlam: [
    {
      id: 'sc-rat-01',
      title_hi: 'जिला कौशल प्रशिक्षण केंद्र व आरसेटी रतलाम',
      title_en: 'District Skill Training Center & RSETI Ratlam',
      lat: 23.3315,
      lng: 75.0367,
      type: 'rseti',
      color: '#0284c7'
    },
    {
      id: 'sc-rat-02',
      title_hi: 'शासकीय आईटीआई रतलाम - इलेक्ट्रीशियन व ऑटो',
      title_en: 'Govt ITI Ratlam',
      lat: 23.3400,
      lng: 75.0400,
      type: 'iti',
      color: '#f59e0b'
    },
    {
      id: 'sc-rat-03',
      title_hi: 'कृषि विज्ञान केंद्र (KVK) जावरा क्लस्टर',
      title_en: 'KVK Jaora Rural Agro Cluster',
      lat: 23.6300,
      lng: 75.1300,
      type: 'kvk',
      color: '#10b981'
    }
  ],
  morena: [
    {
      id: 'sc-mor-01',
      title_hi: 'प्रधानमंत्री कौशल केंद्र (PMKK) एवं एग्रो हब मुरैना',
      title_en: 'PMKK & Agro-Food Hub Morena',
      lat: 26.4947,
      lng: 77.9940,
      type: 'pmkk',
      color: '#f59e0b'
    },
    {
      id: 'sc-mor-02',
      title_hi: 'आरसेटी मुरैना - डेयरी व पशुपालन प्रशिक्षण केंद्र',
      title_en: 'RSETI Morena Dairy Training Hub',
      lat: 26.5000,
      lng: 78.0100,
      type: 'rseti',
      color: '#0284c7'
    },
    {
      id: 'sc-mor-03',
      title_hi: 'अंबाह ब्लॉक कौशल विकास केंद्र',
      title_en: 'Ambah Block Skill Center',
      lat: 26.7100,
      lng: 78.2300,
      type: 'institute',
      color: '#ea580c'
    }
  ],
  shahdol: [
    {
      id: 'sc-sha-01',
      title_hi: 'जनजातीय आजीविका एवं कौशल विकास अकादमी शहडोल',
      title_en: 'Tribal Livelihood & Skill Academy Shahdol',
      lat: 23.2957,
      lng: 81.3577,
      type: 'cluster',
      color: '#10b981'
    },
    {
      id: 'sc-sha-02',
      title_hi: 'कृषि विज्ञान केंद्र (KVK) शहडोल - वनोपज प्रसंस्करण',
      title_en: 'KVK Shahdol Forest Produce Hub',
      lat: 23.3100,
      lng: 81.3400,
      type: 'kvk',
      color: '#ea580c'
    },
    {
      id: 'sc-sha-03',
      title_hi: 'सोहागपुर कौशल केंद्र - सोलर व इलेक्ट्रीशियन',
      title_en: 'Sohagpur Skill Center',
      lat: 23.3200,
      lng: 81.3800,
      type: 'iti',
      color: '#f59e0b'
    }
  ],
  sehore: [
    {
      id: 'sc-seh-01',
      title_hi: 'आईसीएआर कृषि विज्ञान केंद्र, सेवनिया ग्रामीण, सीहोर',
      title_en: 'ICAR KVK Sewaniya Rural Sehore',
      lat: 23.1950,
      lng: 77.0920,
      type: 'kvk',
      color: '#10b981'
    },
    {
      id: 'sc-seh-02',
      title_hi: 'प्रधानमंत्री कौशल केंद्र (PMKK), आष्टा ग्रामीण',
      title_en: 'PMKK Ashta Rural Center',
      lat: 23.0234,
      lng: 76.7215,
      type: 'pmkk',
      color: '#f59e0b'
    }
  ],
  jabalpur: [
    {
      id: 'NSQF-ELEC-01',
      title_hi: 'राजकीय संभागीय आईटीआई जबलपुर - इलेक्ट्रीशियन विंग',
      title_en: 'Govt Divisional ITI Jabalpur',
      lat: 23.1700,
      lng: 79.9500,
      type: 'iti',
      color: '#f59e0b'
    },
    {
      id: 'NSQF-MOB-02',
      title_hi: 'ग्रामीण स्वरोजगार संस्थान (RSETI) जबलपुर',
      title_en: 'RSETI Jabalpur Enterprise Hub',
      lat: 23.1600,
      lng: 79.9900,
      type: 'institute',
      color: '#0284c7'
    },
    {
      id: 'NSQF-SOLAR-03',
      title_hi: 'सूर्यमित्र कौशल केंद्र - सोलर पीवी इंस्टॉलर',
      title_en: 'Suryamitra Skill Hub - Solar PV Installer',
      lat: 23.2100,
      lng: 80.0100,
      type: 'solar',
      color: '#ea580c'
    },
    {
      id: 'NSQF-TAILOR-05',
      title_hi: 'कुंडम जनजातीय SHG सिलाई व बुटीक केंद्र',
      title_en: 'Kundam Tribal SHG Boutique Center',
      lat: 23.1850,
      lng: 79.9400,
      type: 'shg',
      color: '#db2777'
    },
    {
      id: 'NSQF-AGRI-04',
      title_hi: 'कृषि विज्ञान केंद्र (KVK) - जैविक खेती व मशरूम',
      title_en: 'Krishi Vigyan Kendra - Organic & Mushroom',
      lat: 23.2300,
      lng: 79.9600,
      type: 'agri',
      color: '#10b981'
    }
  ]
};

export function getCentersForDistrict(locationName = '', district = '') {
  const norm = `${district} ${locationName}`.toLowerCase();
  if (norm.includes('rewa') || norm.includes('mauganj') || norm.includes('रीवा') || norm.includes('मऊगंज')) {
    return DISTRICT_CENTERS.rewa;
  }
  if (norm.includes('ratlam') || norm.includes('jaora') || norm.includes('रतलाम') || norm.includes('जावरा')) {
    return DISTRICT_CENTERS.ratlam;
  }
  if (norm.includes('morena') || norm.includes('ambah') || norm.includes('मुरैना') || norm.includes('अंबाह')) {
    return DISTRICT_CENTERS.morena;
  }
  if (norm.includes('shahdol') || norm.includes('sohagpur') || norm.includes('शहडोल') || norm.includes('सोहागपुर')) {
    return DISTRICT_CENTERS.shahdol;
  }
  if (norm.includes('sehore') || norm.includes('ashta') || norm.includes('सीहोर') || norm.includes('आष्टा')) {
    return DISTRICT_CENTERS.sehore;
  }
  return DISTRICT_CENTERS.jabalpur;
}

export const TRAINING_CENTERS = [
  ...DISTRICT_CENTERS.jabalpur,
  ...DISTRICT_CENTERS.rewa,
  ...DISTRICT_CENTERS.ratlam,
  ...DISTRICT_CENTERS.morena,
  ...DISTRICT_CENTERS.shahdol,
  ...DISTRICT_CENTERS.sehore
];

export default function TrainingLocationMap({ 
  userLocation, 
  selectedCourseId, 
  onSelectCourse, 
  lang = 'hi' 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  // District default coordinates if not provided
  const districtCoords = {
    'Rewa': { lat: 24.5362, lng: 81.3037 },
    'Ratlam': { lat: 23.3315, lng: 75.0367 },
    'Morena': { lat: 26.4947, lng: 77.9940 },
    'Shahdol': { lat: 23.2957, lng: 81.3577 },
    'Sehore': { lat: 23.2030, lng: 77.0844 },
    'Jabalpur': { lat: 23.1815, lng: 79.9650 }
  };

  const distName = userLocation?.district || '';
  const fallback = districtCoords[distName] || { lat: 23.1970, lng: 80.3520 };

  // Resolve user coordinates
  const userLat = userLocation?.coordinates?.lat || fallback.lat;
  const userLng = userLocation?.coordinates?.lng || fallback.lng;
  const locationDisplayName = userLocation?.locationName || userLocation?.district || t.your_village || 'आपका स्थान';

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy prior map instance if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map centered on the user's selected location
    const map = L.map(mapContainerRef.current, {
      center: [userLat, userLng],
      zoom: 12,
      scrollWheelZoom: false
    });

    // Add OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    // 1. Plot User's Village / Chosen Location Marker
    const userMarkerHtml = `
      <div style="
        background-color: #059669;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(5, 150, 105, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
        animation: pulse 2s infinite;
      ">
        📍
      </div>
    `;

    const userIcon = L.divIcon({
      html: userMarkerHtml,
      className: 'user-village-pin',
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const userMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(map);
    userMarker.bindPopup(`
      <div style="font-family: inherit; padding: 3px;">
        <span style="background: #ecfdf5; color: #047857; font-size: 11px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">${t.your_village || 'आपका स्थान'}</span>
        <div style="color: #0f172a; font-size: 13px; font-weight: bold; margin-top: 4px;">${locationDisplayName}</div>
      </div>
    `).openPopup();

    // 2. Add subtle radius circle around user location (10 km rural mobility zone)
    L.circle([userLat, userLng], {
      color: '#10b981',
      fillColor: '#34d399',
      fillOpacity: 0.1,
      radius: 8000,
      weight: 1.5,
      dashArray: '4, 6'
    }).addTo(map);

    // 3. Plot Training Centers for the user's specific district
    const activeCenters = getCentersForDistrict(locationDisplayName, userLocation?.district);
    let selectedCenterCoords = null;
    const boundsPoints = [[userLat, userLng]];

    activeCenters.forEach((center) => {
      const isSelected = center.id === selectedCourseId;
      const title = center[`title_${lang}`] || center.title_hi;
      const calculatedDistance = calcDistanceKm(userLat, userLng, center.lat, center.lng);
      boundsPoints.push([center.lat, center.lng]);

      if (isSelected) {
        selectedCenterCoords = [center.lat, center.lng];
      }

      const markerHtml = `
        <div style="
          background-color: ${center.color};
          width: ${isSelected ? '36px' : '28px'};
          height: ${isSelected ? '36px' : '28px'};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        ">
          🏫
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-pin',
        iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
        iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14]
      });

      const marker = L.marker([center.lat, center.lng], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: inherit; padding: 2px;">
          <b style="color: #0f172a; font-size: 13px;">${title}</b>
          <div style="color: #059669; font-size: 12px; font-weight: 800; margin-top: 3px;">
            ${t.distance_label} ${calculatedDistance} km (${locationDisplayName} से)
          </div>
          <div style="color: #64748b; font-size: 11px; margin-top: 2px;">${t.verified_center}</div>
        </div>
      `;

      marker.bindPopup(popupContent);

      if (isSelected) {
        marker.openPopup();
      }

      marker.on('click', () => {
        if (onSelectCourse) {
          onSelectCourse(center.id);
        }
      });
    });

    // 4. Draw dashed travel route from User's location to the Selected Course
    if (selectedCenterCoords) {
      L.polyline([
        [userLat, userLng],
        selectedCenterCoords
      ], {
        color: '#059669',
        weight: 3.5,
        dashArray: '6, 8',
        opacity: 0.85
      }).addTo(map);
    }

    // Fit bounds smoothly to include user and nearby centers
    if (boundsPoints.length > 1) {
      try {
        const bounds = L.latLngBounds(boundsPoints);
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
      } catch (e) {}
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLat, userLng, selectedCourseId, lang, locationDisplayName, userLocation?.district]);

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
              {t.map_tracker_title}
            </h4>
            <p className="text-xs text-slate-500">
              {t.map_tracker_desc}
            </p>
          </div>
        </div>

        {/* Active Location Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>{locationDisplayName}</span>
        </div>
      </div>

      {/* Map Element */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0"
      />

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 border border-white shadow-xs"></span>
          <span>{locationDisplayName} ({t.your_village || 'आपका स्थान'})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>{t.nav_kiosk === 'Kiosk Interface' ? 'Govt ITI' : 'राजकीय आईटीआई'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-sky-600"></span>
          <span>RSETI</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          <span>{t.nav_kiosk === 'Kiosk Interface' ? 'Solar PV' : 'सूर्यमित्र केंद्र'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-pink-600"></span>
          <span>{t.nav_kiosk === 'Kiosk Interface' ? 'SHG Center' : 'स्वयं सहायता समूह'}</span>
        </div>
      </div>
    </div>
  );
}
