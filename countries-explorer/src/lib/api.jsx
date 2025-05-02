import axios from "axios";

const API_BASE_URL = "https://restcountries.com/v3.1";

export const getAllCountries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all countries:", error);
    return [];
  }
};

export const getCountryByName = async (name) => {
  if (!name) return [];
  try {
    const response = await axios.get(`${API_BASE_URL}/name/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching country by name (${name}):`, error);
    return [];
  }
};

export const getCountriesByRegion = async (region) => {
  if (!region) return getAllCountries();

  try {
    const response = await axios.get(`${API_BASE_URL}/region/${region}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching countries by region (${region}):`, error);
    return [];
  }
};

export const getCountriesByLanguage = async (languageCode) => {
  if (!languageCode) return getAllCountries();

  try {
    // First get all countries as there's no direct API endpoint for language
    const response = await axios.get(`${API_BASE_URL}/all`);

    // Filter countries that have the specific language
    return response.data.filter((country) => {
      if (!country.languages) return false;
      return Object.keys(country.languages).includes(languageCode);
    });
  } catch (error) {
    console.error(
      `Error fetching countries by language (${languageCode}):`,
      error
    );
    return [];
  }
};

export const getCountryByCode = async (code) => {
  if (!code) return null;

  try {
    const response = await axios.get(`${API_BASE_URL}/alpha/${code}`);
    return response.data[0] || null;
  } catch (error) {
    console.error(`Error fetching country by code (${code}):`, error);
    return null;
  }
};
