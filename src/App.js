import React, { useState, useEffect }  from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import SettingsIcon from '@mui/icons-material/Settings'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Dashboard from './components/Dashboard'
import ConfigPanel from './components/ConfigPanel'
import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import {readConfig, defaultHeader} from './lib/helpers'

export const ConfContext = React.createContext("conf");

const App = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    // const [users, setUsers] = useState([]);
    const [tabIndex, setTabIndex] = useState(1);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [zones, setZones] = useState([]);
    const [climateSensors, setClimateSensors] = useState([])
    const [temperatureSensors, setTemperatureSensors] = useState([])
    const [appConfig, setAppConfig] = useState([])

    const handleSettingsOpen = () => {
       setSettingsOpen(!settingsOpen);
    };   

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue)
        
        appConfig.currentTab = newValue - 1
        setAppConfig(appConfig)
    };

    /*
    const defaultHeader = {
        headers: {
          'Authorization': localStorage.getItem("haAPIToken") || "ABCDEFG"
        },
    };*/

    useEffect(() => {     

        //Far diventare API???
        setZones([        
            { key: "1", label: "Giorno" },
            { key: "2", label: "Notte" },            
        ])

        //Recupera conf via API interne (da spostare nell'helper)     
        //const urlGetConfig = localStorage.getItem("urlGetConfig") || "http://localhost:9081/config";
        const urlGetConfig = localStorage.getItem("urlGetConfig") || "http://localhost:" + process.env.REACT_APP_INTERNAL_API_PORT + "/config";        
        fetch(urlGetConfig)
            .then(res => res.json())
            .then(
                (data) => {
                    //setIsLoaded(true);
                    //const r = data.filter(el => el.entity_id.startsWith("climate."));
                    const conf = data //JSON.parse(data)
                    //console.log('rconfig',conf)
                    setAppConfig(conf)
                    //setClimateSensors(r.map(i => i.entity_id));
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        

        //Recupera i climate sensors da HA (da spostare nell'helper)
        //const urlGetClimateSensors = localStorage.getItem("urlGetClimateSensors") || "https://my-json-server.typicode.com/peppelauro/myjsonserver/sensors";
        const urlGetClimateSensors = localStorage.getItem("urlAPIStates") || "/api/states";
        fetch(urlGetClimateSensors, defaultHeader)
            .then(res => res.json())
            .then(
                (data) => {
                    //setIsLoaded(true);
                    const r = data.filter(el => el.entity_id.startsWith("climate."));
                    //console.log('r',r)
                    setClimateSensors(r.map(i => i.entity_id));
                },
                (error) => {
                    console.log(error)
                    setIsLoaded(true);
                    setError(error);
                }
            )
        
        //Recupera i sensori di temperatura (da spostare nell'helper)
        //const urlGetTemperatureSensors = localStorage.getItem("urlGetTemperatureSensors") || "https://my-json-server.typicode.com/peppelauro/myjsonserver/sensors";
        const urlGetTemperatureSensors = localStorage.getItem("urlAPIStates") || "/api/states";
        fetch(urlGetTemperatureSensors, defaultHeader)
            .then(res => res.json())
            .then(
                (data) => {
                    //setIsLoaded(true);                    
                    const r = data.filter(el => el.entity_id.startsWith("temperature."));
                    //console.log('r',r)
                    setTemperatureSensors(r.map(i => i.entity_id));      
                    setIsLoaded(true)              
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
        
                )        

        /*
        let conf = null
        //const saved = localStorage.getItem("appConfig");
        if(saved) {
            conf = JSON.parse(saved)
        } else {        
            conf = {zones: []}
            for(const z of zones) {
                conf.zones.push({
                    ...z, 
                    setpointDefault: [
                        {label: 'Eco', value: 16 + Math.floor(Math.random() * 10)}, 
                        {label: 'Confort', value: 18 + Math.floor(Math.random() * 10)}, 
                        {label: 'Non in casa', value: 12},
                    ],
                    setpointTimeslice: {
                        '00:00' : 0,
                        '00:30' : 0,                    
                        '01:00' : 0,
                        '01:30' : 0,
                        '02:00' : 0,
                        '02:30' : 0,
                        '03:00' : 0,
                        '03:30' : 0,
                        '04:00' : 0,
                        '04:30' : 0,
                        '05:00' : 0,
                        '05:30' : 0,
                        '06:00' : 0,
                        '06:30' : 0,
                        '07:00' : 0,
                        '07:30' : 0,
                        '08:00' : 0,
                        '08:30' : 0,
                        '09:00' : 0,
                        '09:30' : 0,
                        '10:00' : 0,
                        '10:30' : 0,
                        '11:00' : 0,
                        '11:30' : 0,
                        '12:00' : 0,
                        '12:30' : 0,
                        '13:00' : 0,
                        '13:30' : 0,
                        '14:00' : 0,
                        '14:30' : 0,
                        '15:00' : 0,
                        '15:30' : 0,
                        '16:00' : 0,
                        '16:30' : 0,
                        '17:00' : 0,
                        '17:30' : 0,
                        '18:00' : 0,
                        '18:30' : 0,
                        '19:00' : 0,
                        '19:30' : 0,
                        '20:00' : 0,
                        '20:30' : 0,
                        '21:00' : 0,
                        '21:30' : 0,
                        '22:00' : 0,
                        '22:30' : 0,
                        '23:00' : 0,
                        '23:30' : 0,
                    },
                    climateSensors: [],
                    temperatureSensor: ''
                })
            }
            conf.currentTab = 0
            conf.status = false
            conf.vacationMode = false
            conf.vacationTemperature = 14
            conf.climateSensors = climateSensors
            conf.temperatureSensors = temperatureSensors

            //console.log(conf)
            
        }

        setAppConfig(conf)
        */
        const tmpTabIndex = (appConfig.currentTab + 1).toString()
        //console.log('tmpTabIndex', appConfig, appConfig.currentTab, tmpTabIndex)
        if(tmpTabIndex === NaN) {
            setTabIndex('0')
        } else {
            setTabIndex((appConfig.currentTab + 1).toString())
        }
        
        //console.log('initial',appConfig)
        //localStorage.setItem("appConfig", JSON.stringify(conf));
        //if(temperatureSensors.length > 0) {
        //setIsLoaded(true)
        //}
      }, [isLoaded])
    
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded || appConfig.length === 0) {
        return <div>Loading...</div>;
    } else {
        //console.log('Caricato:', appConfig)        
        return (            
                <div>
                    <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <AppBar position="static">
                                <Toolbar>                            
                                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                        Cronoterm Manager
                                    </Typography>
                                    <IconButton
                                        size="large"
                                        edge="start"
                                        color="inherit"
                                        aria-label="settings"
                                        sx={{ mr: 2 }}
                                        onClick={handleSettingsOpen}
                                    >                                 
                                        <SettingsIcon />
                                    </IconButton>                   
                                </Toolbar>
                            </AppBar>
                        </Grid>
                        {appConfig.status === false && (
                        <Grid item xs={12}>
                            <h2 style={{textAlign: 'center'}}>Cronotermostato disattivato, acceddere alle impostazioni ( <span onClick={handleSettingsOpen}><SettingsIcon /></span>) per attivarlo.</h2>
                        </Grid>  
                        )}
                        {appConfig.vacationMode && appConfig.status && (
                        <Grid item xs={12}>
                            <h1 style={{textAlign: 'center'}}><BeachAccessIcon fontSize="large" /></h1>
                            <h2 style={{textAlign: 'center'}}>Cronotermostato in modalità vacanza ( {appConfig.vacationTemperature}°), acceddere alle impostazioni ( <span onClick={handleSettingsOpen}><SettingsIcon /></span>) per modificarlo.</h2>
                        </Grid>  
                        )}
                        {appConfig.status && !appConfig.vacationMode && !isNaN(appConfig.currentTab) && !isNaN(tabIndex) && ( 
                        <Grid item xs={12}>
                            <TabContext value={tabIndex}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleTabChange} aria-label="tab">
                                {appConfig.zones.map((data) => {
                                    return (
                                        <Tab label={data.label} value={data.key} key={data.key} />                            
                                    );
                                })}                               
                                </TabList>
                                </Box>
                                {appConfig.zones.map((data) => {                                
                                    return (
                                        <TabPanel value={data.key} key={data.key}>
                                            <Dashboard name={data.label} climateSensors={climateSensors} temperatureSensors={temperatureSensors} appConfig={appConfig} setAppConfig={setAppConfig} /> 
                                        </TabPanel>                                
                                    );
                                })}                            
                            </TabContext>  
                        </Grid>
                        )}
                        {/*<Grid item xs={12}>
                            <ul>
                            {users.map(user => (
                            <li key={user.id}>
                                {user.name} 
                            </li>
                            ))}
                            </ul>
                            </Grid>*/}
                        

                        <Grid item xs={12}>
                        
                        </Grid>
                    </Grid>
                    </Box>
                                    
                    <ConfigPanel appConfig={appConfig} setAppConfig={setAppConfig} open={settingsOpen} toggleOpen={handleSettingsOpen} /> 
                    
                </div>            
        );
    }
}
export default App;
