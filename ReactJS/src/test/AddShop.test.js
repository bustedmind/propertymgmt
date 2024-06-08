import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import { act } from "react-dom/test-utils";
import AddShop from "../components/AddShop";

jest.mock("axios");

describe("AddShop Form", () => {
  test("Submits form with POST request", async () => {
    axios.post.mockImplementation(() => Promise.resolve({ data: { message: "Created the shop successfully" } }));
    jest.spyOn(window, "alert").mockImplementation(() => {});
    render(<AddShop />);

    fireEvent.change(screen.getByTestId("shopNumber"), {
      target: { value: "1D" },
    });
    fireEvent.change(screen.getByTestId("leaseAmount"), {
      target: { value: "300000" },
    });
    await act(async () => {
      fireEvent.click(screen.getByText("Submit"));
    });

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toBeCalledWith("http://localhost:8000/property", {
      leaseAmount: 300000,
      shopNo: "1D",
    });
    expect(global.alert).toHaveBeenCalledWith("Created the shop successfully");
  });

  test("Displays error on submitting duplicate shop number", async () => {
    axios.post.mockImplementation(() => Promise.reject({ response: { data: { error: "Duplicate shop number 1A" } } }));
    jest.spyOn(window, "alert").mockImplementation(() => {});
    render(<AddShop />);

    fireEvent.change(screen.getByTestId("shopNumber"), {
      target: { value: "1A" },
    });
    fireEvent.change(screen.getByTestId("leaseAmount"), {
      target: { value: "300000" },
    });
    await act(async () => {
      fireEvent.click(screen.getByText("Submit"));
    });

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toBeCalledWith("http://localhost:8000/property", {
      leaseAmount: 300000,
      shopNo: "1A",
    });
    expect(global.alert).toHaveBeenCalledWith("Duplicate shop number 1A");
  });

  test("Disables submit button before entering form values", async () => {
    render(<AddShop />);
    expect(screen.getByText("Submit")).toBeDisabled();
    fireEvent.change(screen.getByTestId("shopNumber"), {
      target: { value: "1D" },
    });
    fireEvent.change(screen.getByTestId("leaseAmount"), {
      target: { value: "300000" },
    });
    expect(screen.getByText("Submit")).toBeEnabled();
  });

  test("Testing with different input values", async () => {
    axios.post.mockImplementation(() => Promise.resolve({ data: { message: "Created the shop successfully" } }));
    jest.spyOn(window, "alert").mockImplementation(() => {});
    render(<AddShop />);

    fireEvent.change(screen.getByTestId("shopNumber"), {
      target: { value: "5A" },
    });
    fireEvent.change(screen.getByTestId("leaseAmount"), {
      target: { value: "600000" },
    });
    await act(async () => {
      fireEvent.click(screen.getByText("Submit"));
    });

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toBeCalledWith("http://localhost:8000/property", {
      leaseAmount: 600000,
      shopNo: "5A",
    });
    expect(global.alert).toHaveBeenCalledWith("Created the shop successfully");
  });
});
