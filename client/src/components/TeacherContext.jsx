import React, { createContext, useContext, useState } from "react";

const TeacherContext = createContext();

export const useTeacher = () => {
  return useContext(TeacherContext);
};

export const TeacherProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const login = () => {
    setLoggedIn(true);
  };

  const logout = () => {
    setLoggedIn(false);
  };

  return (
    <TeacherContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </TeacherContext.Provider>
  );
};
