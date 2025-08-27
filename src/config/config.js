const STRAPI_URL =
  process.env.REACT_APP_STRAPI_URL || "https://lfl-back-73da1a8c4e08.herokuapp.com/api";

const config = {
    strapiUrl: STRAPI_URL,
};

export { STRAPI_URL };
export default config;
