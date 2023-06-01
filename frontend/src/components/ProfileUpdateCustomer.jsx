import React, { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { useSelector } from 'react-redux'

// MUI
import {
	Grid,
	Typography,
	Button,
	TextField,
	Snackbar,
	Paper,
} from "@mui/material";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
	formContainer: {
		width: "95%",
		marginLeft: "auto",
		marginRight: "auto",
		padding: "3rem",
	},
	loginBtn: {
		backgroundColor: "success",
		color: "white",
		fontSize: "1.1rem",
		marginLeft: "1rem",
		"&:hover": {
			backgroundColor: "blue",
		},
	},
	picturesBtn: {
		backgroundColor: "primary",
		color: "white",
		fontSize: "0.8rem",
		marginLeft: "1rem",
	},
});

function ProfileUpdateCustomer(props) {
	const userId = useSelector(state => state.auth.userId)
	const classes = useStyles();
	const navigate = useNavigate();

	const initialState = {
		fullNameValue: props.userProfile.fullName,
		phoneNumberValue: props.userProfile.phoneNumber,
		addressValue: props.userProfile.address,
        dateOfBirthValue: props.userProfile.dateOfBirth,
		uploadedPicture: [],
		profilePictureValue: props.userProfile.profilePic,
		sendRequest: 0,
		openSnack: false,
		disabledBtn: false,
	};

	function ReducerFuction(draft, action) {
		switch (action.type) {
			case "catchFullNameChange":
				draft.fullNameValue = action.fullNameChosen;
				break;

			case "catchPhoneNumberChange":
				draft.phoneNumberValue = action.phoneNumberChosen;
				break;

			case "catchAddressChange":
				draft.addressValue = action.addressChosen;
				break;
                
            case "catchDateOfBirthChange":
                draft.dateOfBirthValue = action.dateOfBirthChosen;
                break;


			case "catchUploadedPicture":
				draft.uploadedPicture = action.pictureChosen;
				break;

			case "catchProfilePictureChange":
				draft.profilePictureValue = action.profilePictureChosen;
				break;

			case "changeSendRequest":
				draft.sendRequest = draft.sendRequest + 1;
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

	// Use effect to cath uplaoded picture
	useEffect(() => {
		if (state.uploadedPicture[0]) {
			dispatch({
				type: "catchProfilePictureChange",
				profilePictureChosen: state.uploadedPicture[0],
			});
		}
	}, [state.uploadedPicture[0]]);

	// use effect to send the request
	useEffect(() => {
		if (state.sendRequest) {
			async function UpdateProfile() {
				const formData = new FormData();

				if (
					typeof state.profilePictureValue === "string" ||
					state.profilePictureValue === null
				) {
					formData.append("full_name", state.fullNameValue);
					formData.append("address", state.addressValue);
					formData.append("phone_number", state.phoneNumberValue);
                    formData.append("date_of_birth", state.dateOfBirthValue);

					// formData.append("user", state.GlobalState.userId);
				} else {
					formData.append("agency_name", state.agencyNameValue);
					formData.append("phone_number", state.phoneNumberValue);
					formData.append("address", state.addressValue);
                    formData.append("date_of_birth", state.dateOfBirthValue);
					formData.append("profile_picture", state.profilePictureValue);
					// formData.append("user", state.userId);
				}

				try {
					const response = await Axios.patch(
						`http://127.0.0.1:8000/api/profiles/customer/${userId}/update/`,
						formData
					);

					dispatch({ type: "openTheSnack" });
				} catch (e) {
					dispatch({ type: "allowTheButton" });
				}
			}
			UpdateProfile();
		}
	}, [state.sendRequest]);

	useEffect(() => {
		if (state.openSnack) {
			setTimeout(() => {
				navigate(0);
			}, 1500);
		}
	}, [state.openSnack]);

	function FormSubmit(e) {
		e.preventDefault();
		dispatch({ type: "changeSendRequest" });
		dispatch({ type: "disableTheButton" });
	}

	function ProfilePictureDisplay() {
		if (typeof state.profilePictureValue !== "string") {
			return (
				<ul>
					{state.profilePictureValue ? (
						<li>{state.profilePictureValue.name}</li>
					) : (
						""
					)}
				</ul>
			);
		} else if (typeof state.profilePictureValue === "string") {
			return (
				<Grid
					item
					style={{
						marginTop: "0.5rem",
						marginRight: "auto",
						marginLeft: "auto",
					}}
				>
					<img
						src={props.userProfile.profilePic}
						style={{ height: "5rem", width: "5rem", borderRadius: '50%'}}
					/>
				</Grid>
			);
		}
	}

	return (
		<>
			<Paper style={{width: '80%'}}>
			<div className={classes.formContainer}>
				
				<form onSubmit={FormSubmit}>
					<Grid item container justifyContent="center">
						<Typography variant="h4">MY PROFILE</Typography>
					</Grid>

					<Grid item container style={{ marginTop: "1rem" }}>
						<TextField
							id="fullName"
							label="Full Name*"
							variant="standard"
							fullWidth
							value={state.fullNameValue}
							onChange={(e) =>
								dispatch({
									type: "catchFullNameChange",
									fullNameChosen: e.target.value,
								})
							}
						/>
					</Grid>

					<Grid item container style={{ marginTop: "1rem" }}>
						<TextField
							id="phoneNumber"
							label="Phone Number*"
							variant="standard"
							fullWidth
							value={state.phoneNumberValue}
							onChange={(e) =>
								dispatch({
									type: "catchPhoneNumberChange",
									phoneNumberChosen: e.target.value,
								})
							}
						/>
					</Grid>

					<Grid item container style={{ marginTop: "1rem" }}>
						<TextField
							id="address"
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

					<Grid item container style={{ marginTop: "1rem" }}>
						<TextField
							id="dateOfBirth"
							label="Date Of Birth"
							variant="standard"
                            type="date"
							rows={6}
							fullWidth
							value={state.dateOfBirthValue}
							onChange={(e) =>
								dispatch({
									type: "catchDateOfBirthChange",
									dateOfBirthChosen: e.target.value,
								})
							}
						/>
					</Grid>

					<Grid item container>
						{ProfilePictureDisplay()}
					</Grid>

					<Grid
						item
						container
						xs={6}
						style={{
							marginTop: "1rem",
							marginLeft: "auto",
							marginRight: "auto",
						}}
					>
						<Button
							variant="outlined"
							component="label"
							fullWidth
						>
							UPLOAD PICTURE
							<input
								type="file"
								accept="image/png, image/gif, image/jpeg"
								hidden
								onChange={(e) =>
									dispatch({
										type: "catchUploadedPicture",
										pictureChosen: e.target.files,
									})
								}
							/>
						</Button>
					</Grid>

					<Grid
						item
						container
						xs={8}
						style={{
							marginTop: "1rem",
							marginLeft: "auto",
							marginRight: "auto",
						}}
					>
						<Button
							variant="outlined"
							fullWidth
							type="submit"
						>
							UPDATE
						</Button>
					</Grid>
				</form>
				
				<Snackbar
					open={state.openSnack}
					message="You have successfully updated your profile!"
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center",
					}}
				/>
			</div>
			</Paper>
		</>
	);
}

export default ProfileUpdateCustomer;
