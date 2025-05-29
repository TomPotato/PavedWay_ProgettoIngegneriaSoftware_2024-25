import api from "./Api";

class NominatimAPI {
  async getPlace(street, city, code) {
    try {
      const response = await api.get("/search", {
        street: street,
        city: city,
        code: code,
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
