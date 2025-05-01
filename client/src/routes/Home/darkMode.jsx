import React, { useEffect, useState } from 'react'
import { BsFillMoonStarsFill, BsSunFill } from "react-icons/bs";

function darkMode() {
    const [isDark, setIsDark] = useState(true);
    const toggleDark = () => {
        setIsDark(!isDark);
    }
    useEffect(() => {
      const body = document.body;
      body.style.background = isDark
    ? "linear-gradient(to right, #29323c, #485563)"
    : "linear-gradient(to right, #FFD194, #D1913C)";
    }, [isDark])
    

  return (
    <div>
    <p align="right" style={{cursor:'pointer'}}>
        {!isDark ? <BsFillMoonStarsFill size={20}  onClick={toggleDark} /> : <BsSunFill size={20} onClick={toggleDark} />}
        {/* <button onClick={changeBackground} style={{borderRadius:"10px"}}>Click</button> */}
    </p>
    </div>
  )
}

export default darkMode