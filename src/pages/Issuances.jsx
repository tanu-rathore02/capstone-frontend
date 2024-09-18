import React, { useState } from "react";
import "../styles/Pages.css";
import IssuancesTable from "../components/IssuancesTable";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Loader from "../components/Loader";
import HocWrapper from "../components/HocWrapper";
import Searchbar from "../components/Searchbar";

function Issuances({ setLoading }) {
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="pages-container">
      <div className="controls-container">
        <Searchbar onSearch={handleSearch} />
      </div>
      <IssuancesTable
        showPagination={true}
        refresh={refresh}
        searchTerm={searchTerm}
        setLoading={setLoading}
      />
    </div>
  );
}

export default HocWrapper(Navbar, Header, Loader)(Issuances);
