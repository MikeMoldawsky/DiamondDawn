import axios from "axios";

export const getGeoLocationApi = async () => {
  const res = await axios.post(
    `https://ipwhois.pro/?key=${process.env.REACT_APP_IPWHOIS_KEY}`
  );
  return res.data;
};
