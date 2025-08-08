const API_URL = "http://192.168.137.57:3000/api";

const getAxiosInstance = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
};
