/**
 * Helper lib
 * 
 */

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIxYmQzMDE1NzQzN2M0MjI0ODRjNGNlNTFlMGExZDY1YSIsImlhdCI6MTY2Mzc5MTY1MCwiZXhwIjoxOTc5MTUxNjUwfQ.sNblftRyGX4CxMm94_x2BRY_lAdfnJ2NtKL1Xs8xF04
export const defaultHeader = {
  headers: {    
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
};

export function saveConfig(appConfig) {
    let conf = {...appConfig}
    console.log('save:', conf)    
    
    const urlAPIConfig = localStorage.getItem("urlAPIConfig") || "http://localhost:9080/apiserver/config";
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

export async function readConfig(setAppConfig) {
  const urlAPIConfig = localStorage.getItem("urlAPIConfig") || "http://localhost:" + process.env.REACT_APP_INTERNAL_API_PORT + "/apiserver/config";
    (async () => {
        const rawResponse = await fetch(urlAPIConfig, {          
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },          
        }).then(res => res.json())
        .then(
            (data) => {
                //setIsLoaded(true);
                //const r = data.filter(el => el.entity_id.startsWith("climate."));
                const conf = data //JSON.parse(data)
                console.log(data)
                //console.log('rconfig',conf)
                setAppConfig(conf)
                //setClimateSensors(r.map(i => i.entity_id));
            }
        )
        //const conf = await rawResponse.json();
        
        
        
      })();       
}

/**
 * 
 * @param {*} sensors 
 * @param {*} temperature 
 */
export function setTemperature(sensors, temperature) {
  let data = {
    sensors: sensors,
    temperature: temperature
  }
  console.log('In setTemperature, data:', data)
  
  const urlAPI = "http://localhost:9080/apiserver/setTemperature";
  (async () => {
      const rawResponse = await fetch(urlAPI, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const content = await rawResponse.json();
    
      console.log('In setTemperature, dopo la chiamata: ', content);
    })();       
};

