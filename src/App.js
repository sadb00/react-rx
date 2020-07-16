import React, { useEffect, useState, useRef } from 'react';
import './App.css';

import { of } from 'rxjs';
import { switchMap, repeat } from 'rxjs/operators';
import { delay } from 'rxjs/operators';

const randomDelay = () => 100 + (Math.random() * 1900);
const randomTmp = () => 20 + (Math.random() * 20);
const randomHumidity  = () => Math.random() * 100;
const randomAirPressure  = () => 680 + (Math.random() * 130);


const randomTmp$ = of("").pipe(switchMap(() => of(randomTmp()).pipe(delay(randomDelay()))), repeat());
const randomHumidity$ = of("").pipe(switchMap(() => of(randomHumidity()).pipe(delay(randomDelay()))), repeat());
const randomPressure$ = of("").pipe(switchMap(() => of(randomAirPressure()).pipe(delay(randomDelay()))), repeat());



function App() {

  const [temp, setTemp] = useState({temp: null, date: new Date().getTime()});
  const [humid, setHumid] = useState({humid: null, date: new Date().getTime()})
  const [pressure, setPressure] = useState({pressure: null, date: new Date().getTime()})
  const values = useRef({temp:{value: null, date: null}, humid:{value: null, date: null}, pressure:{value: null, date: null}});

  useEffect(() => {
    randomTmp$.subscribe(num => setTemp({value: num, date: new Date().getTime()}));
    randomHumidity$.subscribe(num => setHumid({value: num, date: new Date().getTime()}));
    randomPressure$.subscribe(num => setPressure({value: num, date: new Date().getTime()}));
  }, [])

  useEffect(() => {
    let newTemp = {};
    let newPressure = {};
    let newHumidity = {};
    const { temp: currentTemp, humid: currentHumid, pressure: currentPressure } = values.current;
    const currentTime = new Date().getTime();

    if(currentTemp.value !== temp.value) { 

      newTemp = {value: temp.value, date: currentTime}
      newHumidity = currentTime - currentHumid.date > 1000 ? { value: null, date: currentHumid.date } : currentHumid;
      newPressure = currentTime - currentPressure.date > 1000 ? { value: null, date: currentPressure.date } : currentPressure;

    } else if(currentHumid.value !== humid.value) { 

      newHumidity = {value: humid.value, date: currentTime}
      newTemp = currentTime - currentTemp.date > 1000 ? { value: null, date: currentTemp.date } : currentTemp;
      newPressure = currentTime - currentPressure.date > 1000 ? { value: null, date: currentPressure.date } : currentPressure;

    } else if(currentPressure.value !== pressure.value) { 

      newPressure = {value: pressure.value, date: currentTime}
      newHumidity = currentTime - currentHumid.date > 1000 ? { value: null, date: currentHumid.date } : currentHumid;
      newTemp = currentTime - currentTemp.date > 1000 ? { value: null, date: currentTemp.date } : currentTemp;

    }
    values.current = {temp: newTemp, humid: newHumidity, pressure: newPressure}

  }, [temp, humid, pressure])

  const { temp: currentTemp, humid: currentHumid, pressure: currentPressure } = values.current; 

  return (
    
    <div style={{ margin: 20}}>
      { currentTemp.date && humid.date && pressure.date ? (
        <div>
          <p>Temperature: {currentTemp.value ? `${currentTemp.value.toFixed(2)} C` : 'N/A'}</p>
          <p>Humidity: {currentHumid.value ? `${Math.round(currentHumid.value)} %` : 'N/A'}</p>
          <p>Air pressure: {currentPressure.value ? `${Math.round(currentPressure.value)} mmHg` : 'N/A'}</p>
        </div>) : 'N/A'
      }
    </div>
  );
}

export default App;
