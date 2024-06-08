import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import App from "../App";

jest.mock("../components/Header", () => {
  return function Header() {
    return <div>Property Management - Mock for Header </div>;
  };
});


jest.mock("../components/DisplayShops", () => {
  return function Header() {
    return <div>Property Management - Mock for DisplayShops</div>;
  };
});

describe("Testing App component", () => {
  test("renders header and index route", async () => {
    await act(async () => {
      render(<App />);
    });

    const mockedText1 = await waitFor(() =>
      screen.getByText("Property Management - Mock for Header")
    );
    expect(mockedText1).toBeInTheDocument();

    const mockedText2 = await waitFor(() =>
      screen.getByText("Property Management - Mock for DisplayShops")
    );
    expect(mockedText2).toBeInTheDocument();
  });
});
