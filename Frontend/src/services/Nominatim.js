import api from "./Api";

class NominatimAPI {
  async getPlace(street, city, code, stNumber) {
    try {
      const response = await api.get("/geocode", {
        street: street,
        city: city,
        code: code,
        stNumber: stNumber
      });

      const lat = Number(response.data[0].lat);
      const lon = Number(response.data[0].lon);

      return {lat, lon};
    } catch (error) {
      throw error.data;
    }
  }
}

export default new NominatimAPI();
