const handleDelete = (book) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
    setMessage("");
  };

  const handleConfirmDelete = async () => {
   
 deleteRequest(`${DELETE_BOOK}title/${selectedBook.title}`, (response) => {
      if (response?.status === 200) {
        setMessage("Book deleted successfully!");
        setIsError(false);
        setTimeout(() => {
          setIsDeleteModalOpen(false);
          setSelectedBook(null);
        }, 2000);
        fetchData();
      } else {
        setMessage("Error deleting Book! Book from this category is issued");
        setIsError(true);
        console.error("Error deleting category", response?.data);
      }
    });
  };