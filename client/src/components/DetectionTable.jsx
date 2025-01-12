import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaArrowRight,
  FaFileExcel,
  FaEye,
  FaFile,
  FaSync,
  FaChartBar,
  FaBacterium,
  FaVirus,
  FaDisease,
} from "react-icons/fa";
import { showToast } from "../utils/toastNotifications";
import showDialog from "../utils/showDialog";
// import BudgetTableLogic from "../hooks/BudgetTableLogic";
import DetectionTableLogic from "../hooks/DetectionTableLogic";
// import BudgetTrackApi from "../api/BudgetTrackApi";
import { numberToCurrencyString, formatReadableDate } from "../helper/helper";
// import ExpandableBudgetTable from "../Components/ExpandableBudgetTable";
// import BudgetTrackModal from "../Pop-Up-Pages/BudgetTrackModal";
import DetectionModal from "../Modal/DetectionModal";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { format } from "timeago.js";

const DiseaseIcon = ({ disease, className }) => {
  const iconClasses = `${className} transition`;

  // Color mapping for each disease type
  const diseaseColorMap = {
    "Bacterial Spot": "text-red-600", // Red for Bacterial Spot
    "Mosaic Virus": "text-blue-600", // Blue for Mosaic Virus
    Septoria: "text-green-600", // Green for Septoria
    "Yellow Curl Virus": "text-yellow-600", // Yellow for Yellow Curl Virus
  };

  // Disease to icon mapping
  const diseaseIconMap = {
    "Bacterial Spot": (
      <FaBacterium
        className={`${iconClasses} ${diseaseColorMap["Bacterial Spot"]}`}
      />
    ),
    "Mosaic Virus": (
      <FaVirus
        className={`${iconClasses} ${diseaseColorMap["Mosaic Virus"]}`}
      />
    ),
    Septoria: (
      <FaDisease className={`${iconClasses} ${diseaseColorMap["Septoria"]}`} />
    ),
    "Yellow Curl Virus": (
      <FaVirus
        className={`${iconClasses} ${diseaseColorMap["Yellow Curl Virus"]}`}
      />
    ),
    // Add more mappings here if needed
  };

  return diseaseIconMap[disease] || null; // Return the icon if it exists, otherwise null
};

