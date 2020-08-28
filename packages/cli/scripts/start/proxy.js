const axios = require('axios');

const getMetaFromUrl = async (url) => {
  const envJson = await new Promise((resolve) => {
    axios
      .get(`${url}microfrontends/meta.json`)
      .then((response) => response.data)
      .then((json) => {
        resolve(json);
      });
  });
  Object.values(envJson).forEach((envJson) => {
    envJson.js = envJson.js.map((pathToFile) => pathToFile.replace('./', url));
  });

  return envJson;
};

module.exports = {
  getMetaFromUrl,
};
