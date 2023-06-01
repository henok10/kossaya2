import React, { useState, useEffect } from 'react';
import { useImmerReducer } from "use-immer";
import axios from 'axios';
import { makeStyles } from "@mui/styles";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Snackbar,
  Grid,
} from "@mui/material";
import Alert from '@mui/material/Alert';
import { useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";


const useStyles = makeStyles((theme) => ({
  formControl: {
    // margin: theme.spacing(1),
    marginRight: "0.5rem",
    minWidth: 300,
  },
  submitButton: {
    marginTop: "1rem",
    width: "50%"
    // marginTop: theme.spacing(2),
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  stars: {
    display: "flex",
    flexDirection: "row",
  },
  textarea: {
    display: "flex",
    border: "1px solid #a9a9a9",
    borderRadius: 5,
    padding: 10,
    // margin: "20px",
    minHeight: 100,
    width: 600
  },
  button: {
    border: "1px solid #a9a9a9",
    borderRadius: 5,
    width: 300,
    padding: 10,
  },
}));

const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9"
  
};

function Review() {
  // const navigate = useNavigate();
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // const isCostumer = useSelector((state) => state.auth.isCostumer);
  const userId = useSelector(state => state.auth.userId)
  const params = useParams();
  // const params = useParams();
  const classes = useStyles();
  const [comment, setComment] = useState('');
  const [rate, setRate] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = Array(5).fill(0)

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://127.0.0.1:8000/api/review/create', {
      comment: comment,
      rate: rate,
      listing: params.id,
      user: userId,
    }).then(response => {
      setSuccess(true);
    }).catch(error => {
      setError('There was an error submitting your review');
    });
  }
  const handleClick = value => {
    setRate(value)
  }

  const handleMouseOver = newHoverValue => {
    setHoverValue(newHoverValue)
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccess(false);
  };

  return (
    <>
    <form onSubmit={handleSubmit} className={classes.container}>
      <h4><strong>Beri Kami Penilaian</strong></h4>
    <div className={classes.stars}>
        {stars.map((_, index) => {
          return (
            <FaStar
              key={index}
              size={24}
              onClick={() => handleClick(index + 1)}
              onMouseOver={() => handleMouseOver(index + 1)}
              onMouseLeave={handleMouseLeave}
              color={(hoverValue || rate) > index ? colors.orange : colors.grey}
              style={{
                marginRight: 10,
                cursor: "pointer"
              }}
            />
          )
        })} 
    </div>
    <div style={{margin: '20px'}}>
      <FormControl className={classes.textarea} >
        <TextField
          id="comment"
          label="What's your experience?"
          multiline
          rows={4}
          variant="outlined"
          value={comment}
          onChange={e => setComment(e.target.value)}
          marginTop='1rem'
        />
      </FormControl>
    </div>
      
      <Button
        className={classes.button}
        type="submit"
        // fullWidth
        variant="contained"
        // color="primary"
       
      >
        Submit
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert elevation={6} variant="filled" onClose={handleClose} severity="success">
          Review added successfully!
        </Alert>
      </Snackbar>
    </form>
    </>
    
  );
}


export default Review;


