import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { reset_password } from "../../actions/auth";
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Typography, TextField, Button } from '@mui/material';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    password2: ''
  });

  const { password, password2 } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, token } = useParams();
  const [resetSuccess, setResetSuccess] = useState(false); // State for reset success message
  const [error, setError] = useState(''); // State for error message

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    try {
        const response = await dispatch(reset_password(id, token, password, password2));
        if (response.success) {
          // Reset password success
          setResetSuccess(true); // Set reset success message
          setError(''); // Clear error message
          navigate('/');
        } else {
          // Reset password error
          setResetSuccess(false); // Clear reset success message
          setError(response.message); // Set error message
        }
      } catch (error) {
        // Handle error case
        setResetSuccess(false); // Clear reset success message
      }
    };
  
  return (
    <Grid contained  width={'40%'} margin='auto' height='100%'>  
      <Typography variant='h5' marginTop={'2rem'} textAlign={'center'}>
            Reset Password Anda
      </Typography>
      {resetSuccess && <p>Password reset successful</p>} {/* Show reset success message */}
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
  );
};

export default ResetPassword;
