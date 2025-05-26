import { defineStore } from "pinia";
import { ref, computed } from "vue";
import service from "../services/SitesService";

export const useSitesStore = defineStore("sites", () => {
  const error = ref(null);
  const sites = ref([]);
  const check = ref(false);

  const getSites = async (offset,limit) => {
    try {
      const response = await service.getSites(offset, limit);
      sites.value = response;
      error.value = null;
    } catch (e) {
      error.value = e.message;
    }
  };

  const createSite = async (siteData) => {
    try {
      const response = await service.createSite(siteData);
      if(response){
        check = true;
      }
      error.value = null;
    } catch (e) {
      error.value = e.message;
    }
  };

  return {
    error,
    sites,
    check,
    getSites,
    createSite,
  };
});
