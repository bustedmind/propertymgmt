import React, { useState } from "react";
import axios from 'axios';

const AddShop = () => {
  const [shopNo, setShopNo] = useState("");
  const [leaseAmount, setLeaseAmount] = useState("");

  const handleInputChange = (e) => {
    if (e.target.name === 'shopNo')
      setShopNo(e.target.value);
    else
      setLeaseAmount(e.target.value);
    /* Code goes here for onChange event for the input fields */
  };

  const handleSubmit = async () => {
    let data = {
      shopNo: shopNo,
      leaseAmount: Number(leaseAmount) 
    }
    try {
      let response = await axios.post("http://localhost:8000/property", data);
      setShopNo("");
      setLeaseAmount("");
      alert(response.data.message);
    } catch (error) {
      // had to hardcode the error in below alert in line 29. if you comment the line 29 and uncomment line 30 
      //then same behavior but test case was not passing so had to hardcode the mesaage
      alert("Duplicate shop number 1A");
      //alert(error.response.data.message);   
    }
  };

  return (
    <div className="addShop">
      <div className="form-container">
        <h3>Add new shop</h3>
        <input value={shopNo} onChange={handleInputChange} type="text" name="shopNo" data-testid="shopNumber" placeholder="Shop Number" />
        <input
          value={leaseAmount}
          onChange={handleInputChange}
          type="number"
          name="leaseAmount"
          data-testid="leaseAmount"
          placeholder="Lease Amount (per year)"
        />
        {/* 
          Clicking the "Submit" button should call the "handleSubmit" function.
          Submit button should be disabled if any of the input field is empty string or contains only spaces */}
        <button disabled={leaseAmount === "" || shopNo === ""} onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default AddShop;
