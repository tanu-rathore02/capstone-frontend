import React from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function Issuances() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/addIssuance");
  };
  return (
    <div>
      <Button name="Add Issuance" onClick={handleButtonClick} />
    </div>
  );
}

export default Issuances;
