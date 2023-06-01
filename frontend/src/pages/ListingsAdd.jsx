import React, { useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// React Leaflet
import {
	MapContainer,
	TileLayer,
	Marker,
	useMap,
} from "react-leaflet";

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
import { useSelector } from 'react-redux'

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
		// backgroundColor: "blue",
		color: "white",
		fontSize: "0.8rem",
		textAlign: "center",
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


function ListingAdd() {
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  	const isCostumer = useSelector((state) => state.auth.isCostumer);
	const isPemilikKos = useSelector((state) => state.auth.isPemilikKos);
	const userId = useSelector(state => state.auth.userId)
	const ownerId = useSelector(state => state.auth.ownerId)
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
		addressValue: "",
		boroughValue: "",
		latitudeValue: "",
		longitudeValue: "",
		propertyStatusValue: "",
		priceMonthValue: "",
		priceDayValue: "",
		priceYearValue: "",
		roomsValue: "",
		furnishedValue: false,
		poolValue: false,
		elevatorValue: false,
		cctvValue: false,
		parkingValue: false,
		picture1Value: [],
		picture2Value: [],
		picture3Value: [],
		picture4Value: [],
		mapInstance: null,
		markerPosition: {
			lat: "-5.133746047427556",
			lng: "119.4875580004916",
		},
		sendRequest: 0,
		userProfile: {
			agencyName: "",
			phoneNumber: "",
		},
		openSnack: false,
		disabledBtn: false,
		titleErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		listingTypeErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		propertyStatusErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		priceDayErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		priceMonthErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		priceYearErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		boroughErrors: {
			hasErrors: false,
			errorMessage: "",
		},
	};

	function ReducerFuction(draft, action) {
		switch (action.type) {
			case "catchTitleChange":
				draft.titleValue = action.titleChosen;
				draft.titleErrors.hasErrors = false;
				draft.titleErrors.errorMessage = "";
				break;

			case "catchListingTypeChange":
				draft.listingTypeValue = action.listingTypeChosen;
				draft.listingTypeErrors.hasErrors = false;
				draft.listingTypeErrors.errorMessage = "";
				break;

			case "catchDescriptionChange":
				draft.descriptionValue = action.descriptionChosen;
				break;
			
			case "catchAddressChange":
				draft.addressValue = action.addressChosen;
				break;
	

			case "catchBoroughChange":
				draft.boroughValue = action.boroughChosen;
				break;


			case "catchLatitudeChange":
				draft.latitudeValue = action.latitudeChosen;
				break;

			case "catchLongitudeChange":
				draft.longitudeValue = action.longitudeChosen;
				break;

			case "catchPropertyStatusChange":
				draft.propertyStatusValue = action.propertyStatusChosen;
				draft.propertyStatusErrors.hasErrors = false;
				draft.propertyStatusErrors.errorMessage = "";
				break;

			case "catchPriceDayChange":
				draft.priceDayErrors.hasErrors = false;
				draft.priceDayErrors.errorMessage = "";
				draft.priceDayValue = action.priceDayChosen;
				break;
			case "catchPriceMonthChange":
				draft.priceMonthErrors.hasErrors = false;
				draft.priceMonthErrors.errorMessage = "";
				draft.priceMonthValue = action.priceMonthChosen;
				break;

			case "catchPriceYearChange":
				draft.priceYearErrors.hasErrors = false;
				draft.priceYearErrors.errorMessage = "";
				draft.priceYearValue = action.priceYearChosen;
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

			case "catchParkingChange":
				draft.parkingValue = action.parkingChosen;
				break;

			case "getMap":
				draft.mapInstance = action.mapData;
				break;

			case "changeMarkerPosition":
				draft.markerPosition.lat = action.changeLatitude;
				draft.markerPosition.lng = action.changeLongitude;
				draft.latitudeValue = "";
				draft.longitudeValue = "";
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
	
			case "changeSendRequest":
				draft.sendRequest = draft.sendRequest + 1;
				break;

			case "catchUserProfileInfo":
				draft.userProfile.agencyName = action.profileObject.agency_name;
				draft.userProfile.phoneNumber = action.profileObject.phone_number;
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

			case "catchTitleErrors":
				if (action.titleChosen.length === 0) {
					draft.titleErrors.hasErrors = true;
					draft.titleErrors.errorMessage = "This field must not be empty";
				}
				break;

			case "catchListingTypeErrors":
				if (action.listingTypeChosen.length === 0) {
					draft.listingTypeErrors.hasErrors = true;
					draft.listingTypeErrors.errorMessage = "This field must not be empty";
				}
				break;

			case "catchPropertyStatusErrors":
				if (action.propertyStatusChosen.length === 0) {
					draft.propertyStatusErrors.hasErrors = true;
					draft.propertyStatusErrors.errorMessage =
						"This field must not be empty";
				}
				break;

			case "catchPriceDayErrors":
				if (action.priceDayChosen.length === 0) {
					draft.priceDayErrors.hasErrors = true;
					draft.priceDayErrors.errorMessage = "This field must not be empty";
				}
				break;

			case "catchPriceMonthErrors":
				if (action.priceMonthChosen.length === 0) {
					draft.priceMonthErrors.hasErrors = true;
					draft.priceMonthErrors.errorMessage = "This field must not be empty";
				}
				break;

			case "catchPriceYearErrors":
				if (action.priceYearChosen.length === 0) {
					draft.priceYearErrors.hasErrors = true;
					draft.priceYearErrors.errorMessage = "This field must not be empty";
				}
				break;


			case "emptyTitle":
				draft.titleErrors.hasErrors = true;
				draft.titleErrors.errorMessage = "This field must not be empty";
				break;

			case "emptyListingType":
				draft.listingTypeErrors.hasErrors = true;
				draft.listingTypeErrors.errorMessage = "This field must not be empty";
				break;

			case "emptyPropertyStatus":
				draft.propertyStatusErrors.hasErrors = true;
				draft.propertyStatusErrors.errorMessage =
					"This field must not be empty";
				break;

			case "emptyPrice":
				draft.priceErrors.hasErrors = true;
				draft.priceErrors.errorMessage = "This field must not be empty";
				break;

			case "emptyBoroug":
				draft.borougErrors.hasErrors = true;
				draft.borougErrors.errorMessage = "This field must not be empty";
				break;
		}
	}

	const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

	// request to get profile info
	useEffect(() => {
		async function GetProfileInfo() {
			try {
				const response = await Axios.get(
					`http://127.0.0.1:8000/api/profiles/owner/${ownerId}/`
				);

				dispatch({
					type: "catchUserProfileInfo",
					profileObject: response.data,
				});
			} catch (e) {}
		}
		GetProfileInfo();
	}, []);

	function FormSubmit(e) {
		e.preventDefault();

		if (
			!state.titleErrors.hasErrors &&
			!state.listingTypeErrors.hasErrors &&
			!state.propertyStatusErrors.hasErrors &&
			!state.priceDayErrors.hasErrors &&
			!state.priceMonthErrors.hasErrors &&
			!state.priceYearErrors.hasErrors &&
			!state.boroughErrors.hasErrors &&
			state.latitudeValue &&
			state.longitudeValue
		) {
			dispatch({ type: "changeSendRequest" });
			dispatch({ type: "disableTheButton" });
		} else if (state.titleValue === "") {
			dispatch({ type: "emptyTitle" });
			window.scrollTo(0, 0);
		} else if (state.listingTypeValue === "") {
			dispatch({ type: "emptyListingType" });
			window.scrollTo(0, 0);
		} else if (state.propertyStatusValue === "") {
			dispatch({ type: "emptyPropertyStatus" });
			window.scrollTo(0, 0);
		} else if (state.priceDayValue === "") {
			dispatch({ type: "emptyPriceDay" });
			window.scrollTo(0, 0);
		} else if (state.priceMonthValue === "") {
			dispatch({ type: "emptyPriceMonth" });
			window.scrollTo(0, 0);
		} else if (state.priceYearValue === "") {
			dispatch({ type: "emptyPriceYear" });
			window.scrollTo(0, 0);
		} else if (state.boroughValue === "") {
			dispatch({ type: "emptyBorough" });
			window.scrollTo(0, 0);
		}
	}

	useEffect(() => {
		if (state.sendRequest) {
			async function AddProperty() {
				const formData = new FormData();
				formData.append("title", state.titleValue);
				formData.append("description", state.descriptionValue);
				formData.append("address", state.addressValue);
				formData.append("borough", state.boroughValue);
				formData.append("listing_type", state.listingTypeValue);
				formData.append("property_status", state.propertyStatusValue);
				formData.append("price_per_day", state.priceDayValue);
				formData.append("price_per_month", state.priceMonthValue);
				formData.append("price_per_year", state.priceYearValue);
				formData.append("rooms", state.roomsValue);
				formData.append("furnished", state.furnishedValue);
				formData.append("pool", state.poolValue);
				formData.append("elevator", state.elevatorValue);
				formData.append("cctv", state.cctvValue);
				formData.append("parking", state.parkingValue);
				formData.append("latitude", state.latitudeValue);
				formData.append("longitude", state.longitudeValue);
				formData.append("picture1", state.picture1Value);
				formData.append("picture2", state.picture2Value);
				formData.append("picture3", state.picture3Value);
				formData.append("picture4", state.picture4Value);
				formData.append("owner", ownerId);

				try {
					const response = await Axios.post(
						"http://127.0.0.1:8000/api/listings/create/",
						formData
					);

					dispatch({ type: "openTheSnack" });
				} catch (e) {
					dispatch({ type: "allowTheButton" });
				}
			}
			AddProperty();
		}
	}, [state.sendRequest]);

	function SubmitButtonDisplay() {
		if (
			isAuthenticated &&
			state.userProfile.agencyName !== null &&
			state.userProfile.agencyName !== "" &&
			state.userProfile.phoneNumber !== null &&
			state.userProfile.phoneNumber !== ""
		) {
			return (
				<Button
					variant="contained"
					fullWidth
					type="submit"
					className={classes.registerBtn}
					disabled={state.disabledBtn}
				>
					SUBMIT
				</Button>
			);
		} else if (
			isAuthenticated &&
			(state.userProfile.agencyName === null ||
				state.userProfile.agencyName === "" ||
				state.userProfile.phoneNumber === null ||
				state.userProfile.phoneNumber === "")
		) {
			return (
				<Button
					variant="outlined"
					fullWidth
					className={classes.registerBtn}
					onClick={() => navigate("/profileOwner")}
				>
					COMPLETE YOUR PROFILE TO ADD A PROPERTY
				</Button>
			);
		} else if (!isAuthenticated) {
			return (
				<Button
					variant="outlined"
					fullWidth
					onClick={() => navigate("/login")}
					className={classes.registerBtn}
				>
					SIGN IN TO ADD A PROPERTY
				</Button>
			);
		}
	}

	useEffect(() => {
		if (state.openSnack) {
			setTimeout(() => {
				navigate("/datakos");
			}, 1500);
		}
	}, [state.openSnack]);

	return (
		<div className={classes.formContainer}>
			<form onSubmit={FormSubmit}>
				<Grid item container justifyContent="center">
					<Typography variant="h4">Tambahkan Rumah Kos</Typography>
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
						onBlur={(e) =>
							dispatch({
								type: "catchTitleErrors",
								titleChosen: e.target.value,
							})
						}
						error={state.titleErrors.hasErrors ? true : false}
						helperText={state.titleErrors.errorMessage}
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
							onBlur={(e) =>
								dispatch({
									type: "catchListingTypeErrors",
									listingTypeChosen: e.target.value,
								})
							}
							error={state.listingTypeErrors.hasErrors ? true : false}
							helperText={state.listingTypeErrors.errorMessage}
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
							onBlur={(e) =>
								dispatch({
									type: "catchPropertyStatusErrors",
									propertyStatusChosen: e.target.value,
								})
							}
							error={state.propertyStatusErrors.hasErrors ? true : false}
							helperText={state.propertyStatusErrors.errorMessage}
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
				<Grid item container>
					<Grid item xs={12} style={{ marginTop: "1rem" }}>
						<TextField
							id="alamat"
							label="Address*"
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
				<Grid item xs={12} container justifyContent="space-between">

					<Grid item xs={3} style={{ marginTop: "1rem" }}>
						<TextField
							id="priceDay"
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
							onBlur={(e) =>
								dispatch({
									type: "catchPriceDayErrors",
									priceDayChosen: e.target.value,
								})
							}
							error={state.priceDayErrors.hasErrors ? true : false}
							helperText={state.priceDayErrors.errorMessage}
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
							onBlur={(e) =>
								dispatch({
									type: "catchPriceMonthErrors",
									priceMonthChosen: e.target.value,
								})
							}
							error={state.priceMonthErrors.hasErrors ? true : false}
							helperText={state.priceMonthErrors.errorMessage}
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
							onBlur={(e) =>
								dispatch({
									type: "catchPriceYearErrors",
									priceYearChosen: e.target.value,
								})
							}
							error={state.priceYearErrors.hasErrors ? true : false}
							helperText={state.priceYearErrors.errorMessage}
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
				<Grid item container justifyContent="space-between">
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
				
				
					<Grid item xs={5} style={{ marginTop: "1rem" }}>
						<TextField
							id="borough"
							label="Borough*"
							variant="standard"
							fullWidth
							value={state.boroughValue}
							onChange={(e) =>
								dispatch({
									type: "catchBoroughChange",
									boroughChosen: e.target.value,
								})
							}
						>
						</TextField>
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

				{/* Map */}
				<Grid item container justifyContent="space-between" style={{ marginTop: "1rem" }}>					
					<Grid item xs={5} style={{ marginTop: "1rem" }}>
						<TextField
							id="latitude"
							label="Latitude: "
							variant="standard"
							fullWidth
							value={state.latitudeValue}
							onChange={(e) =>
								dispatch({
									type: "catchLatitudeChange",
									latitudeChosen: e.target.value,
								})
							}
						/>
					</Grid>
					<Grid item xs={5} style={{ marginTop: "1rem" }}>
						<TextField
							id="longitude"
							label="Longitude: "
							variant="standard"
							fullWidth
							value={state.longitudeValue}
							onChange={(e) =>
								dispatch({
									type: "catchLongitudeChange",
									longitudeChosen: e.target.value,
								})
							}
						/>
					</Grid>
		
				</Grid>

				<Grid item container>
					
					
				</Grid>
				<Grid item container>
					<Grid item xs={6}>
						<Grid
							item
							container
							xs={12}
							style={{width:'50%', marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
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
						<Typography style={{height: '5rem'}}>
								{state.picture1Value ? <p>{state.picture1Value.name}</p> : ""}
							</Typography>
						<Grid
							item
							container
							xs={12}
							style={{width:'50%', marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
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
						<Typography style={{height: '5rem'}}>
							{state.picture2Value ? <p>{state.picture2Value.name}</p> : ""}
						</Typography>
					</Grid>
					<Grid item xs={6}>
						<Grid
							item
							container
							xs={12}
							style={{width:'50%', marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
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
							<Typography style={{height: '5rem'}}>
								{state.picture3Value ? <p>{state.picture3Value.name}</p> : ""}
							</Typography>
						<Grid
							item
							container
							xs={12}
							style={{width:'50%', marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
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
							<Typography style={{height: '5rem'}}>
								{state.picture4Value ? <p>{state.picture4Value.name}</p> : ""}
							</Typography>
					</Grid>

				</Grid>
				<Grid
					item
					container
					xs={8}
					style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
				>
					{SubmitButtonDisplay()}
				</Grid>
			</form>

			<Snackbar
				open={state.openSnack}
				message="You have successfully added your property!"
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
			/>
		</div>
	);
}

export default ListingAdd;
