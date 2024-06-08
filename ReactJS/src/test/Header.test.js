import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../components/Header";

describe("Header", () => {
  test("Renders the header title", () => {
    render(<Header />, { wrapper: MemoryRouter });
    const headerTitle = screen.getByText("Property Management");
    expect(headerTitle).toBeInTheDocument();

    const homeLink = screen.getByText("Shop List");
    const addShopLink = screen.getByText("Add Shop");
    const leasePageLink = screen.getByText("Lease Shop");
    expect(homeLink).toBeInTheDocument();
    expect(addShopLink).toBeInTheDocument();
    expect(leasePageLink).toBeInTheDocument();

    expect(homeLink).toHaveAttribute("href", "/");
    expect(addShopLink).toHaveAttribute("href", "/add");
    expect(leasePageLink).toHaveAttribute("href", "/lease");
  });
});
