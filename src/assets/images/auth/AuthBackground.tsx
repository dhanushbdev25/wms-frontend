// material-ui
import { Box } from '@mui/material';

// ==============================|| AUTH BACKGROUND - Modern SAP Fiori Style ||============================== //

const AuthBackground = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        background: 'linear-gradient(135deg, #FFF3E0 0%, #F5F6FA 25%, #FFFFFF 50%, #F5F6FA 75%, #FFF3E0 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 15% 30%, rgba(245, 124, 0, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 85% 70%, rgba(230, 81, 0, 0.06) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(245, 124, 0, 0.03) 0%, transparent 60%)
          `,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(45deg, transparent 48%, rgba(245, 124, 0, 0.015) 49%, rgba(245, 124, 0, 0.015) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(245, 124, 0, 0.015) 49%, rgba(245, 124, 0, 0.015) 51%, transparent 52%)
          `,
          backgroundSize: '60px 60px',
        },
      }}
    />
  );
};

export default AuthBackground;
