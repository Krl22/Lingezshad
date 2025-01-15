import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useTheme } from "@/components/theme-provider";
import { NavLink } from "react-router-dom";
import { useState } from "react";

import LocationsList from "./EnvironmentList";

export const Environment = () => {
  const { theme } = useTheme();
  const [openInfoWindow, setOpenInfoWindow] = useState<number | null>(null);

  // Determinar el esquema de color basado en el tema
  const mapColorScheme = theme === "dark" ? "DARK" : "LIGHT";

  const handleMarkerClick = (index: number) => {
    setOpenInfoWindow(index);
  };

  const handleCloseInfoWindow = () => {
    setOpenInfoWindow(null);
  };

  return (
    <div className="h-screen">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}>
        <Map
          style={{ width: "100%", height: "100%" }}
          defaultCenter={{ lat: 42.3601, lng: -71.0589 }}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={true}
          mapId="a548e871536e43d7"
          colorScheme={mapColorScheme} // Usa el esquema dinámico
        >
          {LocationsList.map((location, index) => (
            <AdvancedMarker
              key={index}
              position={location.position}
              onClick={() => handleMarkerClick(index)}
            >
              <Pin background={location.pinColor} />
            </AdvancedMarker>
          ))}
          {openInfoWindow !== null && (
            <InfoWindow
              onCloseClick={handleCloseInfoWindow}
              position={LocationsList[openInfoWindow].position}
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <div>
                <div className="flex items-center justify-center mb-2">
                  <img
                    src={LocationsList[openInfoWindow].iconUrl}
                    alt={LocationsList[openInfoWindow].name}
                    className="w-8 h-8 mr-2"
                  />
                </div>
                <p className="mb-4 text-gray-600">
                  {LocationsList[openInfoWindow].description}
                </p>
                <NavLink
                  to={LocationsList[openInfoWindow].route}
                  className="text-blue-500 hover:underline"
                >
                  Go to {LocationsList[openInfoWindow].name}
                </NavLink>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};
