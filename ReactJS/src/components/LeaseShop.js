import React, { useState, useEffect } from "react";
import axios from 'axios';

const LeaseShop = () => {
  const [shopList, setShopList] = useState([]);
  const [tenantName, setTenantName] = useState("");
  const [tenantMobile, setTenantMobile] = useState("");
  const [leaseDuration, setLeaseDuration] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [shopNo, setShopNo] = useState("");

  /* On mounting the component, unoccupied shop list should be fetched from the backend using GET API "http://localhost:8000/property?occupied=false" */
  const fetchData = async () => {
    let response = await axios.get("http://localhost:8000/property?occupied=false");
    setShopList(response.data.shops);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleLeaseSubmit = async (e) => {
    e.preventDefault();
    /* To allocate selected shop to given tenant, send a patch request with API "http://localhost:8000/property/<shop-id>"  
       where, "shop-id" is the _id of the shop that to be taken for lease.

     request body:{
        tenantName    (type string),
        tenantMobile  (type number),
        leaseDuration (type number),
      } 

      Display the message from backend in alert and reset the form on successful response.
      Display error message from backend in alert on error response.
      
 */   
      let data = {
        leaseDuration: Number(leaseDuration),
        tenantMobile: Number(tenantMobile),
        tenantName: tenantName,
      }
      try {
        let response = await axios.patch(`http://localhost:8000/property/${selectedProperty}`, data);
        alert(response.data.message);
        setLeaseDuration("");
        setTenantMobile("");
        setTenantName("");       
        setShowModel(false);
        fetchData();
      } catch (error) {
        alert(error.response.data.message);   
      }
      
  };
  const handleShowModel = (id, shopNo) => {
    setShowModel(!showModel);
    setSelectedProperty(id);
    setShopNo(shopNo);
  };
  const handleTenantName = (e) => {
    setTenantName(e.target.value);
  }
  const handleTenantMobile = (e) => {
    setTenantMobile(e.target.value);
  }
  const handleLeaseDuration = (e) => {
    setLeaseDuration(e.target.value);
  }

  return (
    <div className="leaseShop">
      {/* Display below paragraph if there are no unoccupied shops*/}
      {!shopList.length && <p>No shop available for lease</p>}

      {/* On availability of shops, display the shop details with below table template*/}
      <div>
        <div className=""> {/* If modal is open "blurred" should be added to classList*/}
          <h3>Shops available for lease</h3>
          <table className="shop-table" data-testid="shop-table">
            <thead>
              <tr>
                <th>Shop No</th>
                <th>Floor No</th>
                <th>Lease Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Display each shop details in individual table rows, follow the template below */}
              {shopList && shopList.map(sh => 
                <tr key={sh._id} className="shop-row" data-testid="shop-row">
                  <td>{sh.shopNo}</td>
                  <td>{sh.floorNo}</td>
                  <td>{sh.leaseAmount}</td>
                  <td>
                    {/* Onclicking "Take Lease" button, display the modal "Lease form" to get tenant details*/}
                    <button onClick={() =>handleShowModel(sh._id, sh.shopNo)} className="take-lease-button">Take Lease</button>
                  </td>
                </tr>
              )}

              {/* End of row */}
            </tbody>
          </table>
        </div>
        {/* Modal - Lease form*/}
        {showModel && <div className="lease-form">
          <h3>Tenant details for leasing shop- {shopNo}</h3>
          <span className="close-button" onClick={handleShowModel}>&times;</span>
          <hr />
          <form>
            <label>
              Tenant name:
              <input onChange={handleTenantName} type="text" data-testid="tenantName" />
            </label>
            <label>
              Tenant mobile:
              <input onChange={handleTenantMobile} type="number" data-testid="tenantMobile" placeholder="10 digits" />
            </label>
            <label>
              Lease duration:
              <select onChange={handleLeaseDuration} value={leaseDuration} type="number" data-testid="leaseDuration" max="5">
                <option value="" disabled>
                  select
                </option>
                <option value="1">1 year</option>
                <option value="2">2 year</option>
                <option value="3">3 year</option>
                <option value="4">4 year</option>
                <option value="5">5 year</option>
              </select>
            </label>
            {/* 
                On clicking the "Submit" button, call the "handleLeaseSubmit" function
                Submit button should be disabled if any of the input field is empty string or contains only spaces */}
            <button 
              disabled={tenantMobile.trim() === "" || tenantName.trim() === "" || leaseDuration.trim() === ""} 
              onClick={handleLeaseSubmit} 
              type="submit" 
              className="submit-button"
              >
              Submit
            </button>
          </form>
        </div>}

        {/* End of Modal - Lease form*/}
      </div>
    </div>
  );
};

export default LeaseShop;
