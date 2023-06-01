import React, { useEffect } from "react";
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
		width: "80%",
		marginLeft: "auto",
		marginRight: "auto",
		// marginTop: "3rem",
		border: "5px solid white",
		padding: "3rem",
	},
	loginBtn: {
		backgroundColor: "success",
		color: "white",
		fontSize: "1.1rem",
		marginLeft: "1rem",
	},
	picturesBtn: {
		backgroundColor: "primary",
		color: "white",
		fontSize: "0.8rem",
		marginLeft: "1rem",
	},
});

function ProfileUpdate(props) {
	const userId = useSelector(state => state.auth.userId)
	const classes = useStyles();
	const navigate = useNavigate();

	const initialState = {
		agencyNameValue: props.userProfile.agencyName,
		phoneNumberValue: props.userProfile.phoneNumber,
		bioValue: props.userProfile.bio,
		addressValue: props.userProfile.address,
		uploadedPicture: [],
		profilePictureValue: props.userProfile.profilePic,
		sendRequest: 0,
		openSnack: false,
		disabledBtn: false,
	};

	function ReducerFuction(draft, action) {
		switch (action.type) {
			case "catchAgencyNameChange":
				draft.agencyNameValue = action.agencyNameChosen;
				break;

			case "catchPhoneNumberChange":
				draft.phoneNumberValue = action.phoneNumberChosen;
				break;

			case "catchAddressChange":
				draft.addressValue = action.AddressChosen;
				break;

			case "catchBioChange":
				draft.bioValue = action.bioChosen;
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
					formData.append("agency_name", state.agencyNameValue);
					formData.append("address", state.addressValue);
					formData.append("phone_number", state.phoneNumberValue);
					formData.append("bio", state.bioValue);
					// formData.append("user", state.GlobalState.userId);
				} else {
					formData.append("agency_name", state.agencyNameValue);
					formData.append("phone_number", state.phoneNumberValue);
					formData.append("address", state.addressValue);
					formData.append("bio", state.bioValue);
					formData.append("profile_picture", state.profilePictureValue);
					// formData.append("user", state.userId);
				}

				try {
					const response = await Axios.patch(
						`http://127.0.0.1:8000/api/profiles/owner/${userId}/update/`,
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
						style={{ height: "5rem", width: "5rem" }}
					/>
				</Grid>
			);
		}
	}

	return (
		<>
		<Paper style={{width: '90%'}}>

		
			<div className={classes.formContainer}>
				<form onSubmit={FormSubmit}>
					<Grid item container justifyContent="center">
						<Typography variant="h4">MY PROFILE</Typography>
					</Grid>

					<Grid item container style={{ marginTop: "1rem" }}>
						<TextField
							id="agencyName"
							label="Agency Name*"
							variant="standard"
							fullWidth
							value={state.agencyNameValue}
							onChange={(e) =>
								dispatch({
									type: "catchAgencyNameChange",
									agencyNameChosen: e.target.value,
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
									AddressChosen: e.target.value,
								})
							}
						/>
					</Grid>

					<Grid item container style={{ marginTop: "1rem" }}>
						<TextField
							id="bio"
							label="Bio"
							variant="outlined"
							multiline
							rows={6}
							fullWidth
							value={state.bioValue}
							onChange={(e) =>
								dispatch({
									type: "catchBioChange",
									bioChosen: e.target.value,
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
							variant="contained"
							component="label"
							fullWidth
							className={classes.picturesBtn}
						>
							PROFILE PICTURE
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
							variant="contained"
							fullWidth
							type="submit"
							className={classes.loginBtn}
							disabled={state.disabledBtn}
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

export default ProfileUpdate;
