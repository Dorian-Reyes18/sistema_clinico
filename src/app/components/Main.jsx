import { useEffect, useState } from "react";

const Main = ({ children }) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState("86%");



  return (
    <main
      className="content-space"
      style={{
        flexGrow: 1,
        overflowY: "scroll",
      }}
    >
      {children}
    </main>
  );
};

export default Main;
