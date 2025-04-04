import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

let socket = io("http://localhost:7000");

function Streaming() {
    const location = useLocation()
    console.log(location.pathname)
    const [path, setPath] = useState([])
  // client-side
  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });

  socket.on('vehicle-path', (data) => {
    // console.log("data: ",data)
    setPath(data);
  })

  socket.on('No-more', (str) => {
    console.log(str)
  })

  socket.on("disconnect", () => {
    console.log(socket.id); // undefined
  });

  console.log(path.length)

  return (
    <>
      <h1>huerdc</h1>
    </>
  );
}

export default Streaming;
