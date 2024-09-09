import axios from 'axios';

export const getDashboardData = async (userId) => {
  try {
    const response = await axios.post('/api/dashboard/get-dashboard-data', { userId });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { success: false, message: error.message };
  }
};
