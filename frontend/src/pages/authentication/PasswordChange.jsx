import {  Grid, TextField, Button, Alert, Typography } from '@mui/material';
import { useState} from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { change_user_password } from '../../actions/auth';
// import { getToken } from '../../services/LocalStorageService'
const ChangePassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    password2: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, token } = useParams();
  const [changeSuccess, setChangeSuccess] = useState(false); // State for reset success message
  const [error, setError] = useState(''); // State for error message
  const { password, password2 } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    try {
        const response = await dispatch(change_user_password(password, password2));
        if (response.success) {
          // Reset password success
          setChangeSuccess(true); // Set reset success message
          setError(''); // Clear error message
          navigate('/');
        } else {
          // Reset password error
          setChangeSuccess(false); // Clear reset success message
          setError(response.message); // Set error message
        }
      } catch (error) {
        // Handle error case
        setChangeSuccess(false); // Clear reset success message
      }
    };
  // Getting User Data from Redux Store
  // const myData = useSelector(state => state.user)
  // console.log("Change Password", myData)

  return <>
    {/* {server_error.non_field_errors ? console.log(server_error.non_field_errors[0]) : ""}
    {server_error.password ? console.log(server_error.password[0]) : ""}
    {server_error.password2 ? console.log(server_error.password2[0]) : ""} */}
     <Grid contained  width={'40%'} margin='auto' height='100%'>  
      <Typography variant='h5' marginTop={'2rem'} textAlign={'center'}>
            Reset Password Anda
      </Typography>
      {changeSuccess && <p>Password reset successful</p>} {/* Show reset success message */}
      <form onSubmit={onSubmit} style={{marginTop:'2rem'}}>
        <Grid item container>
          <TextField
             id="password"
             label="Password"
             fullWidth
             name="password"
             variant="outlined"
             type="password"
             value={password}
             onChange={onChange}
          />
        </Grid>
        <Grid item container marginTop={'4px'}>
        <TextField
            id="password2"
            label="Konfirmasi Password"
            fullWidth
            name="password2"
            variant="outlined"
            type="password"
            value={password2}
            onChange={onChange} 
        />
        </Grid>
        <Grid style={{ marginTop: "4px", display: 'flex', justifyContent: 'center' }}>
            <Button 
                variant="contained" 
                color='primary' 
                style={{ marginTop: "1rem", display: 'flex', justifyContent: 'center' }}
                type='submit'>
                    Reset Password
            </Button>
        </Grid>
       
      </form>
    </Grid>
  </>;
};

export default ChangePassword;