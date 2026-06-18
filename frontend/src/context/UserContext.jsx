import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

const getStoredUsers = () => {
  return JSON.parse(localStorage.getItem("users")) || [];
};

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(getStoredUsers());

  // sync to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // ADD / UPDATE POINTS
  const assignPoints = (name, points, category, remarks) => {
    setUsers((prev) => {
      const updated = [...prev];

      const index = updated.findIndex((u) => u.name === name);

      const entry = {
        points,
        category,
        remarks,
        date: new Date(),
      };

      if (index === -1) {
        updated.push({
          name,
          points,
          history: [entry],
        });
      } else {
        updated[index].points += points;
        updated[index].history.push(entry);
      }

      return updated;
    });
  };

  return (
    <UserContext.Provider value={{ users, setUsers, assignPoints }}>
      {children}
    </UserContext.Provider>
  );
};