import * as React from 'react';
import Link       from '@mui/material/Link';
import AppBar     from '@mui/material/AppBar';
import Box        from '@mui/material/Box';
import Toolbar    from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu       from '@mui/material/Menu';
import MenuIcon   from '@mui/icons-material/Menu';
import Container  from '@mui/material/Container';
import Button     from '@mui/material/Button';
import MenuItem   from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

import CladdLogo from '../../assets/Images/claddLogo.png'

const Navbar = ({ Titulo, Routes, color, plantaLogo }) =>  
{
  const theme = createTheme({
    palette: {
      cladd: {
        // Purple and green play nicely together.
        main: "#45474e",
      },
      enod: {
        // This is green.A700 as hex.
        main: '#4C7766',
      },
      alpacladd: {
        // This is green.A700 as hex.
        main: '#1A4862',
      },
    },
  });


    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
  
    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color={color}>
      {/* <Container maxWidth="xl">
        <Toolbar disableGutters> */}

          {/* PAGINAS EN DISPOSITIVOS MOVILES VERTICAL*/}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <Grid container columnSpacing={4} sx={{  width:"100%",}} >
              <Grid xs={2} sm={2} >
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {Routes.map((route) => (
                    <MenuItem key={route.key} onClick={handleCloseNavMenu}>
                      <Link key={route.key} href={route.route} target="_self" underline="none">
                        <Typography textAlign="center" fontFamily="Script/Handwritten">
                          {route.name}
                        </Typography>
                      </Link>
                    </MenuItem>
                     ))}
                </Menu>
              </Grid>
              <Grid xs={10} sm={10}>
                            {/* LOGO EN DISPOSITIVOS MOVILES VERTICAL */}
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    marginTop:1,
                    flexGrow: 1,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                    fontFamily: 'Script/Handwritten',
                  }}
                >
                    {Titulo}
                </Typography>

              </Grid>
            </Grid>
          </Box>
          

          {/* PAGINAS */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}>
          <Grid container columnSpacing={1}>
            <Grid xs={12} sm={12} md={12} display={"flex"}>
            <img src= { CladdLogo } alt="logo" width="130" height = "65" style = {{paddingLeft:  '0.5em', paddingTop:  '0.5em'}}/>
              <Typography
              variant="h3"
              sx={{
                display: { xs: 'none', md: 'flex' },
                mt:2,
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                //fontFamily: 'monospace',
                fontFamily: 'Script/Handwritten',
                letterSpacing: '0.1rem',
                color: '#ffffff',
                textDecoration: 'none',
              }}
            >
              {Titulo}
            </Typography>
              {  
                LogoPlanta(plantaLogo)                          
              }
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <Box sx={{ flexGrow: 1,display: "flex" ,backgroundColor:"rgba(0,0,0,0.3)",justifyContent: "center", display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {Routes.map((route) => (
                <Link key={route.key} href={route.route} target={route.target} underline="none">
                  <Button key={route.key} onClick={handleCloseNavMenu} sx={{ my: 0.5, color: 'white', display: 'block' }}>
                  <Typography
                    variant="p"
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      flexGrow: 1,
                      color: 'inherit',
                      textDecoration: 'none',
                      fontFamily: 'Poppins',
                      letterSpacing: '0.1rem',
                      fontSize: { md: '0.7rem' },
                        }}
                    >
                    {route.name}
                  </Typography>
                 
                  </Button>
                </Link>
              ))}
              </Box>
            </Grid>
          </Grid>

          {/* <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {Routes.map((route) => (
              <Link key={route.key} href={route.route} target={route.target} underline="none">
                <Button key={route.key} onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                <Typography
            variant="p"
            sx={{
               display: { xs: 'none', md: 'flex' },
              flexGrow: 1,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
          {route.name}
          </Typography>
                  
                </Button>
              </Link>
            ))}
            </Box> */}
          </Box>

        {/* </Toolbar>
      </Container> */}
      </AppBar>
    </ThemeProvider>
);
  
}

function LogoPlanta(plantaLogo)  
{
  if(plantaLogo!==null)
    return <img src= { plantaLogo } alt="logo" width="150" height = "60" style = {{paddingRight:  '0.5em', paddingTop:  '0.7em', paddingBottom:  '0.3em'}}/>
 
}

Navbar.defaultProps = {
  plantaLogo:null,
  Routes:  [{
    name: " ",
    key: " ",
    // icon: <TrendingUpIcon fontSize="small"/>,
    route: " ",
    target:" ",
    // component: <Efficiencyscrean />// <Efficiencyscrean />,
  }],
 
};


export default Navbar