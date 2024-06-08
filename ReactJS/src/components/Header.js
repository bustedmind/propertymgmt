import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">Property Management</h1>
      {/*Heading h1 containing the text "Property Management" . className-"header-title" */}
      <nav className="nav">
        <Link to="/" className="nav-link">Shop List</Link>
        <Link to="/add" className="nav-link">Add Shop</Link>
        <Link to="/lease" className="nav-link">Lease Shop</Link>
        {/* use "Link" to swtich between DisplayShops, AddShop and LeaseShop components */}

        {/* Please refer the Route path and text for "Link"
        path - "/"      text - "Shop List"
        path - "/add"   text - "Add Shop"
        path - "/lease" text - "Lease Shop"  */}
      </nav>
    </header>
  );
};

export default Header;
