import React from 'react'
import { BsFacebook, BsGithub, BsLinkedin, BsReddit, BsTwitter } from "react-icons/bs"
import { SiMyanimelist } from "react-icons/si";

function Footer() {
  return (
    <footer style={{padding:"10px"}}>
        &copy; Copyright { new Date().getFullYear() } <br /> <br /> 
        <div style={{display:"inline-flex", alignItems:"center"}}>
          {/* <a href='https://twitter.com/home' target='_blank'><BsTwitter size={20} style={{display:"inline-block", width:"30px"}} /></a>
          <a href='https://reddit.com' target='_blank'><BsReddit size={20} style={{display:"inline-block", width:"30px"}}/></a>
          <a href='https://www.linkedin.com/in/dhruva-upadhyaya-94681726b/' target='_blank'><BsLinkedin size={20} style={{display:"inline-block", width:"30px"}}/></a>
          <a href='https://github.com/dhruva4869' target='_blank'><BsGithub size={20} style={{display:"inline-block", width:"30px"}}/></a> */}
          {/* <SiMyanimelist /> */}
        </div>
    </footer>
  )
}

export default Footer