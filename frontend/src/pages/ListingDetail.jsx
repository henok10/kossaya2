import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "axios";
import 'react-leaflet';
// import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.js';
import "leaflet-routing-machine";
import 'leaflet-control-geocoder';
import L from 'leaflet';
import 'leaflet-routing-machine';
// import { useMap } from 'react-leaflet';
import { useImmerReducer } from "use-immer";
// Assets
import stadiumIconPng from "../data/Mapicons/stadium.png";
import hospitalIconPng from "../data/Mapicons/hospital.png";
import universityIconPng from "../data/Mapicons/university.png";
// React Leaflet
import {
  MapContainer, TileLayer, Marker, Popup, useMap,
} from "react-leaflet";
import { Icon } from "leaflet";
// MUI
import {
  Grid, Typography, CircularProgress, Breadcrumbs, Link, Box, Stack, Button, AccordionDetails, Paper
} from "@mui/material";

import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import RoomIcon from "@mui/icons-material/Room";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';


import { makeStyles } from "@mui/styles";
import Review from "../components/Review";
import ReviewMessage from "../components/ReviewMessage";

const useStyles = makeStyles({
  sliderContainer: {
    position: "relative",
  },

  leftArrow: {
    borderRadius: "100%",
    position: "absolute",
    cursor: "pointer",
    fontSize: "3rem",
    color: "white",
    top: "50%",
    left: "27.5%",
    "&:hover": {
      backgroundColor: "white",
    },
  },

  rightArrow: {
    position: "absolute",
    borderRadius: "100%",
    cursor: "pointer",
    fontSize: "3rem",
    color: "white",
    top: "50%",
    right: "27.5%",
    "&:hover": {
      backgroundColor: "white",
    },
  },
});



function ListingDetail() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isCustomer = useSelector((state) => state.auth.isCustomer);
  const [allOrderKos, setAllOrderKos] = useState([]);
  

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isCustomer) {
    navigate("/");
  }

  const classes = useStyles();
  const params = useParams();

  const stadiumIcon = new Icon({
    iconUrl: stadiumIconPng,
    iconSize: [40, 40],
  });

  const hospitalIcon = new Icon({
    iconUrl: hospitalIconPng,
    iconSize: [40, 40],
  });

  const universityIcon = new Icon({
    iconUrl: universityIconPng,
    iconSize: [40, 40],
  });

  const initialState = {
    dataIsLoading: true,
    listingInfo: "",
    userProfileInfo: "",
    orderInfo: "",
    openSnack: false,
    disabledBtn: false,
  };

  function ReducerFuction(draft, action) {
    switch (action.type) {
      case "catchListingInfo":
        draft.listingInfo = action.listingObject;
        break;

      case "catchUserOrderInfo":
        draft.orderInfo = action.orderObject
        break;

      case "loadingDone":
        draft.dataIsLoading = false;
        break;

      case "catchUserProfileInfo":
        draft.userProfileInfo = action.profileObject;
        draft.phoneNumbers = action.profileObject.phone_number
        break;

      case "openTheSnack":
        draft.openSnack = true;
        break;

      case "disableTheButton":
        draft.disabledBtn = true;
        break;

      case "allowTheButton":
        draft.disabledBtn = false;
        break;
    }
  }
  
  const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);
  useEffect(() => {
    async function GetListingInfo() {
      try {
        const response = await Axios.get(
          `http://127.0.0.1:8000/api/listings/${params.id}/`
        );

        dispatch({
          type: "catchListingInfo",
          listingObject: response.data,
        });
      } catch (e) {}
    }
    GetListingInfo();
  }, []);

  // request to get profile info
  useEffect(() => {
    if (state.listingInfo) {
      async function GetProfileInfo() {
        try {
          const response = await Axios.get(
            `http://127.0.0.1:8000/api/profiles/owner/${state.listingInfo.owner}/`
          );

          dispatch({
            type: "catchUserProfileInfo",
            profileObject: response.data,
          });
          dispatch({ type: "loadingDone" });
        } catch (e) {}
      }
      GetProfileInfo();
    }
  }, [state.listingInfo]);

  // / request to get profile info
  const [numItemsBoughtByListingId, setNumItemsBoughtByListingId] = useState({});
	useEffect(() => {
		async function GetAllOrderKos() {
			try {
				const response = await Axios.get(
					`http://127.0.0.1:8000/api/transaction/${params.id}/user`
				);
        const numItemsBought = response.data.filter(transaksi => transaksi.barang_dibeli).length;
        setNumItemsBoughtByListingId(numItemsBought);
      } catch (error) {}
    } 
    GetAllOrderKos()
  }, []);
  
  const roomsLeft = state.listingInfo.rooms - numItemsBoughtByListingId;


  const listingPictures = [
    state.listingInfo.picture1,
    state.listingInfo.picture2,
    state.listingInfo.picture3,
    state.listingInfo.picture4,
    state.listingInfo.picture5,
  ].filter((picture) => picture !== null);

  const [currentPicture, setCurrentPicture] = useState(0);

  function NextPicture() {
    if (currentPicture === listingPictures.length - 1) {
      return setCurrentPicture(0);
    } else {
      return setCurrentPicture(currentPicture + 1);
    }
  }

  function PreviousPicture() {
    if (currentPicture === 0) {
      return setCurrentPicture(listingPictures.length - 1);
    } else {
      return setCurrentPicture(currentPicture - 1);
    }
  }

  const date = new Date(state.listingInfo.date_posted);
  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

