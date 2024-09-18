import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CategoryTable from "../pages/categories/CategoryTable";
import { getRequest, deleteRequest, putRequest } from "../api/ApiManager"
import { act } from "react";



jest.mock("../api/ApiManager", () => ({
  getRequest: jest.fn(),
  deleteRequest: jest.fn(),
  putRequest: jest.fn(),
}));

const mockData = {
  data: {
    content: [
      { id: 1, categoryName: "Category 1" },
      { id: 2, categoryName: "Category 2" },
    ],
    totalPages: 2,
  },
  status: 200,
};

describe("CategoryTable Component", () => {
  beforeEach(() => {
    getRequest.mockImplementation((url, callback) => callback(mockData));
  });

  test("should render table with data", async () => {
    render(<CategoryTable showPagination={true} setLoading={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("Category 1")).toBeInTheDocument();
    });
  });

  test("should handle pagination next and previous buttons", async () => {
    render(<CategoryTable showPagination={true} setLoading={jest.fn()} />);

  
    await waitFor(() => {
      const prevButton = screen.getByText("Previous");
      expect(prevButton).toBeDisabled();
    });


    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

  
    await waitFor(() => {
      const prevButton = screen.getByText("Previous");
      expect(prevButton).not.toBeDisabled();
    });


    await waitFor(() => {
      const nextButton = screen.getByText("Next");
      expect(nextButton).toBeDisabled();
    });
  });

  test("should open and close edit modal", async () => {
    render(<CategoryTable showPagination={false} setLoading={jest.fn()} />);

    const editButton = screen.getAllByAltText("edit")[0];
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText("Edit Category")).toBeInTheDocument();
    });


    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(screen.queryByText("Edit Category")).not.toBeInTheDocument();
  });

  test("should open confirm delete modal and handle delete", async () => {
    render(<CategoryTable showPagination={true} setLoading={jest.fn()} />);


    const deleteButton = screen.getAllByAltText("delete")[0];
    fireEvent.click(deleteButton);


    await waitFor(() => {
      expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    });


    const confirmDeleteButton = screen.getByText("Delete");
    fireEvent.click(confirmDeleteButton);


    await waitFor(() => {
      expect(deleteRequest).toHaveBeenCalledWith(
        expect.stringContaining("categories/deleteCategory/1"),
        expect.any(Function)
      );
    });
  });

  test("should update category name when submitted", async () => {
    render(<CategoryTable showPagination={true} setLoading={jest.fn()} />);

    const editButton = screen.getAllByAltText("edit")[0];
    fireEvent.click(editButton);


    await waitFor(() => {
      expect(screen.getByText("Edit Category")).toBeInTheDocument();
    });


    const input = screen.getByLabelText("Category Name");
    fireEvent.change(input, { target: { value: "Updated Category Name" } });


    const updateButton = screen.getByText("Update");
    fireEvent.click(updateButton);


    await waitFor(() => {
      expect(putRequest).toHaveBeenCalledWith(
        "categories/updateCategory/1",
        { categoryName: "Updated Category Name" },
        expect.any(Function)
      );
    });
  });

  test("should display message when no categories are available", async () => {
    getRequest.mockImplementation((url, callback) =>
      callback({ data: { content: [], totalPages: 1 }, status: 200 })
    );

    render(<CategoryTable showPagination={true} setLoading={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("No data available")).toBeInTheDocument(); 
    });
  });

  test("should handle pagination when there are multiple pages", async () => {
    const mockPaginationData = {
      data: {
        content: [
          { id: 1, categoryName: "Category 1" },
          { id: 2, categoryName: "Category 2" },
          { id: 3, categoryName: "Category 3" },
          { id: 4, categoryName: "Category 4" },
        ],
        totalPages: 3,
      },
      status: 200,
    };

    getRequest.mockImplementation((url, callback) =>
      callback(mockPaginationData)
    );

    render(<CategoryTable showPagination={true} setLoading={jest.fn()} />);


    await waitFor(() => {
      expect(screen.getByText("Category 1")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    });
 
    fireEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Category 2")).toBeInTheDocument();
    });


    fireEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByText("Category 3")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Page 3 of 3")).toBeInTheDocument();
    });

 
    expect(screen.getByText("Next")).toBeDisabled();
  });

  test("should show validation error in edit modal when input is invalid", async () => {
    render(<CategoryTable showPagination={false} setLoading={jest.fn()} />);

    const editButton = screen.getAllByAltText("edit")[0];
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText("Edit Category")).toBeInTheDocument();
    });


    const input = screen.getByLabelText("Category Name");
    fireEvent.change(input, { target: { value: "" } }); 
    const updateButton = screen.getByText("Update");
    fireEvent.click(updateButton);

    await waitFor(() => {

      const errorMessage = screen.getByText((content, element) => {
        return content.includes("Category name cannot be empty");
      });
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("should close edit modal without saving changes", async () => {
    render(<CategoryTable showPagination={false} setLoading={jest.fn()} />);

    const editButton = screen.getAllByAltText("edit")[0];
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText("Edit Category")).toBeInTheDocument();
    });


    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Edit Category")).not.toBeInTheDocument();
    });
  });

  test("should display loading spinner while fetching data", async () => {
    const setLoading = jest.fn();
    render(<CategoryTable showPagination={true} setLoading={setLoading} />);

    expect(setLoading).toHaveBeenCalledWith(true); 

    await waitFor(() => {
      expect(setLoading).toHaveBeenCalledWith(false); 
    });
  });

  // eslint-disable-next-line jest/no-identical-title
  test("should display message when no categories are available", async () => {
    getRequest.mockImplementation((url, callback) =>
      callback({ data: { content: [], totalPages: 1 }, status: 200 })
    );

    render(<CategoryTable showPagination={true} setLoading={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("No data available")).toBeInTheDocument(); 
    });
  });

  test("should not call delete API when canceling delete modal", async () => {
    render(<CategoryTable showPagination={true} setLoading={jest.fn()} />);

    const deleteButton = screen.getAllByAltText("delete")[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    });


    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(deleteRequest).not.toHaveBeenCalled(); 
  });

  test("should handle edge case when navigating from last page back to first page", async () => {
    render(<CategoryTable showPagination={true} setLoading={jest.fn()} />);

    fireEvent.click(screen.getByText("Next"));
    await waitFor(() => {
      expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Previous"));
    await waitFor(() => {
      expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    });
  });

  test("should have initial state with no selected category", () => {
    render(<CategoryTable showPagination={true} setLoading={jest.fn()} />);
    expect(screen.queryByText("Edit Category")).not.toBeInTheDocument();
  });

  test("should display and hide loading spinner correctly", async () => {
    const setLoading = jest.fn();
    render(<CategoryTable showPagination={true} setLoading={setLoading} />);

    expect(setLoading).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(setLoading).toHaveBeenCalledWith(false);
    });
  });

  test("should display validation error when form input is invalid", async () => {
    render(<CategoryTable showPagination={false} setLoading={jest.fn()} />);


    const editButton = screen.getAllByAltText("edit")[0];
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText("Edit Category")).toBeInTheDocument();
    });


    const input = screen.getByLabelText("Category Name");
    fireEvent.change(input, { target: { value: "" } });

    const updateButton = screen.getByText("Update");
    fireEvent.click(updateButton);

 
    await waitFor(() => {
      const errorMessage = screen.getByText((content, element) => {
        return content.includes("Category name cannot be empty");
      });
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test("should handle pagination with only one page", async () => {
    const singlePageData = {
      data: {
        content: [{ id: 1, categoryName: "Only Category" }],
        totalPages: 1,
      },
      status: 200,
    };

    getRequest.mockImplementation((url, callback) => callback(singlePageData));

    render(<CategoryTable showPagination={true} setLoading={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("Only Category")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    });
  });

  test("should display loading spinner and then no data message when no categories are available", async () => {
    const setLoading = jest.fn();
    getRequest.mockImplementation((url, callback) =>
      callback({ data: { content: [], totalPages: 1 }, status: 200 })
    );

    render(<CategoryTable showPagination={true} setLoading={setLoading} />);

    expect(setLoading).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(setLoading).toHaveBeenCalledWith(false);
    });

    await waitFor(() => {
      expect(screen.getByText("No data available")).toBeInTheDocument();
    });
  });

  // eslint-disable-next-line jest/no-identical-title
  test("should not call delete API when canceling delete modal", async () => {
    render(<CategoryTable showPagination={true} setLoading={jest.fn()} />);

    const deleteButton = screen.getAllByAltText("delete")[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(deleteRequest).not.toHaveBeenCalled();
  });

  test("should handle closing the edit modal without saving changes", async () => {
    render(<CategoryTable showPagination={false} setLoading={jest.fn()} />);

    const editButton = screen.getAllByAltText("edit")[0];
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText("Edit Category")).toBeInTheDocument();
    });

  
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Edit Category")).not.toBeInTheDocument();
    });
  });

  test("should handle API failure during category update", async () => {
    render(<CategoryTable showPagination={false} setLoading={jest.fn()} />);

    const editButton = screen.getAllByAltText("edit")[0];
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText("Edit Category")).toBeInTheDocument();
    });


    const input = screen.getByLabelText("Category Name");
    fireEvent.change(input, { target: { value: "Updated Category Name" } });


    putRequest.mockImplementation((url, data, callback) =>
      callback({ status: 500 })
    );


    const updateButton = screen.getByText("Update");
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText("Error updating category!")).toBeInTheDocument();
    });
  });

  test("should handle pagination with no pages", async () => {
    const noPageData = {
      data: {
        content: [],
        totalPages: 0,
      },
      status: 200,
    };

    getRequest.mockImplementation((url, callback) => callback(noPageData));

    render(<CategoryTable showPagination={true} setLoading={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("No data available")).toBeInTheDocument();
    });
  });

  test("should not update state if component unmounts during API call", async () => {
    const { unmount } = render(<CategoryTable showPagination={true} setLoading={jest.fn()} />);

    getRequest.mockImplementation((url, callback) => {
      setTimeout(() => {
        callback(mockData);
      }, 1000); 
    });

    unmount(); 

    await waitFor(() => {
      expect(getRequest).toHaveBeenCalled();
    });
  });

  test("should handle search functionality", async () => {
    const searchTerm = "Test Category";
    render(<CategoryTable showPagination={true} setLoading={jest.fn()} searchTerm={searchTerm} />);
  
    await waitFor(() => {
      expect(getRequest).toHaveBeenCalledWith(
        expect.stringContaining(`search=${searchTerm}`),
        expect.any(Function)
      );
    });
  });
  

  test("should handle refresh prop", async () => {
    const { rerender } = render(<CategoryTable showPagination={true} setLoading={jest.fn()} refresh={false} />);
  
    await waitFor(() => {
      expect(getRequest).toHaveBeenCalledTimes(1);
    });
  
    rerender(<CategoryTable showPagination={true} setLoading={jest.fn()} refresh={true} />);
  
    await waitFor(() => {
      expect(getRequest).toHaveBeenCalledTimes(2);
    });
  });

  test("should handle API error when fetching categories", async () => {
    getRequest.mockImplementation((url, callback) => callback({ status: 500 }));
  
    const setLoading = jest.fn();
    render(<CategoryTable showPagination={true} setLoading={setLoading} />);
  
    await waitFor(() => {
      expect(setLoading).toHaveBeenCalledWith(false);
   
    });
    await waitFor(() => {
      expect(screen.getByText("No data available")).toBeInTheDocument();
    });
  });

  test("should handle category name with special characters", async () => {
    render(<CategoryTable showPagination={false} setLoading={jest.fn()} />);
  
    const editButton = screen.getAllByAltText("edit")[0];
    fireEvent.click(editButton);
  
    await waitFor(() => {
      expect(screen.getByText("Edit Category")).toBeInTheDocument();
    });
  
    const input = screen.getByLabelText("Category Name");
    fireEvent.change(input, { target: { value: "Invalid@Category" } });
  
    const updateButton = screen.getByText("Update");
    fireEvent.click(updateButton);
  
    await waitFor(() => {
      expect(screen.getByText("Category name cannot contain special characters!")).toBeInTheDocument();
    });
  });

  test("should handle category update with existing name", async () => {
    render(<CategoryTable showPagination={false} setLoading={jest.fn()} />);
  
    const editButton = screen.getAllByAltText("edit")[0];
    fireEvent.click(editButton);
  
    await waitFor(() => {
      expect(screen.getByText("Edit Category")).toBeInTheDocument();
    });
  
    const input = screen.getByLabelText("Category Name");
    fireEvent.change(input, { target: { value: "Existing Category" } });
  
    putRequest.mockImplementation((url, data, callback) => callback({ status: 409 }));
  
    const updateButton = screen.getByText("Update");
    fireEvent.click(updateButton);
  
    await waitFor(() => {
      expect(screen.getByText("Category with this name already exists!")).toBeInTheDocument();
    });
  });
});
