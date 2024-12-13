/* @jsx h */
import { h, render } from "preact";

import Header from "./components/header.tsx";
import Switch from "./components/switch.tsx";
import useRoute from "./hooks/use_route.ts";
import Home from "./pages/home.tsx";
import Options from "./pages/options.tsx";

const mountPoint = document.getElementById("mount");

if (mountPoint) {
  render(
    <App />,
    mountPoint,
  );
}

function App() {
  const route = useRoute();
  
  return (
    <main>
      <Header title="Browser Extension Boilerplate" />
      <Switch
        value={route}
        defaultCase={<Options path="/options" />}
        cases={{
          "options": <Options path="/options" />,
          "home": <Home path="/home" />,
        }}
      />
    </main>
  );
}
