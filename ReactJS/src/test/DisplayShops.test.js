import React, { useRef } from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import { act } from "react-dom/test-utils";
import DisplayShops from "../components/DisplayShops";

jest.mock("axios");
const mockShopList = {
  type: "Ok",
  shops: [
    {
      _id: "abcde1",
      shopNo: "1A",
      floorNo: 1,
      leaseAmount: 200000,
      occupied: true,
      tenantName: "tenant one",
      tenantMobile: 1111111111,
      leaseStartDate: "27-09-2023",
      leaseEndDate: "27-09-2024",
    },
    {
      _id: "abcde2",
      shopNo: "1B",
      floorNo: 1,
      leaseAmount: 400000,
      occupied: true,
      tenantName: "tenant two",
      tenantMobile: 2222222222,
      leaseStartDate: "27-09-2023",
      leaseEndDate: "27-09-2025",
    },
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
      shopNo: "2A",
      floorNo: 2,
      leaseAmount: 300000,
      occupied: true,
      tenantName: "tenant three",
      tenantMobile: 3333333333,
      leaseStartDate: "01-10-2023",
      leaseEndDate: "01-10-2025",
    },
    {
      _id: "abcde6",
      shopNo: "2B",
      floorNo: 2,
      leaseAmount: 500000,
      occupied: false,
      tenantName: "",
      tenantMobile: null,
      leaseStartDate: "",
      leaseEndDate: "",
    },
    {
      _id: "abcde7",
      shopNo: "13A",
      floorNo: 13,
      leaseAmount: 700000,
      occupied: false,
      tenantName: "",
      tenantMobile: null,
      leaseStartDate: "",
      leaseEndDate: "",
    },
  ],
};

describe("Shop List Module", () => {
  test("Fetches shop List with GET api", async () => {
    axios.get.mockResolvedValue({ data: mockShopList });
    jest.spyOn(window, "alert").mockImplementation();

    await act(async () => {
      render(<DisplayShops />);
    });
    await waitFor(() => expect(screen.getAllByTestId("shop-row")).toHaveLength(4));
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(axios.get).toBeCalledWith("http://localhost:8000/property");
  });

  test("Displays shop List", async () => {
    axios.get.mockResolvedValue({ data: mockShopList });
    jest.spyOn(window, "alert").mockImplementation();

    await act(async () => {
      render(<DisplayShops />);
    });
    await waitFor(() => expect(screen.getAllByTestId("shop-row")).toHaveLength(4));

    const rows = screen.getAllByTestId("shop-row");
    const tableContent = [
      [
        "Shop: 1A, Floor: 1",
        "200000",
        "Occupied",
        "tenant one",
        "1111111111",
        "27-09-2023",
        "27-09-2024",
      ],
      [
        "Shop: 1B, Floor: 1",
        "400000",
        "Occupied",
        "tenant two",
        "2222222222",
        "27-09-2023",
        "27-09-2025",
      ],
      ["Shop: 1C, Floor: 1", "200000", "Unoccupied", "-", "-", "-", "-"],
      ["Shop: 12A, Floor: 12", "600000", "Unoccupied", "-", "-", "-", "-"],
    ];
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const cells = rows[rowIndex].getElementsByTagName("td");
      expect(cells).toHaveLength(7);

      for (let cellIndex = 0; cellIndex < cells.length - 1; cellIndex++) {
        expect(cells[cellIndex]).toHaveTextContent(tableContent[rowIndex][cellIndex]);
      }
    }
  });

  test("Displays shop List - Mocking response with different values", async () => {
    axios.get.mockResolvedValue({ data: mockShopList2 });
    jest.spyOn(window, "alert").mockImplementation();

    await act(async () => {
      render(<DisplayShops />);
    });
    await waitFor(() => expect(screen.getAllByTestId("shop-row")).toHaveLength(3));

    const rows = screen.getAllByTestId("shop-row");
    const tableContent = [
      [
        "Shop: 2A, Floor: 2",
        "300000",
        "Occupied",
        "tenant three",
        "3333333333",
        "01-10-2023",
        "01-10-2025",
      ],
      ["Shop: 2B, Floor: 2", "500000", "Unoccupied", "-", "-", "-", "-"],
      ["Shop: 13A, Floor: 13", "700000", "Unoccupied", "-", "-", "-", "-"],
    ];
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const cells = rows[rowIndex].getElementsByTagName("td");
      expect(cells).toHaveLength(7);

      for (let cellIndex = 0; cellIndex < cells.length - 1; cellIndex++) {
        expect(cells[cellIndex]).toHaveTextContent(tableContent[rowIndex][cellIndex]);
      }
    }
  });

  test("Filter with name", async () => {
    axios.get.mockResolvedValue({ data: mockShopList });
    jest.spyOn(window, "alert").mockImplementation();

    await act(async () => {
      render(<DisplayShops />);
    });
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    await act(async () => {
      fireEvent.change(screen.getByTestId("searchName"), {
        target: { value: "tenant two" },
      });
      fireEvent.submit(screen.getByTestId("searchForm"));
    });

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
    expect(axios.get).toBeCalledWith(
      "http://localhost:8000/property?leaseAmount=&tenantName=tenant two"
    );
  });

  test("Sort Ascending with respect to Lease Amount", async () => {
    axios.get.mockResolvedValue({ data: mockShopList });
    jest.spyOn(window, "alert").mockImplementation();
    await act(async () => {
      render(<DisplayShops />);
    });
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    await act(async () => {
      fireEvent.click(screen.getByTestId("ascending"));
    });

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
    expect(axios.get).toBeCalledWith("http://localhost:8000/property?leaseAmount=asc&tenantName=");
  });

  test("Sort Descending with respect to Lease Amount", async () => {
    axios.get.mockResolvedValue({ data: mockShopList });
    jest.spyOn(window, "alert").mockImplementation();
    await act(async () => {
      render(<DisplayShops />);
    });
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    await act(async () => {
      fireEvent.click(screen.getByTestId("descending"));
    });

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
    expect(axios.get).toBeCalledWith("http://localhost:8000/property?leaseAmount=desc&tenantName=");
  });

  test("Search and Sort in parallel", async () => {
    axios.get.mockResolvedValue({ data: mockShopList });
    jest.spyOn(window, "alert").mockImplementation();
    await act(async () => {
      render(<DisplayShops />);
    });
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    await act(async () => {
      fireEvent.change(screen.getByTestId("searchName"), {
        target: { value: "tenant one" },
      });
      fireEvent.submit(screen.getByTestId("searchForm"));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("descending"));
    });

    expect(axios.get).toBeCalledWith(
      "http://localhost:8000/property?leaseAmount=desc&tenantName=tenant one"
    );
  });

  test("Displays no record found when filter does not match the records or no data exist", async () => {
    axios.get.mockResolvedValue({ data: { type: "Ok", shops: [] } });
    jest.spyOn(window, "alert").mockImplementation();
    await act(async () => {
      render(<DisplayShops />);
    });

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(axios.get).toBeCalledWith("http://localhost:8000/property");
    const not_found_message = screen.getByText("No record found");
    expect(not_found_message).toBeInTheDocument();
  });
});