const ExpandedRowComponent = ({ data }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filteredDiseaseLogs, setFilteredDiseaseLogs] = useState([]);

  const renderData = (value) => {
    if (typeof value === "string") {
      return value.trim() === "" ? "N/A" : value;
    }
    return value === 0 || !value ? 0 : value;
  };

  const renderImages = (images) => {
    if (!images || images.length === 0) return null;

    return images.map((image, index) => (
      <div key={index} className="relative w-64 h-64 mb-4 mr-4 cursor-pointer">
        <img
          src={`data:image/png;base64,${image.data}`}
          alt={`Image ${index + 1}`}
          className="object-cover w-full h-full rounded-lg shadow-md"
          onClick={() => {
            setSelectedImage(image);
            setIsImageModalOpen(true);
          }}
        />
        <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 text-xs p-1 rounded">
          {formatReadableDate(
            renderData(image.date ? image.date : "No date available")
          )}
        </div>
      </div>
    ));
  };

  const closeModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    if (data && data.image_result) {
      const imageResultDiseases = data.image_result || [];

      const updatedFilteredLogs = imageResultDiseases.map((result) => {
        return {
          count: result.count,
          info: result.info,
        };
      });

      setFilteredDiseaseLogs(updatedFilteredLogs);
    }
  }, [data]);
  return (
    <div className="flex space-x-4 m-10">
      {/* Displaying images */}
      <div className="flex-shrink-0">
        {data.images && renderImages(data.images)}
      </div>

      {/* Details Section */}
      <div className="flex-1 space-y-4">
        {isImageModalOpen && selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="relative bg-white p-4 rounded-lg max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`data:image/png;base64,${selectedImage.data}`}
                alt="Expanded view"
                className="object-contain w-full h-full"
                style={{ maxWidth: "100vw", maxHeight: "100vh" }}
              />
            </div>
          </div>
        )}

        {/* Displaying other fields */}
        <div>
          <span className="font-bold text-lg">Created At:</span>{" "}
          <span className="text-gray-700">
            {formatReadableDate(renderData(data.created_at))}
          </span>
        </div>
        <div>
          <span className="font-bold text-lg">Updated At:</span>{" "}
          <span className="text-gray-700">
            {formatReadableDate(renderData(data.updated_at))}
          </span>
        </div>
        <div>
          <span className="font-bold text-lg">Description:</span>
          <ul className="list-disc pl-6 text-gray-700">
            {data.description.map((desc, index) => (
              <li key={index}>{renderData(desc)}</li>
            ))}
          </ul>
        </div>

        {/* Disease Detection Logs */}
        <div>
          <span className="font-bold text-lg">Plant Disease Detection:</span>
          <div className="space-y-2">
            {filteredDiseaseLogs.map((log, index) => (
              <div key={index} className="flex items-center space-x-2">
                <DiseaseIcon
                  disease={log.info}
                  //   className="text-green-600 hover:text-green-800"
                />
                <span className="text-gray-700">{log.info}</span>
                <span className="text-sm text-gray-500">
                  ({log.count} occurrence{log.count > 1 ? "s" : ""})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BudgetTable = () => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [isDetectionModalOpen, setIsDetectionModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState("add");

  const [query, setQuery] = useState("");
  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
  };

  const {
    data,
    totalItems,
    loading,
    searchQuery,
    setSearchQuery,
    fetchDetectionData,
    sortBy,
    sortOrder,
    toggleSortOrder,
    // date,
    // setDate,
  } = DetectionTableLogic(page, limit);

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
    setIsDetectionModalOpen(true);
  };

  const handleModalClose = () => {
    setIsDetectionModalOpen(false);
    setSelectedDetection(null);
  };

  const handleModalOpenForEdit = (data) => {
    setModalMode("edit");
    setSelectedDetection(data);
    setIsDetectionModalOpen(true);
  };

  //   const handleDeleteEntry = async (detectionId) => {
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
    fetchDetectionData();
    showToast("Detection  fetchDetectionData fetched successfully", "success");
  };

  //   const sortByDate = (property) => (rowA, rowB) => {
  //     const dateA = new Date(rowA[property]);
  //     const dateB = new Date(rowB[property]);
  //     return dateA - dateB;
  //   };

  const columns = [
    // {
    //   name: "Description",
    //   cell: (row) => (
    //     <div
    //       className="table-cell text-[0.8em] break-words"
    //       data-full-text={row.description}
    //     >
    //       {row.description}
    //     </div>
    //   ),
    //   width: "300px",
    // },
    {
      name: "Detection Id",
      selector: (row) => row._id,
      width: "300px",
    },
    {
      name: "Details",
      cell: (row) => (
        <div
          className="table-cell text-[0.8em] break-words"
          data-full-text={row.details}
        >
          {row.details}
        </div>
      ),
      width: "300px",
    },
    {
      name: "Created At",
      cell: (row) => (
        <span
          className="table-cell text-[0.8em] break-words"
          //   data-full-text={
          //     formatReadableDate(row.created_at) -
          //     format(new Date(row.created_at))
          //   }
        >
          <div className="flex flex-col">
            <span>{formatReadableDate(row.created_at)}</span>
            <span>{format(new Date(row.created_at))}</span>
          </div>
        </span>
      ),
      width: "300px",
    },
    {
      name: "Updated at",
      cell: (row) => (
        <span
          className="table-cell text-[0.8em] break-words"
          //   data-full-text={
          //     formatReadableDate(row.updated_at) -
          //     format(new Date(row.updated_at))
          //   }
        >
          <div className="flex flex-col">
            <span>{formatReadableDate(row.updated_at)}</span>
            <span>{format(new Date(row.updated_at))}</span>
          </div>
        </span>
      ),
      width: "300px",
    },
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

          {/* Monitor Button */}
          <div className="group relative">
            <button
              onClick={() => handleDeleteEntry(row._id)}
              className="text-white bg-red-600 p-2 rounded-md"
            >
              <FaTrash size={16} />
            </button>
            <span className="tooltip-text absolute hidden bg-gray-700 text-white text-nowrap text-[0.8em] p-2 rounded-md bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-500">
              Delete
            </span>
          </div>
        </div>
      ),
    },
  ];

  function refreshTable() {
    fetchDetectionData();
  }

  return (
    <>
      <div className="mx-auto p-8">
        <div className="flex flex-col overflow-auto">
          <h1 className="font-bold">All Plant Diseases Detection</h1>

          <div className="flex flex-wrap space-y-3 md:space-y-0 md:space-x-2 overflow-x-auto p-3 items-center justify-end space-x-2">
            {/* <label htmlFor="date">Created At</label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="border px-2 py-1 rounded-md"
            /> */}
            <button
              onClick={handleFetchLatest}
              className="bg-[#38572ACC] text-white rounded-md px-6 py-2 text-sm hover:scale-105 transition transform duration-300 flex items-center"
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
              className="bg-[#38572ACC] text-white rounded-md px-6 py-2 text-sm hover:scale-105 transition transform duration-300 flex items-center"
            >
              <FaPlus size={16} className="mr-2" />
              Detect Plant
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={data}
          pagination
          paginationServer
          paginationTotalRows={totalItems}
          onChangePage={setPage}
          onChangeRowsPerPage={setLimit}
          progressPending={loading}
          expandableRows
          expandableRowsComponent={ExpandedRowComponent}
          expandableRowExpanded={(row) => expandedRows.includes(row._id)}
        />

        {isDetectionModalOpen && (
          <DetectionModal
            mode={modalMode}
            isOpen={isDetectionModalOpen}
            onClose={handleModalClose}
            onSaveData={fetchDetectionData}
            data={selectedDetection}
            refreshTable={refreshTable}
          />
        )}
      </div>
    </>
  );
};

export default BudgetTable;