// routing map

function TheMapComponent() {
  const map = useMap();
  const routingControlRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (map) {
      // Meminta lokasi terkini dan akurat dari pengguna
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        error => {
          console.error(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, [map]);

  useEffect(() => {
    if (map && userLocation) {
      const waypoints = [
        {
          latLng: L.latLng(userLocation.lat, userLocation.lng),
          name: "Starting Point"
        },
        {
          latLng: L.latLng(state.listingInfo.latitude, state.listingInfo.longitude),
          name: (state.listingInfo.title)
        }
      ];

      const routingControl = L.Routing.control({
        waypoints,
        createMarker: function(i, waypoint, n) {
          const marker = L.marker(waypoint.latLng, {
            draggable: true
          });
      
          marker.bindPopup(waypoint.name);
      
          return marker;
        },
        lineOptions: {
          styles: [{ color: '#6FA1EC', weight: 5 }]
        },
        routeWhileDragging: true,
        draggableWaypoints: true,
        fitSelectedRoutes: true,
        showAlternatives: false,
        show: false // Add this option to hide the routing notifications
      });
      
       routingControl.addTo(map);
      //  return 
      
    }
 
  }, [map, userLocation]);

}

function GoogleMapsShortcut() {
  const url = `https://www.google.com/maps/search/?api=1&query=${state.listingInfo.latitude},${state.listingInfo.longitude}`;
  window.open(url, "_blank");
}
const handleWhatsApp = () => {
  const phoneNumber = state.phoneNumbers;
  const message = encodeURIComponent(`Halo, saya ingin memesan kamar kos (${state.listingInfo.title})`);
  const formattedPhoneNumber = phoneNumber.startsWith('0') ? `62${phoneNumber.substr(1)}` : phoneNumber;
  console.log(formattedPhoneNumber)
  window.open(`https://wa.me/${formattedPhoneNumber}?text=${message}`, '_blank');
};



  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/listings");
      }, 1500);
    }
  }, [state.openSnack]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(true);
  };

  if (state.dataIsLoading === true) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }
  return (
    <div
      style={{ marginLeft: "2rem", marginRight: "2rem", marginBottom: "2rem" }}
    >
      <Grid item style={{ marginTop: "1rem" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/listings")}
            style={{ cursor: "pointer" }}
          >
            Listings
          </Link>

          <Typography color="text.primary">
            {state.listingInfo.title} /
          </Typography>
        </Breadcrumbs>
      </Grid>  
        <Grid item container  marginTop={'1rem'}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/order/${state.listingInfo.id}`)}
            style={{margin: '0.5rem', marginTop: '1rem', height: '2.5rem'}}
          >
            Order
          </Button>
          <Button 
            onClick={handleWhatsApp}
            style={{height: '2.5rem', marginTop: '1rem', backgroundColor: '#4CAF50', color: 'white', padding: '5px', border: 'none', borderRadius: '5px'}}
          >
            Chat via WhatsApp
          </Button>
        </Grid>
      {/* information */}
      <Grid container>
        <Grid item lg={6.5} md={6.5} sm={12} xs={12} width={'100%'}>
          <Grid
            item
            container
            style={{
              padding: "1rem",
              borderBottom: "1px solid black",
              // marginTop: "1rem",
              width: "100%",
            }}
          >
            <Grid item container xs={7} direction="column" spacing={1}>
              <Grid item>
                <Typography variant="h6" >{state.listingInfo.title}</Typography>
              </Grid>
              <Grid item>
                <RoomIcon />{" "}
                <Typography varaiant="h6">
                  {state.listingInfo.borough}
                </Typography>
              </Grid>
              <Grid item>
                <Typography varaiant="subtitle1">{formattedDate}</Typography>
              </Grid>
            </Grid>
            <Grid item container xs={5} alignItems="center">
              <Typography
                variant="h6"
                style={{ fontWeight: "bolder", color: "black", fontSize:'17px'}}
              >
                {state.listingInfo.listing_type} |
                Rp{state.listingInfo.price_per_year}/Year
                Rp{state.listingInfo.price_per_month}/Month
                Rp{state.listingInfo.price_per_day}/Day
              </Typography>
            </Grid>
          </Grid>

          {/* Alamat */}

                
            <Grid
              item
              style={{
                padding: "1rem",
                borderBottom: "1px solid black",
                marginTop: "0.3rem",
              }}
            >
              <Typography variant="h6" style={{fontSize: '16px'}}>Alamat :</Typography>
              {state.listingInfo.address ? (
              <Typography variant="body1" style={{fontSize: '15px'}}>
                {state.listingInfo.address}
              </Typography>
                ) : (
                ""
              )}
            </Grid>

            <Grid
              item
              style={{
                padding: "1rem",
                borderBottom: "1px solid black",
                marginTop: "0.3rem",
              }}
            >
              <Typography variant="h6" style={{fontSize: '16px'}}>No Rekening :</Typography>
              {state.userProfileInfo.no_rekening ? (
              <Typography variant="body1" style={{fontSize: '15px'}}>
                {state.userProfileInfo.no_rekening}
              </Typography>
                ) : (
                ""
              )}
            </Grid>
               

          <Grid
            item
            justifyContent="flex-start"
            style={{
              padding: "1rem",
              borderBottom: "1px solid black",
              marginTop: "0.3rem",
            }}
          >
            <Grid>
              <div>
                <Typography variant="h6" style={{fontSize: '16px'}}>Fasilitas :</Typography>
              </div>
              <Stack direction="row" spacing={1}>
                <Grid item lg={3} md={3} sm={12} xs={12}>
                {state.listingInfo.rooms ? (
                  <Grid style={{ display: "flex" }}>
                    <Typography variant="body1" style={{fontSize: '15px'}}>
                      {state.listingInfo.rooms} Rooms
                    </Typography>
                  </Grid>
                ) : (
                  ""
                )}

                {state.listingInfo.room_size ? (
                  <Grid style={{ display: "flex" }}>
                    <Typography variant="body1" style={{fontSize: '15px'}}>
                    Ukuran {state.listingInfo.room_size} 
                    </Typography>
                  </Grid>
                ) : (
                  ""
                )}
                </Grid>
                    <Grid item lg={2} md={2} sm={3} xs={3}>
                        {state.listingInfo.furnished ? (
                        <Grid style={{ display: "flex" }}>
                          <CheckBoxIcon
                            style={{ color: "#4CAF50", fontSize: "1.5rem" }}
                          />{" "}
                          <Typography variant="body1" style={{fontSize: '15px'}}>Furnished</Typography>
                        </Grid>
                      ) : (
                        ""
                      )}
                    </Grid>
                  
                <Grid item lg={1.5} md={1.5} sm={3} xs={3}>
                  {state.listingInfo.elevator ? (
                    <Grid style={{ display: "flex" }}>
                      <CheckBoxIcon
                        style={{ color: "#4CAF50", fontSize: "1.5rem" }}
                      />{" "}
                      <Typography variant="body1" style={{fontSize: '15px'}}>Elevator</Typography>
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
                
                  <Grid item lg={1.5} md={1.5} sm={3} xs={3}>
                    {state.listingInfo.cctv ? (
                        <Grid style={{ display: "flex" }}>
                          <CheckBoxIcon
                            style={{ color: "#4CAF50", fontSize: "1.5rem" }}
                          />{" "}
                          <Typography variant="body1" style={{fontSize: '15px'}}>Cctv</Typography>
                        </Grid>
                      ) : (
                        ""
                      )}
                  </Grid>
              
                  <Grid item lg={1.5} md={1.5} sm={3} xs={3}>
                    {state.listingInfo.parking ? (
                      <Grid style={{ display: "flex" }}>
                        <CheckBoxIcon
                          style={{ color: "#4CAF50", fontSize: "1.5rem" }}
                        />{" "}
                        <Typography variant="body1" style={{fontSize: '15px'}}>Parking</Typography>
                      </Grid>
                    ) : (
                      ""
                    )}
                  </Grid>
                 
                
              </Stack>
            </Grid>
          </Grid>
          <Grid>
            {/* <Grid item xs={6} columns={{ xs: 6, sm: 6, md: 12 }}> */}
            <Grid
              item
              container
              style={{
                padding: "1rem",
                borderBottom: "1px solid black",
                marginTop: "0.3rem",
                width: "100%",
              }}
            >
              <div>
                <Typography variant="h6" style={{fontSize: '16px'}}>Kamar Yang Tersedia :</Typography>
                <Typography variant="body1" style={{fontSize: '15px'}}>{roomsLeft} Rooms</Typography>
              </div>
            </Grid>
            {/* </Grid> */}

            {/* Description */}
            {state.listingInfo.description ? (
              <Grid
                item
                style={{
                  padding: "1rem",
                  marginTop: "0.3rem",
                }}
              >
                <Typography variant="h6" style={{fontSize: '16px'}}>Description :</Typography>
                <Typography variant="body1" style={{fontSize: '15px'}}>
                  {state.listingInfo.description}
                </Typography>
              </Grid>
            ) : (
              ""
            )}
          </Grid>
        </Grid>


        <Grid item lg={5.5} md={5.5} sm={12} xs={12} width={'100%'} style={{ marginTop: "2rem", paddingLeft: '0.5rem'}}>
          {/* Image slider */}
          <Paper style={{border: '2px solid white'}}>
              {listingPictures.length > 0 ? (
                <Box
                >
                  <Grid
                    item
                    container
                    justifyContent="center"
                    className={classes.sliderContainer}
                  >
                    {listingPictures.map((picture, index) => {
                      return (
                        <div key={index}>
                          {index === currentPicture ? (
                            <img
                              src={picture}
                              style={{ width: "100%"}}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    })}
                    <ArrowCircleLeftIcon
                      onClick={PreviousPicture}
                      className={classes.leftArrow}
                    />
                    <ArrowCircleRightIcon
                      onClick={NextPicture}
                      className={classes.rightArrow}
                    />
                  </Grid>
                </Box>
              ) : (
                ""
              )}
          </Paper>
          
          
          
        </Grid>
      </Grid>

      {/* Map */}
      <Grid
        item
        container
        style={{ marginTop: "1rem" }}
        spacing={1}
        justifyContent="space-between"
      >
        <Grid item lg={3} md={3} sm={12} xs={12} style={{ overflow: "auto" }}>
          {state.listingInfo.listing_pois_within_10km.slice(0, 4).map((poi) => {
            function DegreeToRadian(coordinate) {
              return (coordinate * Math.PI) / 180;
            }

            function CalculateDistance() {
              const latitude1 = DegreeToRadian(state.listingInfo.latitude);
              const longitude1 = DegreeToRadian(state.listingInfo.longitude);

              const latitude2 = DegreeToRadian(poi.location.coordinates[0]);
              const longitude2 = DegreeToRadian(poi.location.coordinates[1]);
              // The formula
              const latDiff = latitude2 - latitude1;
              const lonDiff = longitude2 - longitude1;
              const R = 6371000 / 1000;

              const a =
                Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
                Math.cos(latitude1) *
                  Math.cos(latitude2) *
                  Math.sin(lonDiff / 2) *
                  Math.sin(lonDiff / 2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

              const d = R * c;

              const dist =
                Math.acos(
                  Math.sin(latitude1) * Math.sin(latitude2) +
                    Math.cos(latitude1) *
                      Math.cos(latitude2) *
                      Math.cos(lonDiff)
                ) * R;
              return dist.toFixed(2);
             
            }
            return (
              <div
                key={poi.id}
                style={{ marginBottom: "0.5rem", borderBottom: "1px solid black" }}
              >
                <Typography variant="h6">{poi.name}</Typography>
                <Typography variant="subtitle1">
                  {poi.type} | {" "}
                  <span style={{ fontWeight: "bolder", color: "black" }}>
                    {CalculateDistance()} Kilometers
                  </span>
                </Typography>
              </div>
            );
          })}
              <Button 
                onClick={GoogleMapsShortcut}
                style={{backgroundColor: '#4CAF50',
                  color: 'white',
                  fontSize: '16px',
                  padding: '10px 20px',
                  marginTop: '0.5rem',
                  borderRadius: '5px',
                  cursor: 'pointer'}}
                startIcon={<AssistantDirectionIcon />}
                >

                google maps
              </Button>
        </Grid>
        <Grid item lg={9} md={9} sm={12} xs={12} style={{ height: "35rem" }}>
          <MapContainer
            center={[state.listingInfo.latitude, state.listingInfo.longitude]}
            
            zoom={16}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {state.listingInfo.listing_pois_within_10km.map((poi) => {
              function PoiIcon() {
                if (poi.type === "Stadium") {
                  return stadiumIcon;
                } else if (poi.type === "Hospital") {
                  return hospitalIcon;
                } else if (poi.type === "University") {
                  return universityIcon;
                }
              }
              return (
                <Marker
                  key={poi.id}
                  position={[
                    poi.location.coordinates[0],
                    poi.location.coordinates[1],
                  ]}
                  icon={PoiIcon()}
                >
                  <Popup>{poi.name}</Popup>
                </Marker>
              );
            })}
            <TheMapComponent />
          </MapContainer>
        </Grid>
      </Grid>
      <Grid item container width={'60%'} margin={'auto'} borderTop={'1px solid gray'} marginTop={'1rem'}>
        <Grid width={'80%'} margin={'auto'}>
          <Typography variant={'h4'} style={{ marginTop: '2rem', textAlign: 'center'  }}>
            Review
          </Typography>
            <Box padding={'2px'} border={'2px solid white'}>
                  <Review />
            </Box>
          <Box style={{width: '100%', marginTop:'2rem'}}>
            <ReviewMessage />
          </Box>
        </Grid>  
        <Box style={{ borderBottom: '1px solid gray', width: '100%' }}/>   
      </Grid>
    </div>
  );
}

export default ListingDetail;
