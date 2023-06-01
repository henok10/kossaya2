import React from 'react';
import { makeStyles } from "@mui/styles";
import city from "../data/minion.jpg";
import Search from './Search';

const useStyles = makeStyles(() => ({
    hero: {
      backgroundImage: `url(${city})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      height: '90vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
}));

const HomeImg = ({setSearchTerm }) => {
    const classes = useStyles();
    return (
        <section className={classes.hero}>
            <Search setSearchTerm={setSearchTerm} />
        </section>
    );
}

export default HomeImg;
