import React, { useEffect, useState } from 'react';
import UserDetail from "./mybook";
function UserDetailComponent() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // alert("hota");
    fetch("http://localhost:8000/userData", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        // alert("hello");
       const data1= window.localStorage.getItem("email");
        setUserData(data1);


      });
  }, []);
  return (

    <>
    {/* <h1>{userData}</h1> */}
    <UserDetail propValue={userData} />
    {/* <UserDetail email={userData.email !== null ? userData.email : 'loo@gmail.com'} /> */}


    </>
    
  );
}

export default UserDetailComponent;
