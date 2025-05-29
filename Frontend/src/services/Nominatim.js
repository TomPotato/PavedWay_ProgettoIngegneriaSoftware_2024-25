import api from "./Api";
class NominatimAPI{
  async getPlace(street, city, code) {
    try {
      const response = await api.get("https://nominatim.openstreetmap.org/search", {
        street: street,
        city: city,
        country: 'Italy',
        postalcode: code,
      });
      console.log(response);
      const sum = 0;
      const tot = 0;
      response.forEach(place => {sum += place.lat; tot++});
      const lat = sum/tot;
      sum = 0;
      tot = 0;
      response.forEach(place => {sum += place.lon; tot++})
      const lon = sum/tot;
      return lat, lon;
    } catch (error) {
      throw error.data;
    }
  }
}

export default new NominatimAPI();