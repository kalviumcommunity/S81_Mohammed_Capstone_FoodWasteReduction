      import React, { useState } from "react";
      import Login from "../pages/Login";
      import Signup from "../pages/Signup";


      function Loginpage() {
        const [sign,setSign]= useState(true)
          const handleClick=()=>{
              setSign(!sign)
              console.log(sign)
          }


      
        return (
          <div>
              {sign?<Login x={handleClick}/>: <Signup x={handleClick}/>}
              
          </div>
          
          
        );


        
      }







      export default Loginpage;