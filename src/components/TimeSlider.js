import React from 'react';
import Slider from '@mui/material/Slider';

let marks = []
let label = ''

const TimeSlider = ({name, min, max, disabled, value, onValueChange}) => {
    
    function getMarks() {
        let marks = []
        let label = ''
        for(let i = min; i < max; i+=4) {
            label = (i <= 9 ? '0' + i: i) + ':00'
            marks.push({value: i, label: label})
        }

        return marks
    }

    function valuetext(value) {
        return `${value}`;
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
            aria-label="Time"
            value={value}
            getAriaValueText={valuetext}
            step={1}
            marks={getMarks()}
            valueLabelDisplay="auto"
            min={0}
            max={24}
            disabled={disabled}
            onChange={onValueChange}
        />                   
    )    
}

export default TimeSlider;