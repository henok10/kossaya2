import React, {useState} from 'react'
import {connect} from "react-redux"
import {login} from "../../actions/auth"
import {NavLink, Navigate, useNavigate} from "react-router-dom"
import PropTypes from "prop-types"

// MUI
import {
	Grid,
	Typography,
	Button,
	TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";


const useStyles = makeStyles({
	formContainer: {
		width: "70%",
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: "3rem",
		border: "5px solid lightWhite",
		padding: "3rem",
        height: '100%'
	},
	loginBtn: {
        marginTop: '1rem',
		backgroundColor: "green",
		color: "white",
		fontSize: "1.1rem",
		"&:hover": {
			backgroundColor: "blue",
		},
	},
});
function Login({login, isAuthenticated, isCustomer, isOwner}) {
    const classes = useStyles();
    const navigate = useNavigate();
    const userId = useSelector(state => state.auth.userId)
    
    
    const [user, setUser]=useState({
        email:"",
        password:""
    })

    const {email, password}=user
    

    const loginChange=(e)=>setUser({...user, [e.target.name]:e.target.value})
     const handleLoginSubmit=(e)=>{
         e.preventDefault();
         login({email, password})
     }
    
     if (isAuthenticated && isCustomer){
        return <Navigate to="/customer/home" />
    }else if(isAuthenticated && isOwner){
        return <Navigate to="/owner/home" />
    }else{  
    console.log(userId)
    console.log(isAuthenticated)
    console.log(isCustomer)
    
    return (
        <div className={classes.formContainer}>
            
            <div className='row'>
                <div className='col-md-6 mx-auto'>
                    <Grid item container justifyContent="center">
                        <Typography variant="h4">SIGN IN</Typography>
                    </Grid>
                    <form onSubmit={(e)=>handleLoginSubmit(e)}>
                    <Grid item container style={{ marginTop: "1rem" }}>
                        <TextField
                            id="email"
                            label="Email"
                            fullWidth
                            name="email" 
                            variant="outlined"
                            
                            value={email}
                            onChange={ e =>loginChange(e)} 
                        />
				    </Grid>
                    <Grid item container style={{ marginTop: "1rem" }}>
                        <TextField
                            id="password"
                            label="Password"
                            fullWidth
                            name="password"
                            variant="outlined"
                            
                            type="password"
                            value={password}
                            onChange={ e =>loginChange(e)} 
                        />
				    </Grid>
                    <NavLink to='/sendpasswordresetemail' >Forgot Password ?</NavLink>
                    <Grid
                        item
                        container
                        xs={8}
                        style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
				    >
                        <Button
                            variant="contained"
                            fullWidth
                            type="submit"
                            // className={classes.loginBtn}
                            // disabled={state.disabledBtn}
                        >
                            SIGN IN
                        </Button>
                        
				    </Grid>
                  

                    </form>

                    <Grid
                        item
                        container
                        justifyContent="center"
                        style={{ marginTop: "1rem" }}
                    >
                        <Typography variant="small">
                            Don't have an account yet?{" "}
                            <span
                                onClick={() => navigate("/")}
                                style={{ cursor: "pointer", color: "green" }}
                            >
                                SIGN UP
                            </span>
                        </Typography>
                    </Grid>
                    
                </div>
            </div>
        </div>
    )
    }
}

Login.propTypes={
    login:PropTypes.func.isRequired,
    isAuthenticated:PropTypes.bool,
    isCustomer:PropTypes.bool,
    isOwner:PropTypes.bool
};

const mapStateToProps = state =>({
    isAuthenticated: state.auth.isAuthenticated,
    isCustomer: state.auth.isCustomer,
    isOwner: state.auth.isOwner
    
});

export default connect(mapStateToProps, {login})(Login)
