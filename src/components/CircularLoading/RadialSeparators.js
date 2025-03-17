import {useEffect, useState ,React} from 'react';

import _ from "lodash";

function Separator(props) {
  const [vueltas, setvueltas] = useState([])
  let contador=0;
  useEffect(() => {
 
    const interval = setInterval(() => 
    {
      if(contador == 1) 
      {
        
        
        contador=0;
      } 
      else {
      //  console.log(contador)
 
 
      }
      setvueltas(contador)
      contador= contador +0.10;
      
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        borderRadius: '50%',
        position: "absolute",
        height: "100%",
        transform: `rotate(${vueltas}turn)`
      }}
    >
      <div style={props.style} />
    </div>
  );
}

function RadialSeparators(props) {
  const turns = 1 / props.count;
  return _.range(props.count).map(index => (
    <Separator turns={index * turns} style={props.style} />
  ));
}

export default RadialSeparators;