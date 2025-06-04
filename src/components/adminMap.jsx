import React, { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { listenToReports } from "../apis/firebaseService";
import "./locationMap.css";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const ReportTooltip = ({ report, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-40 h-48 flex flex-col overflow-hidden">
      <div className="bg-gray-50 p-2 border-b border-gray-200">
        <h3 className="text-xs font-medium text-gray-800 truncate">
          {report.location}
        </h3>
      </div>
      
      <div className="flex-grow p-2 space-y-2">
        <div>
          <p className="text-xs text-gray-500 font-medium">Time</p>
          <p className="text-xs text-gray-700">{new Date(report.time).toLocaleString()}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 font-medium">Emergencies</p>
          <p className="text-xs text-gray-700">
            {report.emergencyNames && report.emergencyNames.length > 0 ? 'Yes' : 'No'}
          </p>
        </div>
      </div>

      <div className="p-2 border-t border-gray-100">
        <button 
          onClick={() => onViewDetails(report.id)}
          className="w-full bg-primary-blue text-white px-2 py-1 text-xs rounded-xl transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const HeatmapOverlay = ({ useHeatMap, onViewDetails }) => {
  const map = useMap();
  const [heatmap, setHeatmap] = useState(null);
  const [reportCoordinates, setReportCoordinates] = useState([]);
  const [reportsInfo, setReportsInfo] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    const loadReportInfo = () => {
      listenToReports((data) => {
        if (data) {
          const information = Object.entries(data)
            .filter(([id, report]) =>
              report.latitude !== null &&
              report.longitude !== null &&
              typeof report.latitude === "number" &&
              typeof report.longitude === "number"
            )
            .map(([id, report]) => ({
              id, 
              lat: report.latitude,
              lng: report.longitude,
              location: report.location,
              time: report.time,
              emergencyNames: report.emergencyNames,
              isResolved: report.isResolved,
            }));
  
          const coordinates = information.map(report => ({ 
            lat: report.lat, 
            lng: report.lng 
          }));
    
          setReportCoordinates(coordinates);
          setReportsInfo(information);
          console.log(
            `Loaded ${coordinates.length} report coordinates for heatmap`
          );
        }
      });
    };

    loadReportInfo();
  }, []);

  useEffect(() => {
    if (!map || !window.google || !google.maps.visualization) return;

    let heatmapLayer = null;

    if (useHeatMap) {
      heatmapLayer = new google.maps.visualization.HeatmapLayer({
        data: getPoints(),
        map: map,
      });
      setHeatmap(heatmapLayer);
    }

    return () => {
      if (heatmapLayer) {
        heatmapLayer.setMap(null);
      }
    };
  }, [map, useHeatMap, reportCoordinates]);

  function getPoints() {
    if (reportCoordinates.length > 0) {
      return reportCoordinates.map(
        (coord) => new google.maps.LatLng(coord.lat, coord.lng)
      );
    }

    // Fallback to default static points if no database coordinates
    return [
      new google.maps.LatLng(42.0526711, -87.674528),
      new google.maps.LatLng(42.05215, -87.675),
      new google.maps.LatLng(42.0529, -87.6739),
      new google.maps.LatLng(42.0533, -87.6748),
      new google.maps.LatLng(42.053, -87.6735),
      new google.maps.LatLng(42.0523, -87.673),
      new google.maps.LatLng(42.0518, -87.6737),
      new google.maps.LatLng(42.0516, -87.6746),
      new google.maps.LatLng(42.0519, -87.6753),
      new google.maps.LatLng(42.0524, -87.6758),
      new google.maps.LatLng(42.053, -87.6754),
      new google.maps.LatLng(42.0534, -87.674),
      new google.maps.LatLng(42.0532, -87.6732),
      new google.maps.LatLng(42.0526, -87.6729),
    ];
  }

  const handleMouseEnter = (report) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      console.log('Marker hover:', report);
      setSelectedReport(report);
      setTooltipPosition({ lat: report.lat, lng: report.lng });
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      console.log('Mouse out');
      setSelectedReport(null);
      setTooltipPosition(null);
    }, 1000);
  };

  return (
    <>
      {useHeatMap && reportsInfo.map((report) => (
        <AdvancedMarker
          key={report.id}
          position={{ lat: report.lat, lng: report.lng }}
          onClick={() => onViewDetails(report.id)}
        >
          <div 
            className="w-10 h-10 rounded-full cursor-pointer hover:scale-150 transition-transform"
            onMouseEnter={() => handleMouseEnter(report)}
            onMouseLeave={handleMouseLeave}
          />
        </AdvancedMarker>
      ))}
      {selectedReport && tooltipPosition && (
        <AdvancedMarker position={tooltipPosition}>
          <ReportTooltip report={selectedReport} onViewDetails={onViewDetails} />
        </AdvancedMarker>
      )}
    </>
  );
};

const AdminMap = ({ latitude, longitude, onLocationSelect }) => {
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [useHeatMap, setUseHeatMap] = useState(false);

  const handleViewDetails = (reportId) => {
    navigate(`/admin/report/${reportId}`);
  };

  const handleHeatmapToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUseHeatMap(!useHeatMap);
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);

    if (onLocationSelect && place && place.formatted_address) {
      onLocationSelect(place.formatted_address);
    }
  };

  return (
    <APIProvider
      apiKey={API_KEY}
      libraries={["visualization"]}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <Map
        mapId={"696a2e1d90de87cc2a636ab2"}
        defaultZoom={16}
        defaultCenter={{ lat: latitude, lng: longitude }}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        <AdvancedMarker
          ref={markerRef}
          position={{ lat: latitude, lng: longitude }}
        />
        <HeatmapOverlay useHeatMap={useHeatMap} onViewDetails={handleViewDetails} />
      </Map>
      <MapControl position={ControlPosition.TOP}>
        <div className="autocomplete-control">
          <PlaceAutocomplete onPlaceSelect={handlePlaceSelect} />
        </div>
        <div className="heatmap-control">
          <button onClick={handleHeatmapToggle}>
            {useHeatMap ? "Hide Heatmap" : "Show heatmap"}
          </button>
        </div>
      </MapControl>
      <MapHandler place={selectedPlace} marker={marker} />
    </APIProvider>
  );
};

const MapHandler = ({ place, marker }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }

    marker.position = place.geometry?.location;
  }, [map, place, marker]);
  return null;
};

const PlaceAutocomplete = ({ onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);
  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);
  return (
    <div className="autocomplete-container">
      <input ref={inputRef} placeholder="Search for a location..." />
    </div>
  );
};

export default AdminMap;
