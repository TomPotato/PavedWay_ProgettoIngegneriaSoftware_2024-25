import { defineStore } from "pinia";
import { ref, computed } from "vue";
import service from "../services/ReportsService";

export const useReportsStore = defineStore("reports", () => {
  const error = ref(null);
  const reports = ref([]);

  const getReports = async (offset,limit) => {
    try {
      const response = await service.getReports(offset, limit);
      reports.value = response;
      error.value = null;
    } catch (e) {
      error.value = e.message;
    }
  };

  return {
    error,
    reports,
    getReports,
  };
});
