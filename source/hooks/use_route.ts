import { useEffect, useState } from "preact/hooks";

export default function useRoute() {
  const [route, setRoute] = useState(location.hash.replace(/^#/, '') || 'options');

  useEffect(() => {
    const updateRoute = () => setRoute(location.hash.replace(/^#/, '') || 'options');
    globalThis.addEventListener("hashchange", updateRoute, false);
    return () => {
      globalThis.removeEventListener("hashchange", updateRoute);
    };
  }, []);

  return route;
}
