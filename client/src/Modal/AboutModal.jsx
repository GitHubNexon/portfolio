import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import showDialog from "../utils/showDialog";
import { showToast } from "../utils/toastNotifications";
import aboutApi from "../api/aboutApi";
import { numberToCurrencyString, formatReadableDate } from "../helper/helper";
import { format } from "timeago.js";

const AboutModal = ({ isOpen, onClose, onSaveData, data, mode }) => {
  const [formData, setFormData] = useState({
    Hero: {
      fullName: "",
      Description: "",
      HeroImage: "", // Add HeroImage field
    },
  });

  if (!isOpen) return null;

  useEffect(() => {
    if (mode === "edit" && data) {
      setFormData({
        Hero: {
          fullName: data.Hero?.fullName || "",
          Description: data.Hero?.Description || "",
          HeroImage: data.Hero?.HeroImage || "", // Set HeroImage if available
        },
      });
    }
  }, [mode, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      Hero: {
        ...prevData.Hero,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          Hero: {
            ...prevData.Hero,
            HeroImage: reader.result, // Set base64 string
          },
        }));
      };
      reader.readAsDataURL(file); // Convert the image to base64
    }
  };

  const handleReset = () => {
    setFormData({
      Hero: {
        fullName: "",
        Description: "",
        HeroImage: "", // Reset HeroImage
      },
    });
  };

  const validateForm = () => {
    if (!formData.Hero.fullName) {
      showToast("Details are required.", "warning");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Check if in "edit" mode or "create" mode
      if (mode === "edit") {
        await aboutApi.updateAbout(data._id, formData);
        showToast("Data updated successfully!", "success");
        console.log("Data updated successfully", formData);
      } else {
        // Create new data
        await aboutApi.createAbout(formData);
        showToast("Data saved successfully!", "success");
        console.log("Data created successfully", formData);
      }

      // Call the function to save the data or perform any post-save actions
      onSaveData(formData);
      // Optionally close the modal or perform other actions here
      // onClose();
    } catch (error) {
      console.error("Error submitting data:", error);
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-[500px] m-10 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {mode === "edit" ? "Edit Detection" : "Add Detection"}
            </h2>
            <button
              onClick={async () => {
                const confirmed = await showDialog.confirm(
                  "Are you sure you want to close without saving?"
                );
                if (confirmed) {
                  onClose();
                }
              }}
              className="text-gray-500 hover:text-gray-800"
            >
              <FaTimes size={25} />
            </button>
          </div>
          <form className="space-y-4">
            <div className="flex flex-col items-stretch justify-center text-[0.7em] space-y-2">
              <div className="flex flex-col">
                <label htmlFor="fullName" className="text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.Hero.fullName}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="Description" className="text-gray-700">
                  Description
                </label>
                <textarea
                  id="Description"
                  name="Description"
                  value={formData.Hero.Description}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500 resize-none h-[100px]"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="HeroImage" className="text-gray-700">
                  Hero Image
                </label>
                <input
                  type="file"
                  id="HeroImage"
                  name="HeroImage"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-500"
                />
                {formData.Hero.HeroImage && (
                  <img
                    src={formData.Hero.HeroImage}
                    alt="Hero Preview"
                    className="mt-2 w-[100px] h-[100px] object-cover"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-[#38572ACC] text-white py-2 px-4 rounded-md hover:bg-[#213318cc]"
              >
                {mode === "edit" ? "Save Changes" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AboutModal;
