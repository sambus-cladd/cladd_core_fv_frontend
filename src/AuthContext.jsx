// AuthContext.js
import React, { createContext, useState, useContext } from "react";

// Crear el contexto de autenticación unificado
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado para manejar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Estado para manejar la información de autenticación del usuario (incluidos los roles)
  const [auth, setAuth] = useState(null);

  // Función para iniciar sesión (aquí podrías también establecer `auth` con datos del usuario)
  const login = (userData) => {
    setIsAuthenticated(true);
    setAuth(userData); // userData debería contener los roles y cualquier otra información relevante
  };

  // Función para cerrar sesión
  const logout = () => {
    setIsAuthenticated(false);
    setAuth(null); // Limpia la información de autenticación
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};
