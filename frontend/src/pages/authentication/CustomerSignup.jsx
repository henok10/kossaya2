import React, {useState} from 'react'
import { connect } from 'react-redux'
import  PropTypes from "prop-types"
import { create_customeruser } from '../../actions/auth'
import {Navigate, useNavigate} from "react-router-dom"

// MUI
import {
	Grid,
	Typography,
	Button,
	TextField,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { makeStyles } from "@mui/styles";


const CustomerSignup = ({create_customeruser, isAuthenticated, isCustomer}) => {
    const navigate = useNavigate();
    const [customer, setCustomer]=useState({
        username:'',
        email:'',
        password:'',
        password2:'',
        tc:'false'

    })

    const handleChange=(e)=>setCustomer({
        ...customer,
        [e.target.name]:e.target.value })
        
    const {username, email, password, password2, tc}=customer
     
   const handleSubmit=(e)=>{
       e.preventDefault();
       const newCustomer={
           username,
           email,
           password,
           password2, 
           tc
       }
       console.log(newCustomer)
    create_customeruser(newCustomer)
   }
    if(isAuthenticated && isCustomer){
        return <Navigate to="/customer/home"/>
    }
    return (
        <div className='container' style={{marginTop:'5rem', width:'60%'}}>
            <Grid item container justifyContent="center">
                <Typography variant="h4">SIGNUP AS A CUSTOMER</Typography>
            </Grid>
            <div className='row'>
                <div className='col-md-8 mx-auto'>
                    <form onSubmit={ e =>handleSubmit(e)}>
                        <Grid item container style={{ marginTop: "2rem" }}>
                            <TextField
                                id="username"
                                label="Username"
                                name="username" 
                                variant="outlined"
                                fullWidth
                                value={username}
                                onChange={(e)=>handleChange(e)}
                            />
				        </Grid>
         
                        <Grid item container style={{ marginTop: "1rem" }}>
                            <TextField
                                id="email"
                                label="Email"
                                name="email"
                                variant="outlined"
                                fullWidth
                                type="email"
                                value={email}
                                onChange={(e)=>handleChange(e)}
                            />
				        </Grid>
                        <Grid item container style={{ marginTop: "1rem" }}>
                            <TextField
                                id="password"
                                label="Password"
                                name="password"
                                variant="outlined"
                                fullWidth
                                type="password"
                                value={password}
                                onChange={(e)=>handleChange(e)} 
                            />
				        </Grid>
                        <Grid item container style={{ marginTop: "1rem" }}>
                            <TextField
                                id="password2"
                                label="Confirm password"
                                name="password2"
                                variant="outlined"
                                fullWidth
                                type="password"
                                value={password2}
                                onChange={(e)=>handleChange(e)} 
                            />
				        </Grid>
                        <FormControlLabel 
                            control={<Checkbox 
                                        value={true} 
                                        color="primary" 
                                        name="tc" 
                                        id="tc"
                                        onChange={(e)=>handleChange(e)}
                                         />} 
                            // value={tc}
                            label="I agree to term and condition." 
                        />
                        {/* <button type="submit" className="btn btn-primary">Signup</button> */}
                        <Grid
                            item
                            container
                            xs={8}
                            style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
                        >
                            <Button
                                variant="contained"
                                className="btn btn-primary"
                                fullWidth
                                type="submit"
                                // className={classes.loginBtn}
                                // disabled={state.disabledBtn}
                            >
                                SIGN IN
                            </Button>
				         </Grid>

                         <Grid
                        item
                        container
                        justifyContent="center"
                        style={{ marginTop: "1rem" }}
                    >
                        <Typography variant="small">
                            have an account yet?{" "}
                            <span
                                onClick={() => navigate("/login")}
                                style={{ cursor: "pointer", color: "green" }}
                            >
                                SIGN IN
                            </span>
                        </Typography>
                    </Grid>
                  
                    </form>
                </div>
            </div>
        </div>
    )
}

CustomerSignup.propTypes={
    create_customeruser:PropTypes.func.isRequired,
    isAuthenticated:PropTypes.bool,
    isCustomer:PropTypes.bool
}


const mapStateToProps= state =>({
    isAuthenticated:state.auth.isAuthenticated,
    isCustomer:state.auth.isCustomer
})

export default  connect(mapStateToProps, {create_customeruser})(CustomerSignup)
