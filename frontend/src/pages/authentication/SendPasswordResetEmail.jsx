import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Button, TextField, Typography } from '@mui/material';
import { sendPasswordResetEmail } from '../../actions/auth';

const SendPasswordResetEmail = ({ sendPasswordResetEmail }) => {
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useState({
        email: ''
    });
    const [successMessage, setSuccessMessage] = useState('');

    const { email } = formData;

    useEffect(() => {
        if (successMessage) {
            const timeout = setTimeout(() => {
                setRequestSent(true);
            }, 30000);

            return () => clearTimeout(timeout);
        }
    }, [successMessage]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        sendPasswordResetEmail(email);
        setSuccessMessage('Email successfully sent!');
    };

    if (requestSent) {
        return <Navigate to='/' />;
    }

    return (
        <Grid contained marginTop={'2rem'} width='40%' margin='auto' height='100%'>
            <Typography variant='h5' style={{ textAlign: 'center' }}>Request Password Reset</Typography>
            {successMessage && (
                <Typography variant='body1' align='center' color='success'>
                    {successMessage}
                </Typography>
            )}
            <form onSubmit={e => onSubmit(e)}>
                <Grid className='form-group' marginTop={'2rem'}>
                    <TextField
                        className='form-control'
                        type='email'
                        placeholder='Email'
                        name='email'
                        value={email}
                        onChange={e => onChange(e)}
                        required
                    />
                </Grid>
                <Grid style={{ marginTop: "4px", display: 'flex', justifyContent: 'center' }}>
                    <Button 
                        variant="contained" 
                        style={{ marginTop: "1rem", display: 'flex', justifyContent: 'center' }}
                        type='submit'>
                            Reset Password
                    </Button>
                </Grid>
            </form>
        </Grid>
    );
};

export default connect(null, { sendPasswordResetEmail })(SendPasswordResetEmail);