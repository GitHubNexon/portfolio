import axios from "axios";
import { API_BASE_URL } from "./config.js";
axios.defaults.withCredentials = true;

const aboutApi = {
  createAbout: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/about`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating about:", error);
      throw error;
    }
  },

  getAllAbout: async (
    page = 1,
    limit = 10,
    keyword = "",
    sortBy = "",
    sortOrder = "asc",
    date = ""
  ) => {
    const response = await axios.get(`${API_BASE_URL}/about/getAll`, {
      params: { page, limit, keyword, sortBy, sortOrder, date },
    });
    return response.data;
  },

  // Update an existing About section (PATCH)
  updateAbout: async (id, data) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/about/update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating about:", error);
      throw error;
    }
  },

  // Delete an About section (DELETE)
  deleteAbout: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/about/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting about:", error);
      throw error;
    }
  },
};

export default aboutApi;
