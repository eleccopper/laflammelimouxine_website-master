const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

const config = {
    strapiUrl: STRAPI_URL,
};

export { STRAPI_URL };
export default config;
