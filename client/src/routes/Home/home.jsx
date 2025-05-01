import React from 'react'
import nice from "./bookbg.jpg"

function Home() {
  return (
    <div>
        <h1 style={{color:"cyan"}}> Home </h1>
        <p> This is your BookHives containing all possible books, you need to grow your knowledge. </p><br/>
        <span style={{color:"lightgreen", "fontSize":"30px"}}>Why BookHives?</span><br/><br/>
        <li>
        <span style={{color:"cyan"}}><u>Time Efficiency:</u> </span> Students often have busy schedules. A smart library allows them to prebook books, saving time on physical visits.
        </li>
        <li>
        <span style={{color:"cyan"}}><u>Course Overview:</u> </span> Online access provides a quick overview of course materials, helping students plan their studies more effectively.
        </li>
        <li>
        <span style={{color:"cyan"}}><u>Teacher Guidelines:</u> </span> Having access to teacher guidelines and recommendations online ensures students stay aligned with course expectations.
        </li>
        <li>
        <span style={{color:"cyan"}}><u>Ratings & Reviews:</u> </span> Students can benefit from ratings and reviews of books, aiding them in selecting the most relevant and high-quality resources for their studies.
        </li> <br/>
        <img src={nice} style={{ borderRadius: "5px", width: "1200px" }} alt="try" />

    </div>
  )
}

export default Home;