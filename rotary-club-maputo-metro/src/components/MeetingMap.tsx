"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { clubContacts } from "@/lib/data";
import "leaflet/dist/leaflet.css";

const COORDS: [number, number] = [-25.9446679, 32.6204583]; // StayEasy Maputo

export default function MeetingMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    (async () => {
      const L = (await import("leaflet")).default;
      if (!mapRef.current || mapRef.current.childElementCount > 0) return;
      map = L.map(mapRef.current, {
        center: COORDS,
        zoom: 15,
        scrollWheelZoom: false,
      });
      // CARTO "Voyager" — tiles coloridos e gratuitos, sem chave de API.
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);
      const pin = L.divIcon({
        className: "",
        html: '<div class="map-pin"></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      L.marker(COORDS, { icon: pin }).addTo(map);
    })();
    return () => {
      if (map) map.remove();
    };
  }, []);

  return (
    <div className="meeting-map">
      <div ref={mapRef} className="meeting-map-canvas" />
      <div className="meeting-map-card">
        <h4>StayEasy Maputo (Southern Sun)</h4>
        <p className="mm-rating">4,4 ★ (899) · Hotel</p>
        <p className="mm-desc">
          {t({
            pt: "Local das reuniões presenciais do Rotary Club of Maputo Metro — todas as terças-feiras. Av. da Marginal, junto ao Baía Mall.",
            en: "In-person meeting venue of the Rotary Club of Maputo Metro — every Tuesday. Av. da Marginal, next to Baía Mall.",
          })}
        </p>
        <a href={clubContacts.mapLink} target="_blank" rel="noopener noreferrer">
          {t({ pt: "Abrir no Google Maps ↗", en: "Open in Google Maps ↗" })}
        </a>
      </div>
    </div>
  );
}
