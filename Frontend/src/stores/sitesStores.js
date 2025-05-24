import { defineStore } from "pinia";
import { ref, computed } from "vue";
import service from "../services/SitesService";

export const useSitesStore = defineStore("sites", () => {
  const error = ref(null);
  const sites = ref(null);

  const getSites = async () => {
    try {
      const response = await service.getSites();
      sites = response;
      console.log("Sites fetched successfully:", sites.value);
      error.value = null;
    } catch (e) {
      error.value = e.message;
    }
  };
  return {
    error,
    sites,
    getSites,
  };
});
