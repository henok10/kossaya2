import React, { useEffect } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";

// Assets
import defaultProfilePicture from "../data/defaultProfilePicture.jpg";

// Components
import ProfileUpdateCustomer from "../components/ProfileUpdateCustomer";

// MUI
import {
	Grid,
	Typography,
	CircularProgress,
	CardHeader,
	CardMedia,
	CardContent,
	CardActions,
	Card,
	Button
} from "@mui/material";

function ProfileCustomer() {
	const userId = useSelector(state => state.auth.userId)
	const customerId = useSelector(state => state.auth.customerId)
	const username = useSelector(state => state.auth.username);
	const navigate = useNavigate();

	const initialState = {
		userProfile: {
			fullName: "",
			phoneNumber: "",
			address: "",
			dateOfBirth: "",
			profilePic: "",
			userId: "",
		},
		dataIsLoading: true,
	};

	function ReducerFuction(draft, action) {
		switch (action.type) {
			case "catchUserProfileInfo":
				draft.userProfile.fullName = action.profileObject.full_name;
				draft.userProfile.phoneNumber = action.profileObject.phone_number;
				draft.userProfile.profilePic = action.profileObject.profile_picture;
				draft.userProfile.address = action.profileObject.address;
				draft.userProfile.dateOfBirth = action.profileObject.date_of_birth;
				draft.userProfile.userId = action.profileObject.user;
				break;

			case "loadingDone":
				draft.dataIsLoading = false;
				break;
		}
	}

	const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

	// request to get profile info
	useEffect(() => {
		async function GetProfileInfo() {
			try {
				const response = await Axios.get(
					`http://127.0.0.1:8000/api/profiles/customer/${userId}/`
				);

				dispatch({
					type: "catchUserProfileInfo",
					profileObject: response.data,
				});
				dispatch({ type: "loadingDone" });
			} catch (e) {}
		}
		GetProfileInfo();
	}, []);

	function WelcomeDisplay() {
		if (
			state.userProfile.fullName === null ||
			state.userProfile.fullName === "" ||
			state.userProfile.phoneNumber === null ||
			state.userProfile.phoneNumber === ""
			
		) {
			return (
				<Typography
					variant="h5"
					style={{ textAlign: "center", marginTop: "1rem" }}
				>
					Welcome{" "}
					{username}
					, please submit this form below to update your profile.
				</Typography>
			);
		} else {
			return (
				<Card 
				container
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{
					width: "50%",
					marginLeft: "auto",
					marginRight: "auto",
					padding: "5px",
				}}
				>
					<CardMedia
						style={{
							display: "block",
							margin: "auto",
							height: "10rem",
							width: "10rem",
							marginTop: '1rem',
							borderRadius: "50%",}}
						image={
							state.userProfile.profilePic !== null
								? state.userProfile.profilePic
								: defaultProfilePicture
							}
					/>
					<CardContent>
						<Typography
							variant="h5"
							style={{ textAlign: "center", marginTop: "1rem" }}
							>
							Welcome Customer {username}
						</Typography>
						<Typography>

						</Typography>
					</CardContent>
				</Card>


			);
		}
	}

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
		<>
		<Grid item container width = '100%'>
			<Grid item lg={6} md={6} sm={12} xs={12} marginTop={'2rem'}>
				<div>{WelcomeDisplay()}</div>
				<Button variant='outlined' style={{marginTop:'4rem'}} onClick={() =>
                              navigate(`/changePassword`)
                            }>
					Change Password
				</Button>
			</Grid>
			<Grid item lg={6} md={6} sm={12} xs={12} marginTop={'2rem'}>				
				<ProfileUpdateCustomer userProfile={state.userProfile} />
			</Grid>	
		</Grid>
			

			
		</>
	);
}

export default ProfileCustomer;
