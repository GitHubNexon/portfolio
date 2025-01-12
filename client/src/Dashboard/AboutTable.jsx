import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaArrowRight,
  FaFileExcel,
  FaEye,
  FaSync,
  FaFile,
} from "react-icons/fa";
import { IoDuplicate } from "react-icons/io5";
import { FaPesoSign } from "react-icons/fa6";
import { showToast } from "../utils/toastNotifications";
import showDialog from "../utils/showDialog";
import aboutApi from "../api/aboutApi";
import DashboardNavigation from "../routes/DashboardNavigation";
import AboutLogic from "../hooks/AboutLogic";
import { numberToCurrencyString, formatReadableDate } from "../helper/helper";
import AboutModal from "../Modal/AboutModal";

const AboutTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedAbout, setSelectedAbout] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [modalType, setModalType] = useState("");

  const [query, setQuery] = useState("");
  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
  };

  const {
    about,
    totalItems,
    totalPages,
    loading,
    searchQuery,
    setSearchQuery,
    fetchAbout,
    sortBy,
    sortOrder,
    toggleSortOrder,
    setSortBy,
    setSortOrder,
    setAbout,
    date,
    setDate,
  } = AboutLogic(page, limit);

  // Debounce the search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(query);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleModalOpen = () => {
    // showToast("Not working Yet!!!", "warning");
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAbout(null);
  };

  const handleModalOpenForEdit = (about) => {
    setModalMode("edit");
    setSelectedAbout(about);
    setIsModalOpen(true);
  };

  //   const handleDeleteEntry = async (budgetId) => {
  //     const confirmed = await showDialog.confirm(
  //       `Are you sure you want to delete this Entry?`
  //     );
  //     if (!confirmed) return;

  //     try {
  //       await BudgetTrackApi.deleteBudgetById(budgetId);
  //       fetchBudgets();
  //       showToast("Budget deleted successfully!", "success");
  //     } catch (error) {
  //       console.error("Error deleting Budget:", error);
  //       showToast("Failed to delete Budget. Please try again.", "error");
  //     }
  //   };

  const handleFetchLatest = async () => {
    fetchAbout();
    showToast("latest track data fetched successfully", "success");
  };

  const columns = [
    // {
    //   name: "Work Group",
    //   cell: (row) => (
    //     <div
    //       className="table-cell text-[0.8em] break-words"
    //     >
    //       {row.WorkGroup?.acronym} - {row.WorkGroup?.fullName}
    //     </div>
    //   ),
    //   width: "300px",
    // },
    {
      name: "createdAt",
      id: "createdAt",
      selector: (row) => formatReadableDate(row.createdAt),
      sortable: true,
    },
    {
      name: "updatedAt",
      id: "updatedAt",
      selector: (row) => formatReadableDate(row.updatedAt),
      sortable: true,
    },
    {
      name: "fullName",
      selector: (row) => row.Hero.fullName,
    },
    // {
    //   name: "Total Allocated",
    //   selector: (row) => numberToCurrencyString(row.TotalAllocated || 0),
    // },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          {/* Edit Button */}
          <div className="group relative">
            <button
              onClick={() => handleModalOpenForEdit(row)}
              className="text-white bg-blue-600 p-2 rounded-md"
            >
              <FaEdit size={16} />
            </button>
            <span className="tooltip-text absolute hidden bg-gray-700 text-white text-nowrap text-[0.8em] p-2 rounded-md bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-500">
              Edit
            </span>
          </div>

          {/* <div className="group relative">
            <button
              onClick={() => handleDeleteEntry(row._id)}
              className="text-white bg-red-600 p-2 rounded-md"
            >
              <FaTrash size={16} />
            </button>
            <span className="tooltip-text absolute hidden bg-gray-700 text-white text-nowrap text-[0.8em] p-2 rounded-md bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-500">
              Delete
            </span>
          </div> */}
        </div>
      ),
    },
  ];

  function refreshTable() {
    fetchAbout();
  }

  return (
    <>
      {/* Fixed the navigation at the top */}
      <div className="fixed top-0 left-0 w-full z-10 bg-white shadow-md">
        <DashboardNavigation />
      </div>
      <div className="mx-auto p-8">
        <div className="flex flex-col overflow-auto">
          <h1 className="font-bold">DASHBOARD</h1>
          <div className="flex flex-wrap space-y-3 md:space-y-0 md:space-x-2 overflow-x-auto p-3 items-center justify-end space-x-2">
            <button
              onClick={handleFetchLatest}
              className="bg-blue-600 text-white rounded-md px-6 py-2 text-sm hover:scale-105 transition transform duration-300 flex items-center"
            >
              <FaSync size={16} className="mr-2" />
              Fetch latest Data
            </button>
            <input
              type="text"
              placeholder={`Search...`}
              className="border px-2 py-1 rounded-md"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={handleModalOpen}
              className="bg-blue-600 text-white rounded-md px-6 py-2 text-sm hover:scale-105 transition transform duration-300 flex items-center"
            >
              <FaPlus size={16} className="mr-2" />
              create
            </button>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={about}
        pagination
        paginationServer
        paginationTotalRows={totalItems}
        onChangePage={setPage}
        onChangeRowsPerPage={setLimit}
        progressPending={loading}
        // expandableRows
        // expandableRowsComponent={ExpandedRowComponent}
        // expandableRowExpanded={(row) => expandedRows.includes(row._id)}
        sortServer={true}
        sortColumn={sortBy}
        sortDirection={sortOrder}
        onSort={(column) => toggleSortOrder(column.id)}
      />

      {isModalOpen && (
        <AboutModal
          mode={modalMode}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSaveData={fetchAbout}
          data={selectedAbout}
          refreshTable={refreshTable}
        />
      )}
    </>
  );
};

export default AboutTable;
