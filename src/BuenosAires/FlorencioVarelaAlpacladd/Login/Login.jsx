"use client"

import { useState } from "react"
import axios from "axios"
import { Grid, Paper, TextField, Button, CssBaseline, Typography, Box, Snackbar, InputAdornment } from "@mui/material"
import MuiAlert from "@mui/material/Alert"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../../AuthContext"
import PersonIcon from "@mui/icons-material/Person"
import LockIcon from "@mui/icons-material/Lock"

// Import your images
import fondo from "./home1.png"
import logoalpa from "./img/PNG-NEGRO.png"

const LoginLabFV = () => {
  const { login } = useAuth()
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"
  const [body, setBody] = useState({ legajo: "", password: "" })

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  const inputChange = ({ target }) => {
    const { name, value } = target
    setBody({
      ...body,
      [name]: value,
    })
  }

  const onSubmit = async () => {
    try {
      const { data } = await axios.post("http://192.168.40.95:4300/auth/login", body)
      const token = data.tokenSession
      const rol = data.data.role
      const usuario = data.data.usuario
      const contrasenia = data.data.contrasenia

      login({ usuario, contrasenia, rol, token })
      navigate(from, { replace: true })
    } catch (error) {
      console.log('ERROR', error);
      
      if (!error.response) {
        setSnackbarMessage("Error de conexión con el servidor")
      } else if (error.response?.status === 401) {
        setSnackbarMessage("Usuario inautorizado")
      } else {
        setSnackbarMessage("Fallo en el login")
      }
      setOpenSnackbar(true)
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSubmit()
    }
  }

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${fondo})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) => (t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900]),
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4, mt: 10 }}>
            <img src={logoalpa || "/placeholder.svg"} alt="Logo ALPA" style={{ height: 250, marginRight: 16 }} />
          </Box>
          <Box component="form" noValidate sx={{ mt: 1, width: "55%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="legajo"
              label="Usuario"
              name="legajo"
              autoComplete="username"
              autoFocus
              value={body.legajo}
              onChange={inputChange}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#132752" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#132752",
                    borderRadius: "28px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#132752",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#132752",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#132752",
                },
                mb: 2,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={body.password}
              onChange={inputChange}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#132752" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#132752",
                    borderRadius: "28px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#132752",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#132752",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#132752",
                },
                mb: 2,
              }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#132752",
                borderRadius: "28px",
                padding: "12px",
                fontSize: "16px",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0 4px 6px rgba(19, 39, 82, 0.2)",
                "&:hover": {
                  backgroundColor: "#0e1d3b",
                  boxShadow: "0 6px 8px rgba(19, 39, 82, 0.3)",
                },
              }}
              onClick={onSubmit}
            >
              Ingresar
            </Button>
          </Box>
        </Box>
      </Grid>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={handleCloseSnackbar}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      {/* Footer */}
      <Box
        display={"flex"}
        flexDirection={"column"}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "4px 8px",
          borderRadius: "4px",
        }}
      >
        <Typography variant="caption" color="white">
          © Automatización - La Rioja
        </Typography>
        <Typography variant="caption" color="white">
          IT - Depto. Aplicaciones
        </Typography>
      </Box>
    </Grid>
  )
}

export default LoginLabFV




