import React, {useEffect} from "react";

const useMountLogger = (compName) => {
  useEffect(() => {
    console.log(`${compName} Mounting`)

    return () => console.log(`${compName} Unmounting`)
  }, [])
}

export default useMountLogger;
