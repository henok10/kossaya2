import { useEffect, useState } from "react";
import {
  SnackbarProvider,
  useSnackbar
} from "notistack";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap, MapContainer, TileLayer } from "react-leaflet";
import { AppBar, Box, Button } from "@mui/material";
import 'leaflet-control-geocoder';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png"
});

function TheMapComponent() {
  const map = useMap();
  const { enqueueSnackbar } = useSnackbar();
  const [routingControl, setRoutingControl] = useState(null);

  useEffect(() => {
    if (!map) return;
        // if (routingControl == null) {
        //       map.removeControl(routingControl);
        // } 
    const control = L.Routing.control({
      autoRoute: true,
      waypoints: [
        L.latLng(-5.140888601624625, 119.50028336948422),
        L.latLng(-5.133725178205787, 119.48556798930309)
      ],
      routeWhileDragging: true,
      draggableWaypoints: true,
      fitSelectedRoutes: true,
      showAlternatives: true,
      geocoder: L.Control.Geocoder.nominatim()
    }).addTo(map);
    // return () => map.removeControl(control);
    setRoutingControl(control);
  
    return () => {
      if (control !== null) {
        map.removeControl(control);
        setRoutingControl(null);
      }
    };
  }, [map]);

  const clearRoutingControl = () => {
    if (routingControl !== null && routingControl.getPlan() !== null) {
        routingControl.getPlan().setWaypoints([]);
        enqueueSnackbar("Route cleared.");
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={clearRoutingControl}>
        Clear Route
      </Button>
    </div>
  );
}

export default function Routing() {
  return (
    <Box height="80vh" weight="60vh">
      <MapContainer
        center={[-5.133746047427556, 119.4875580004916]}
        zoom={16}
        scrollWheelZoom={true}
        style={{ weight: "60vh" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <TheMapComponent />
      </MapContainer>
      <SnackbarProvider maxSnack={1} oneatatime>
        <Button variant="contained">Do something else</Button>
      </SnackbarProvider>
    </Box>
  );
}
