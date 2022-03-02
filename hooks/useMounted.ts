import { useEffect, useRef } from "react";
import { useUpdate } from "react-use";

/*
 * Returns bool depending on component's mounted state
 */
const useMounted = (): boolean => {
  const mounted = useRef(false);
  const update = useUpdate();
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      update();
    }
  }, [update]);
  return mounted.current;
};

export default useMounted;
