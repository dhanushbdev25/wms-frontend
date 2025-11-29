// material-ui
import { Box, CircularProgress, styled } from '@mui/material';

// ==============================|| Loader - SAP Fiori Style ||============================== //

const LoaderWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2001,
  width: '100%',
  height: '4px',
  backgroundColor: 'transparent',
  overflow: 'hidden',
}));

const ProgressBar = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  position: 'relative',
  backgroundColor: '#FFF3E0',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '30%',
    backgroundColor: '#F57C00',
    animation: 'loading 1.5s ease-in-out infinite',
    '@keyframes loading': {
      '0%': {
        transform: 'translateX(-100%)',
      },
      '50%': {
        transform: 'translateX(400%)',
      },
      '100%': {
        transform: 'translateX(400%)',
      },
    },
  },
}));

const Loader = () => (
  <LoaderWrapper>
    <ProgressBar />
  </LoaderWrapper>
);

export default Loader;
