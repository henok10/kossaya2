import { BottomNavigation, Box, Paper, Typography } from '@mui/material';
import { useState } from 'react';

const BottomNav = () => {
  const [value, setValue] = useState(0);

  return (
    <Box position="static" width='100%' marginTop={'10rem'}>
      <Paper sx={{ position: 'static', bottom: 0, left: 0, right: 0, height: '56px' }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(e, newValue) => setValue(newValue)}
          sx={{ height: '100%' }}
        >
          <Box margin='auto'>
            <Typography style={{margin: 'auto'}}>
              &copy;{new Date().getFullYear()} KOS SAYA | All rights reserved |
              Terms Of Service | Privacy
            </Typography>
            
          </Box>
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default BottomNav;
