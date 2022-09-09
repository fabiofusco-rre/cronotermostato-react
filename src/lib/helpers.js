/**
 * Helper lib
 * 
 */


export function saveConfig(appConfig) {
    let conf = {...appConfig}
    console.log('save:', conf)    
    
    const urlAPIConfig = localStorage.getItem("urlAPIConfig") || "http://localhost:9081/config";
    (async () => {
        const rawResponse = await fetch(urlAPIConfig, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(conf)
        });
        const content = await rawResponse.json();
      
        console.log(content);
      })();       
};

/**
 * 
 * @param {*} sensors Elenco dei sensori da contattare
 * @param {*} temperature Temperatura da impostare sui sensori
 */
export async function postSetTemperature(sensors, temperature) {
  console.log('Sono nella post')
  // default url:/api/services/climate/set_temperature";
  const urlAPIConfig = localStorage.getItem("urlAPIServiceClimatePOST") || process.env.REACT_APP_HA_API_SET_TEMPERATURE

  const returnPool = await Promise.all(
    sensors.map(async (sensor) => {
      const data = {"entity_id": sensor, "temperature": temperature}
      const response = await fetch(urlAPIConfig, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    })
  );
      
  console.log(returnPool); 
};

