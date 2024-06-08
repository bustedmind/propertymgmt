import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import { act } from "react-dom/test-utils";
import LeaseShop from "../components/LeaseShop";

jest.mock("axios");
const mockShopList = {
  type: "Ok",
  shops: [
    {
      _id: "abcde3",
      shopNo: "1C",
      floorNo: 1,
      leaseAmount: 200000,
      occupied: false,
      tenantName: "",
      tenantMobile: null,
      leaseStartDate: "",
      leaseEndDate: "",
    },
    {
      _id: "abcde4",
      shopNo: "12A",
      floorNo: 12,
      leaseAmount: 600000,
      occupied: false,
      tenantName: "",
      tenantMobile: null,
      leaseStartDate: "",
      leaseEndDate: "",
    },
  ],
};

const mockShopList2 = {
  type: "Ok",
  shops: [
    {
      _id: "abcde5",
      shopNo: "5G",
      floorNo: 5,
      leaseAmount: 400000,
      occupied: false,
      tenantName: "",
      tenantMobile: null,
      leaseStartDate: "",
      leaseEndDate: "",
    }
  ],
};
describe("ShopLease Module", () => {
  test("Fetch and displays unoccupied shop list", async () => {
    axios.get.mockResolvedValue({ data: mockShopList });
    jest.spyOn(window, "alert").mockImplementation();
    await act(async () => {
      render(<LeaseShop />);
    });
    await waitFor(() => expect(screen.getAllByTestId("shop-row")).toHaveLength(2));
    expect(axios.get).toBeCalledWith("http://localhost:8000/property?occupied=false");
    const rows = screen.getAllByTestId("shop-row");
    expect(rows).toHaveLength(2);
    const tableContent = [
      ["1C", "1", "200000"],
      ["12A", "12", "600000"],
    ];
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const cells = rows[rowIndex].getElementsByTagName("td");
      expect(cells).toHaveLength(4);

      for (let cellIndex = 0; cellIndex < cells.length - 1; cellIndex++) {
        expect(cells[cellIndex]).toHaveTextContent(tableContent[rowIndex][cellIndex]);
      }
    }
  });

  test("Displays not available on unavailability of shops", async () => {
    axios.get.mockResolvedValue({ data: { type: "Ok", shops: [] } });
    jest.spyOn(window, "alert").mockImplementation();
    await act(async () => {
      render(<LeaseShop />);
    });
    expect(axios.get).toBeCalledWith("http://localhost:8000/property?occupied=false");
    const non_availability_message = screen.getByText("No shop available for lease");
    expect(non_availability_message).toBeInTheDocument();
  });

  test("Providing tenant details and taking lease", async () => {
    axios.get.mockResolvedValue({ data: mockShopList });
    jest.spyOn(window, "alert").mockImplementation(() => {});
    await act(async () => {
      render(<LeaseShop />);
    });
    await waitFor(() => expect(screen.getAllByTestId("shop-row")).toHaveLength(2));
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    await act(async () => {
      fireEvent.click(screen.getAllByText("Take Lease")[0]);
    });

    const heading = await screen.findByText("Tenant details for leasing shop- 1C");
    expect(heading).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(screen.getByTestId("tenantName"), {
        target: { value: "    " },
      });
      fireEvent.change(screen.getByTestId("tenantMobile"), {
        target: { value: "1234567890" },
      });
      fireEvent.change(screen.getByTestId("leaseDuration"), {
        target: { value: "3" },
      });
      expect(screen.getByText("Submit")).toBeDisabled();

      fireEvent.change(screen.getByTestId("tenantName"), {
        target: { value: "tenant one" },
      });
      expect(screen.getByText("Submit")).toBeEnabled();

      axios.patch.mockImplementation(() =>
        Promise.resolve({ data: { message: "Lease successfully approved" } })
      );
      fireEvent.click(screen.getByText("Submit"));
    });
    await waitFor(() => expect(axios.patch).toHaveBeenCalledTimes(1));
    expect(axios.patch).toBeCalledWith("http://localhost:8000/property/abcde3", {
      leaseDuration: 3,
      tenantMobile: 1234567890,
      tenantName: "tenant one",
    });
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
  });

  test("Mocking with different input values", async () => {
    axios.get.mockResolvedValue({ data: mockShopList2 });
    jest.spyOn(window, "alert").mockImplementation(() => {});
    await act(async () => {
      render(<LeaseShop />);
    });

    await waitFor(() => expect(screen.getAllByTestId("shop-row")).toHaveLength(1));
    expect(axios.get).toBeCalledWith("http://localhost:8000/property?occupied=false");
    const rows = screen.getAllByTestId("shop-row");
    expect(rows).toHaveLength(1);
    const tableContent = [
      ["5G", "5", "400000"]
    ];
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const cells = rows[rowIndex].getElementsByTagName("td");
      expect(cells).toHaveLength(4);

      for (let cellIndex = 0; cellIndex < cells.length - 1; cellIndex++) {
        expect(cells[cellIndex]).toHaveTextContent(tableContent[rowIndex][cellIndex]);
      }
    }

    await act(async () => {
      fireEvent.click(screen.getAllByText("Take Lease")[0]);
    });

    const heading = await screen.findByText("Tenant details for leasing shop- 5G");
    expect(heading).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(screen.getByTestId("tenantName"), {
        target: { value: "tenant two" },
      });
      fireEvent.change(screen.getByTestId("tenantMobile"), {
        target: { value: "1234512345" },
      });
      fireEvent.change(screen.getByTestId("leaseDuration"), {
        target: { value: "2" },
      });

      axios.patch.mockImplementation(() =>
        Promise.resolve({ data: { message: "Lease successfully approved" } })
      );
      fireEvent.click(screen.getByText("Submit"));
    });
    await waitFor(() => expect(axios.patch).toHaveBeenCalledTimes(1));
    expect(axios.patch).toBeCalledWith("http://localhost:8000/property/abcde5", {
      leaseDuration: 2,
      tenantMobile: 1234512345,
      tenantName: "tenant two",
    });
    expect(global.alert).toHaveBeenCalledWith("Lease successfully approved");
  });


  test("Clearing form values on form submmit", async () => {
    axios.get.mockResolvedValue({ data: mockShopList });
    jest.spyOn(window, "alert").mockImplementation(() => {});
    await act(async () => {
      render(<LeaseShop />);
    });
    await waitFor(() => expect(screen.getAllByTestId("shop-row")).toHaveLength(2));
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    await act(async () => {
      fireEvent.click(screen.getAllByText("Take Lease")[0]);
    });

    await act(async () => {
      fireEvent.change(screen.getByTestId("tenantName"), {
        target: { value: "tenant five" },
      });
      fireEvent.change(screen.getByTestId("tenantMobile"), {
        target: { value: "1234567660" },
      });
      fireEvent.change(screen.getByTestId("leaseDuration"), {
        target: { value: "4" },
      });
      
      expect(screen.getByText("Submit")).toBeEnabled();

      axios.patch.mockImplementation(() =>
        Promise.resolve({ data: { message: "Lease successfully approved" } })
      );
      fireEvent.click(screen.getByText("Submit"));
    });
    
    await act(async () => {
      fireEvent.click(screen.getAllByText("Take Lease")[0]);
    });
    const tenantNameField=screen.getByTestId("tenantName");
    const tenantMobileField=screen.getByTestId("tenantMobile");
    const leaseDurationField=screen.getByTestId("leaseDuration");
    expect(tenantNameField.value).toBe("")
    expect(tenantMobileField.value).toBe("")
    expect(leaseDurationField.value).toBe("")
  });
});

