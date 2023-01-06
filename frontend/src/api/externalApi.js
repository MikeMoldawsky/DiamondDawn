import axios from "axios";

export const getGeoLocationApi = async () => {
  const res = await axios.post(
    `https://ipwhois.pro/?key=${process.env.REACT_APP_IPWHOIS_KEY}&fields=country_code,country,region,city`
  );
  return res.data;
};
