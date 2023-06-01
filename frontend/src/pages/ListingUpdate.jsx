import React, { useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { useSelector } from 'react-redux'

// MUI
import {
	Grid,
	Typography,
	Button,
	TextField,
	FormControlLabel,
	Checkbox,
	Snackbar,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
	formContainer: {
		width: "75%",
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: "3rem",
		padding: "3rem",
	},

	registerBtn: {
		backgroundColor: "green",
		color: "white",
		fontSize: "1.1rem",
		marginLeft: "1rem",
		"&:hover": {
			backgroundColor: "primary",
		},
	},

	picturesBtn: {
		color: "white",
		fontSize: "0.8rem",
		marginLeft: "1rem",
	},
});

const listingTypeOptions = [
	{
		value: "",
		label: "",
	},
	{
		value: "Rumah Kos",
		label: "Rumah Kos",
	},
];

const propertyStatusOptions = [
	{
		value: "",
		label: "",
	},
	{
		value: "Rental",
		label: "Rental",
	},
];

function ListingUpdate(props) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  	const isCostumer = useSelector((state) => state.auth.isCostumer);
	const isPemilikKos = useSelector((state) => state.auth.isPemilikKos);
	const userId = useSelector(state => state.auth.userId)
	const ownerId = useSelector(state => state.auth.ownerId)
    const params = useParams();
	const classes = useStyles();
	const navigate = useNavigate();
    useEffect(() => {
		if (!isAuthenticated) {
		  navigate("/login");
		}
	  }, [isAuthenticated, navigate]);
	
	  useEffect(() => {
		if (isCostumer) {
		  navigate("/");
		}
	  }, [isPemilikKos, navigate]);

	const initialState = {
		titleValue: "",
		listingTypeValue: "",
		descriptionValue: "",
		propertyStatusValue: "",
		priceDayValue: "",
		priceMonthValue: "",
		priceYearValue: "",
		roomsValue: "",
		addressValue: "",
		latitudeValue: "",
		longitudeValue: "",
		boroughValue: "",
		furnishedValue: "",
		poolValue: "",
		elevatorValue: "",
		cctvValue: "",
		parkingValue: "",
		picture1Value: [],
		picture2Value: [],
		picture3Value: [],
		picture4Value: [],
        listingInfo: "",
		sendRequest: 0,
		openSnack: false,
		disabledBtn: false,
		pictures:{
			// uploadPicture1: picture1Value, 
		}
	};

	function ReducerFuction(draft, action) {
		switch (action.type) {
			case "catchTitleChange":
				draft.titleValue = action.titleChosen;
				break;

			case "catchListingTypeChange":
				draft.listingTypeValue = action.listingTypeChosen;
				break;

			case "catchDescriptionChange":
				draft.descriptionValue = action.descriptionChosen;
				break;

			case "catchPropertyStatusChange":
				draft.propertyStatusValue = action.propertyStatusChosen;
				break;

			case "catchPriceDayChange":
				draft.priceDayValue = action.priceDayChosen;
				break;

			case "catchPriceMonthChange":
				draft.priceMonthValue = action.priceMonthChosen;
				break;

			case "catchPriceYearChange":
				draft.priceYearValue = action.priceYearChosen;
				break;

			case "catchBoroughChange":
				draft.boroughValue = action.boroughChosen;
				break;

			case "catchAddressChange":
				draft.addressValue = action.addressChosen;
				break;

			case "catchLatitudeChange":
				draft.latitudeValue = action.LatitudeChosen;
				break;

			case "catchLongitudeChange":
				draft.longitudeValue = action.LongitudeChosen;
				break;

			case "catchRoomsChange":
				draft.roomsValue = action.roomsChosen;
				break;

			case "catchFurnishedChange":
				draft.furnishedValue = action.furnishedChosen;
				break;

			case "catchPoolChange":
				draft.poolValue = action.poolChosen;
				break;

			case "catchElevatorChange":
				draft.elevatorValue = action.elevatorChosen;
				break;

			case "catchCctvChange":
				draft.cctvValue = action.cctvChosen;
				break;

            case "catchListingInfo":
                draft.listingInfo = action.listingObject;
				draft.titleValue = action.listingObject.title;
				draft.listingTypeValue = action.listingObject.listing_type;
				draft.descriptionValue = action.listingObject.description;
				draft.addressValue = action.listingObject.address;
				draft.propertyStatusValue = action.listingObject.property_status;
				draft.roomsValue = action.listingObject.rooms;
				draft.priceDayValue = action.listingObject.price_per_day;
				draft.priceMonthValue = action.listingObject.price_per_month;
				draft.priceYearValue = action.listingObject.price_per_year;
				draft.latitudeValue = action.listingObject.latitude;
				draft.longitudeValue = action.listingObject.longitude;
				draft.boroughValue = action.listingObject.borough;
				draft.furnishedValue = action.listingObject.furnished;
				draft.poolValue = action.listingObject.pool;
				draft.elevatorValue = action.listingObject.elevator;
				draft.cctvValue = action.listingObject.cctv;
				draft.poolValue = action.listingObject.pool;
				draft.parkingValue = action.listingObject.parking;
				draft.picture1Value = action.listingObject.picture1;
				draft.picture2Value = action.listingObject.picture2;
				draft.picture3Value = action.listingObject.picture3;
				draft.picture4Value = action.listingObject.picture4;
				
                break;
			case "changeSendRequest":
				draft.sendRequest = draft.sendRequest + 1;
				break;

			case "openTheSnack":
				draft.openSnack = true;
				break;
			
			case "catchUploadedPicture1":
				draft.picture1Value = action.picture1Chosen;
				break;

			case "catchUploadedPicture2":
				draft.picture2Value = action.picture2Chosen;
				break;

			case "catchUploadedPicture3":
				draft.picture3Value = action.picture3Chosen;
				break;

			case "catchUploadedPicture4":
				draft.picture4Value = action.picture4Chosen;
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

	function FormSubmit(e) {
		e.preventDefault();

		dispatch({ type: "changeSendRequest" });
		dispatch({ type: "disableTheButton" });
	}
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
	useEffect(() => {
		if (state.sendRequest) {
			async function UpdateProperty() {
				const formData = new FormData();
				if (
					typeof state.picture1Value === "string" ||
					state.picture1Value === null
				) {
					formData.append("title", state.titleValue);
					formData.append("description", state.descriptionValue);
					formData.append("listing_type", state.listingTypeValue);
					formData.append("property_status", state.propertyStatusValue);
					formData.append("address", state.addressValue);
					formData.append("price_per_day", state.priceDayValue);
					formData.append("price_per_month", state.priceMonthValue);
					formData.append("price_per_year", state.priceYearValue);
					formData.append("rental_frequency", state.rentalFrequencyValue);
					formData.append("latitude", state.latitudeValue);
					formData.append("longitude", state.longitudeValue);
					formData.append("borough", state.boroughValue);
					formData.append("rooms", state.roomsValue);
					formData.append("furnished", state.furnishedValue);
					formData.append("pool", state.poolValue);
					formData.append("elevator", state.elevatorValue);
					formData.append("cctv", state.cctvValue);
					formData.append("parking", state.parkingValue);
					formData.append("owner", ownerId);
				} else {
					formData.append("title", state.titleValue);
					formData.append("description", state.descriptionValue);
					formData.append("listing_type", state.listingTypeValue);
					formData.append("property_status", state.propertyStatusValue);
					formData.append("address", state.addressValue);
					formData.append("price_per_day", state.priceDayValue);
					formData.append("price_per_month", state.priceMonthValue);
					formData.append("price_per_year", state.priceYearValue);
					formData.append("rental_frequency", state.rentalFrequencyValue);
					formData.append("latitude", state.latitudeValue);
					formData.append("longitude", state.longitudeValue);
					formData.append("borough", state.boroughValue);
					formData.append("rooms", state.roomsValue);
					formData.append("furnished", state.furnishedValue);
					formData.append("pool", state.poolValue);
					formData.append("elevator", state.elevatorValue);
					formData.append("cctv", state.cctvValue);
					formData.append("parking", state.parkingValue);
					formData.append("picture1", state.picture1Value)
					formData.append("owner", ownerId);
				}
				if (
					typeof state.picture2Value === "string" ||
					state.picture2Value === null
				) {
					formData.append("title", state.titleValue);
					formData.append("description", state.descriptionValue);
					formData.append("listing_type", state.listingTypeValue);
					formData.append("property_status", state.propertyStatusValue);
					formData.append("address", state.addressValue);
					formData.append("price_per_day", state.priceDayValue);
					formData.append("price_per_month", state.priceMonthValue);
					formData.append("price_per_year", state.priceYearValue);
					formData.append("rental_frequency", state.rentalFrequencyValue);
					formData.append("latitude", state.latitudeValue);
					formData.append("longitude", state.longitudeValue);
					formData.append("borough", state.boroughValue);
					formData.append("rooms", state.roomsValue);
					formData.append("furnished", state.furnishedValue);
					formData.append("pool", state.poolValue);
					formData.append("elevator", state.elevatorValue);
					formData.append("cctv", state.cctvValue);
					formData.append("parking", state.parkingValue);
					formData.append("owner", ownerId);
				} else {
					formData.append("title", state.titleValue);
					formData.append("description", state.descriptionValue);
					formData.append("listing_type", state.listingTypeValue);
					formData.append("property_status", state.propertyStatusValue);
					formData.append("address", state.addressValue);
					formData.append("price_per_day", state.priceDayValue);
					formData.append("price_per_month", state.priceMonthValue);
					formData.append("price_per_year", state.priceYearValue);
					formData.append("rental_frequency", state.rentalFrequencyValue);
					formData.append("latitude", state.latitudeValue);
					formData.append("longitude", state.longitudeValue);
					formData.append("borough", state.boroughValue);
					formData.append("rooms", state.roomsValue);
					formData.append("furnished", state.furnishedValue);
					formData.append("pool", state.poolValue);
					formData.append("elevator", state.elevatorValue);
					formData.append("cctv", state.cctvValue);
					formData.append("parking", state.parkingValue);
					formData.append("picture2", state.picture2Value)
					formData.append("owner", ownerId);
				}
				if (
					typeof state.picture3Value === "string" ||
					state.picture3Value === null
				) {
					formData.append("title", state.titleValue);
					formData.append("description", state.descriptionValue);
					formData.append("listing_type", state.listingTypeValue);
					formData.append("property_status", state.propertyStatusValue);
					formData.append("address", state.addressValue);
					formData.append("price_per_day", state.priceDayValue);
					formData.append("price_per_month", state.priceMonthValue);
					formData.append("price_per_year", state.priceYearValue);
					formData.append("rental_frequency", state.rentalFrequencyValue);
					formData.append("latitude", state.latitudeValue);
					formData.append("longitude", state.longitudeValue);
					formData.append("borough", state.boroughValue);
					formData.append("rooms", state.roomsValue);
					formData.append("furnished", state.furnishedValue);
					formData.append("pool", state.poolValue);
					formData.append("elevator", state.elevatorValue);
					formData.append("cctv", state.cctvValue);
					formData.append("parking", state.parkingValue);
					formData.append("owner", ownerId);
				} else {
					formData.append("title", state.titleValue);
					formData.append("description", state.descriptionValue);
					formData.append("listing_type", state.listingTypeValue);
					formData.append("property_status", state.propertyStatusValue);
					formData.append("address", state.addressValue);
					formData.append("price_per_day", state.priceDayValue);
					formData.append("price_per_month", state.priceMonthValue);
					formData.append("price_per_year", state.priceYearValue);
					formData.append("rental_frequency", state.rentalFrequencyValue);
					formData.append("latitude", state.latitudeValue);
					formData.append("longitude", state.longitudeValue);
					formData.append("borough", state.boroughValue);
					formData.append("rooms", state.roomsValue);
					formData.append("furnished", state.furnishedValue);
					formData.append("pool", state.poolValue);
					formData.append("elevator", state.elevatorValue);
					formData.append("cctv", state.cctvValue);
					formData.append("parking", state.parkingValue);
					formData.append("picture3", state.picture3Value)
					formData.append("owner", ownerId);
				}
				if (
					typeof state.picture4Value === "string" ||
					state.picture4Value === null
				) {
					formData.append("title", state.titleValue);
					formData.append("description", state.descriptionValue);
					formData.append("listing_type", state.listingTypeValue);
					formData.append("property_status", state.propertyStatusValue);
					formData.append("address", state.addressValue);
					formData.append("price_per_day", state.priceDayValue);
					formData.append("price_per_month", state.priceMonthValue);
					formData.append("price_per_year", state.priceYearValue);
					formData.append("rental_frequency", state.rentalFrequencyValue);
					formData.append("latitude", state.latitudeValue);
					formData.append("longitude", state.longitudeValue);
					formData.append("borough", state.boroughValue);
					formData.append("rooms", state.roomsValue);
					formData.append("furnished", state.furnishedValue);
					formData.append("pool", state.poolValue);
					formData.append("elevator", state.elevatorValue);
					formData.append("cctv", state.cctvValue);
					formData.append("parking", state.parkingValue);
					formData.append("owner", ownerId);
				} else {
					formData.append("title", state.titleValue);
					formData.append("description", state.descriptionValue);
					formData.append("listing_type", state.listingTypeValue);
					formData.append("property_status", state.propertyStatusValue);
					formData.append("address", state.addressValue);
					formData.append("price_per_day", state.priceDayValue);
					formData.append("price_per_month", state.priceMonthValue);
					formData.append("price_per_year", state.priceYearValue);
					formData.append("rental_frequency", state.rentalFrequencyValue);
					formData.append("latitude", state.latitudeValue);
					formData.append("longitude", state.longitudeValue);
					formData.append("borough", state.boroughValue);
					formData.append("rooms", state.roomsValue);
					formData.append("furnished", state.furnishedValue);
					formData.append("pool", state.poolValue);
					formData.append("elevator", state.elevatorValue);
					formData.append("cctv", state.cctvValue);
					formData.append("parking", state.parkingValue);
					// formData.append("picture1", state.picture1Value)
					// formData.append("picture2", state.picture2Value)
					// formData.append("picture3", state.picture3Value)
					formData.append("picture4", state.picture4Value)
					formData.append("owner", ownerId);
				}
					
				

				try {
					const response = await Axios.patch(
						`http://127.0.0.1:8000/api/listings/${props.listingData.id}/update/`,
						formData
					);

					dispatch({ type: "openTheSnack" });
				} catch (e) {
					dispatch({ type: "allowTheButton" });
				}
			}
			UpdateProperty();
		}
	}, [state.sendRequest]);

	useEffect(() => {
		if (state.openSnack) {
			setTimeout(() => {
				navigate(0);
			}, 1500);
		}
	}, [state.openSnack]);

	return (
		<div className={classes.formContainer}>
			<form onSubmit={FormSubmit}>
				<Grid item container justifyContent="center">
					<Typography variant="h4">UPDATE RUMAH KOS</Typography>
				</Grid>

				<Grid item container style={{ marginTop: "1rem" }}>
					<TextField
						id="title"
						label="Title*"
						variant="standard"
						fullWidth
						value={state.titleValue}
						onChange={(e) =>
							dispatch({
								type: "catchTitleChange",
								titleChosen: e.target.value,
							})
						}
					/>
				</Grid>

				<Grid item container justifyContent="space-between">
					<Grid item xs={5} style={{ marginTop: "1rem" }}>
						<TextField
							id="listingType"
							label="Listing Type*"
							variant="standard"
							fullWidth
							value={state.listingTypeValue}
							onChange={(e) =>
								dispatch({
									type: "catchListingTypeChange",
									listingTypeChosen: e.target.value,
								})
							}
							select
							SelectProps={{
								native: true,
							}}
						>
							{listingTypeOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</TextField>
					</Grid>

					<Grid item xs={5} style={{ marginTop: "1rem" }}>
						<TextField
							id="propertyStatus"
							label="Property Status*"
							variant="standard"
							fullWidth
							value={state.propertyStatusValue}
							onChange={(e) =>
								dispatch({
									type: "catchPropertyStatusChange",
									propertyStatusChosen: e.target.value,
								})
							}
							select
							SelectProps={{
								native: true,
							}}
						>
							{propertyStatusOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</TextField>
					</Grid>
				</Grid>

				<Grid item container justifyContent="space-between">


					<Grid item xs={3} style={{ marginTop: "1rem" }}>
						<TextField
							id="price"
							type="number"
							label="Harga per Hari"
							variant="standard"
							fullWidth
							value={state.priceDayValue}
							onChange={(e) =>
								dispatch({
									type: "catchPriceDayChange",
									priceDayChosen: e.target.value,
								})
							}
						/>
					</Grid>
					<Grid item xs={3} style={{ marginTop: "1rem" }}>
						<TextField
							id="price"
							type="number"
							label="Harga per Bulan"
							variant="standard"
							fullWidth
							value={state.priceMonthValue}
							onChange={(e) =>
								dispatch({
									type: "catchPriceMonthChange",
									priceMonthChosen: e.target.value,
								})
							}
						/>
					</Grid>
					<Grid item xs={3} style={{ marginTop: "1rem" }}>
						<TextField
							id="price"
							type="number"
							label="Harga per Tahun"
							variant="standard"
							fullWidth
							value={state.priceYearValue}
							onChange={(e) =>
								dispatch({
									type: "catchPriceYearChange",
									priceYearChosen: e.target.value,
								})
							}
						/>
					</Grid>
				</Grid>

				<Grid item container style={{ marginTop: "1rem" }}>
					<TextField
						id="description"
						label="Description"
						variant="outlined"
						multiline
						rows={6}
						fullWidth
						value={state.descriptionValue}
						onChange={(e) =>
							dispatch({
								type: "catchDescriptionChange",
								descriptionChosen: e.target.value,
							})
						}
					/>
				</Grid>
				<Grid item container>
					<Grid item container style={{ marginTop: "1rem" }}>
						<TextField
							id="alamat"
							label="Address"
							variant="standard"
							fullWidth
							value={state.addressValue}
							onChange={(e) =>
								dispatch({
									type: "catchAddressChange",
									addressChosen: e.target.value,
								})
							}
						/>
					</Grid>	
				</Grid>
				<Grid item container justifyContent={'space-between'}>
					<Grid item xs={5} container style={{ marginTop: "1rem" }}>
						<TextField
							id="rooms"
							label="Rooms"
							type="number"
							variant="standard"
							fullWidth
							value={state.roomsValue}
							onChange={(e) =>
								dispatch({
									type: "catchRoomsChange",
									roomsChosen: e.target.value,
								})
							}
						/>
					</Grid>
					<Grid item xs={5} container style={{ marginTop: "1rem" }}>
						<TextField
							id="borough"
							label="Borough"
							variant="standard"
							fullWidth
							value={state.boroughValue}
							onChange={(e) =>
								dispatch({
									type: "catchBoroughChange",
									boroughChosen: e.target.value,
								})
							}
						/>
					</Grid>
					
				</Grid>
				<Grid item container justifyContent={'space-between'}>
					<Grid item xs={5} container style={{ marginTop: "1rem" }}>
						<TextField
							id="latitude"
							label="Latitude"
							variant="standard"
							fullWidth
							value={state.latitudeValue}
							onChange={(e) =>
								dispatch({
									type: "catchLatitudeChange",
									LatitudeChosen: e.target.value,
								})
							}
						/>
					</Grid>
					<Grid item xs={5} container style={{ marginTop: "1rem" }}>
						<TextField
							id="longitude"
							label="Longitude"
							variant="standard"
							fullWidth
							value={state.longitudeValue}
							onChange={(e) =>
								dispatch({
									type: "catchLongitudeChange",
									LongitudeChosen: e.target.value,
								})
							}
						/>
					</Grid>
				</Grid>
				
				

				<Grid item container justifyContent="space-between">
					<Grid item xs={2} style={{ marginTop: "1rem" }}>
						<FormControlLabel
							control={
								<Checkbox
									checked={state.furnishedValue}
									onChange={(e) =>
										dispatch({
											type: "catchFurnishedChange",
											furnishedChosen: e.target.checked,
										})
									}
								/>
							}
							label="Furnished"
						/>
					</Grid>

					<Grid item xs={2} style={{ marginTop: "1rem" }}>
						<FormControlLabel
							control={
								<Checkbox
									checked={state.poolValue}
									onChange={(e) =>
										dispatch({
											type: "catchPoolChange",
											poolChosen: e.target.checked,
										})
									}
								/>
							}
							label="Pool"
						/>
					</Grid>

					<Grid item xs={2} style={{ marginTop: "1rem" }}>
						<FormControlLabel
							control={
								<Checkbox
									checked={state.elevatorValue}
									onChange={(e) =>
										dispatch({
											type: "catchElevatorChange",
											elevatorChosen: e.target.checked,
										})
									}
								/>
							}
							label="Elevator"
						/>
					</Grid>

					<Grid item xs={2} style={{ marginTop: "1rem" }}>
						<FormControlLabel
							control={
								<Checkbox
									checked={state.cctvValue}
									onChange={(e) =>
										dispatch({
											type: "catchCctvChange",
											cctvChosen: e.target.checked,
										})
									}
								/>
							}
							label="Cctv"
						/>
					</Grid>

					<Grid item xs={2} style={{ marginTop: "1rem" }}>
						<FormControlLabel
							control={
								<Checkbox
									checked={state.parkingValue}
									onChange={(e) =>
										dispatch({
											type: "catchParkingChange",
											parkingChosen: e.target.checked,
										})
									}
								/>
							}
							label="Parking"
						/>
					</Grid>
				</Grid>

				<Grid item container>
					<Grid item xs={6}>
						<Grid
							item xs={12}
							style={{ width: '50%', marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
						>
							<Button
								variant="contained"
								component="label"
								fullWidth
								className={classes.picturesBtn}
							>
								UPLOAD PICTURES 1
								<input
									type="file"
									multiple
									accept="image/png, image/gif, image/jpeg"
									hidden
									onChange={(e) => {
										dispatch({
											type: "catchUploadedPicture1",
											picture1Chosen: e.target.files[0],
										});
										
									}}
								/>
							</Button>
						</Grid>
						<Grid item xs={12} style={{marginLeft: "10%"}}>
							<Grid item container>
								<Grid item xs={1.5} marginLeft= '0'>
									<img 
										style={{border: '2px solid lightblue', marginTop:'1rem', height: "4rem", width: "3rem"}} 
										src={state.listingInfo.picture1} />
								</Grid>
								<Grid item xs={10.5}>
									<Typography style={{marginTop:'1rem'}}>
										{state.picture1Value ? <p>{state.picture1Value.name}</p> : ""}
									</Typography>
							</Grid>
							</Grid>	
						</Grid>
						<Grid
							item
							container
							xs={12}
							style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto", width: '50%' }}
						>
							<Button
								variant="contained"
								component="label"
								fullWidth
								className={classes.picturesBtn}
							>
								UPLOAD PICTURES 2
								<input
									type="file"
									multiple
									accept="image/png, image/gif, image/jpeg"
									hidden
									onChange={(e) => {
										dispatch({
											type: "catchUploadedPicture2",
											picture2Chosen: e.target.files[0],
										});
									}}
								/>
							</Button>
						</Grid>
						<Grid item xs={12} style={{marginLeft: "10%"}}>
							<Grid item container>
								<Grid item xs={1.5} marginLeft= '0'>
									<img 
										style={{border: '2px solid lightblue', marginTop:'1rem', height: "4rem", width: "3rem"}} 
										src={state.listingInfo.picture2} />
								</Grid>
								<Grid item xs={10.5}>
									<Typography style={{marginTop:'1rem'}}>
										{state.picture2Value ? <p>{state.picture2Value.name}</p> : ""}
									</Typography>
							</Grid>
							</Grid>	
						</Grid>
					</Grid>
					
					<Grid item xs={6} >
						<Grid
							item
							container
							xs={12}
							style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto", width: '50%' }}
						>
							<Button
								variant="contained"
								component="label"
								fullWidth
								className={classes.picturesBtn}
							>
								UPLOAD PICTURES 3
								<input
									type="file"
									multiple
									accept="image/png, image/gif, image/jpeg"
									hidden
									onChange={(e) => {
										dispatch({
											type: "catchUploadedPicture3",
											picture3Chosen: e.target.files[0],
										});
										
									}}
								/>
							</Button>	
						</Grid>
						<Grid item xs={12} style={{marginLeft: "10%"}}>
							<Grid item container>
								<Grid item xs={1.5} marginLeft= '0'>
									<img 
										style={{border: '2px solid lightblue', marginTop:'1rem', height: "4rem", width: "3rem"}} 
										src={state.listingInfo.picture3} />
								</Grid>
								<Grid item xs={10.5}>
									<Typography style={{marginTop:'1rem'}}>
										{state.picture3Value ? <p>{state.picture3Value.name}</p> : ""}
									</Typography>
							</Grid>
							</Grid>	
						</Grid>
						
						<Grid
							item
							container
							xs={12}
							style={{ marginTop: "1rem", width: '50%', marginLeft: "auto", marginRight: "auto" }}
						>
							<Button
								variant="contained"
								component="label"
								fullWidth
								className={classes.picturesBtn}
							>
								UPLOAD PICTURES 4
								<input
									type="file"
									multiple
									accept="image/png, image/gif, image/jpeg"
									hidden
									onChange={(e) => {				
										dispatch({
											type: "catchUploadedPicture4",
											picture4Chosen: e.target.files[0],
										});
									}}
								/>
							</Button>
						</Grid>
						<Grid item xs={12} style={{marginLeft: "10%"}}>
							<Grid item container>
								<Grid item xs={1.5} marginLeft= '0'>
									<img 
										style={{border: '2px solid lightblue', marginTop:'1rem', height: "4rem", width: "3rem"}} 
										src={state.listingInfo.picture4} />
								</Grid>
								<Grid item xs={10.5}>
									<Typography style={{marginTop:'1rem'}}>
										{state.picture4Value ? <p>{state.picture4Value.name}</p> : ""}
									</Typography>
							</Grid>
							</Grid>	
						</Grid>
					</Grid>

				</Grid>

				<Grid
					item
					container
					xs={8}
					style={{ marginTop: "4rem", marginLeft: "auto", marginRight: "auto" }}
				>
					<Button
						variant="contained"
						fullWidth
						type="submit"
						className={classes.registerBtn}
						disabled={state.disabledBtn}
					>
						UPDATE
					</Button>
				</Grid>
			</form>
			<Snackbar
				open={state.openSnack}
				message="You have successfully updated this listing!"
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
			/>
		</div>
	);
}

export default ListingUpdate;
