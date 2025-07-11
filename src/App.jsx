import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import TimeTablePage from "./Pages/TimeTablePage";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <TimeTablePage />
        </>
    );
}

export default App;
