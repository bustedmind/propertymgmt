import React, { useState, useEffect } from "react";
import axios from 'axios';

const DisplayShops = () => {
  const [shopList, setShopList] = useState([]);
  const [tenantName, setTenantName] = useState("");
  const [leaseAmount, setLeaseAmount] = useState("");

  const fetchData = async () => {
    let response = await axios.get("http://localhost:8000/property");
    setShopList(response.data.shops);
  }

  useEffect(() => {
    fetchData();
  }, []);



  const fetchWithFilter = async (e, type="") => {
    e.preventDefault();
    /* Code goes here to filter the data by sending the query param with the API Request "http://localhost:8000/property" */
    /* query params:
        leaseAmount -(values: "" , "asc" or  "desc")
        tenantName  -(values: "" or any string) */
        // "http://localhost:8000/property?leaseAmount=&tenantName=tenant two"
    let url = "http://localhost:8000/property?leaseAmount=" + type + "&tenantName=" + tenantName;
    let response = await axios.get(url);

    setShopList(response.data.shops);
  };

  const handleTenantName = (e) => {
    setTenantName(e.target.value);
  }
  const handleLeaseAmountSort = (e, type) => {
    setLeaseAmount(type);
    fetchWithFilter(e, type);
  }

  return (
    <div className="displayShop">
      <h3>Shop Details</h3>
      <table className="shop-table">
        <thead>
          <tr>
            <th>Shop Details</th>
            <th>
              Lease <br />
              Amount
              <button onClick={(e) => handleLeaseAmountSort(e, "asc")} data-testid="ascending">↑</button>{" "}
              {/*On ↑ click , call the function fetchWithFilter to fetch data in ascending order of leaseAmount*/}
              <button onClick={(e) => handleLeaseAmountSort(e,"desc")} data-testid="descending">↓</button>
              {/*On ↓ click , call the function fetchWithFilter to fetch data in descending order of leaseAmount*/}
            </th>
            <th>Status</th>
            <th>
              Tenant name
              <form onSubmit={fetchWithFilter} data-testid="searchForm">
                {/*On form submit , call the function fetchWithFilter to filter data that matches the given tenant name */}
                <input value={tenantName} onChange={handleTenantName} type="search" placeholder="Filter by name" data-testid="searchName" />
              </form>
            </th>
            <th>Tenant Mobile</th>
            <th>Start date</th>
            <th>End date</th>
          </tr>
        </thead>
        <tbody>
          {/* Display each shop details in individual table rows. Follow the template below */}
          {shopList && shopList.map(sh =>
            <tr data-testid="shop-row" key={sh._id}>
              <td>{`Shop: ${sh.shopNo}, Floor: ${sh.floorNo}`}</td>
              <td>{sh.leaseAmount}</td>
              <td>{sh.occupied ? "Occupied" : "Unoccupied"}</td>
              <td>{sh.tenantName === "" ? "-" : sh.tenantName}</td>
              <td>{sh.tenantMobile === null ? "-" : sh.tenantMobile}</td>
              <td>{sh.leaseStartDate === "" ? "-" : sh.leaseStartDate}</td>
              <td>{sh.leaseEndDate === "" ? "-" : sh.leaseEndDate}</td>
            </tr>
          )}
          {/*Template for rows*/}

          {/*End of template*/}
        </tbody>
        {/*Display this tfoot only if no records are displayed as result of filter*/}
        {!shopList.length && <tfoot>
          <tr>
            <td colSpan="7">No record found</td>
          </tr>
        </tfoot>}
      </table>
    </div>
  );
};

export default DisplayShops;
