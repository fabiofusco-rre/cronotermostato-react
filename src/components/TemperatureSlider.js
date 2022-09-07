import React from 'react';
import Slider from '@mui/material/Slider';

let marks = []
let label = ''
for(let i = 5; i <= 35; i++) {
    label = i % 5 === 0 ? i+'°C' : ''
    marks.push({value: i, label: label})
}

const TemperatureSlider = ({name, min, max, disabled, value, onValueChange}) => {
    
    function getMarks() {
        let marks = []
        let label = ''
        for(let i = min; i <= max; i++) {
            label = i % 5 === 0 ? i+'°C' : ''
            marks.push({value: i, label: label})
        }

        return marks
    }

    function valuetext(value) {
        return `${value}°C`;
    }
    
    /*
    const handleValueChange = (event, newValue) => {    
        console.log(newValue, name, appConfig)    
        //setTabIndex(newValue);
        let conf = {...appConfig}
        conf.zones[appConfig.currentTab].setpointDefault[name].value = newValue

        setAppConfig(conf)
        
    };*/
    
    return (       
        <Slider
            name={name}
            aria-label="Temperatura"
            value={value}
            getAriaValueText={valuetext}
            step={1}
            marks={getMarks()}
            valueLabelDisplay="on"
            min={4}
            max={35}
            disabled={disabled}
            onChange={onValueChange}
        />                   
    )    
}

export default TemperatureSlider;