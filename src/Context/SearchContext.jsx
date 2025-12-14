
import React, { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  
  const [searchTerm, setSearchTerm] = useState(""); 
  const [appliedSearch, setAppliedSearch] = useState("");

  const applySearch = () => setAppliedSearch(searchTerm);

  

  return (
    <SearchContext.Provider
      value={{ searchTerm, setSearchTerm, appliedSearch, setAppliedSearch ,applySearch}}>
      {children}
    </SearchContext.Provider>
  );
};


