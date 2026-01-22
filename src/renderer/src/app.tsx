import React from "react";

import { useState, useEffect } from "react";

import { Button } from "@heroui/react";

const App: React.FC = () => {


    const [state, setState] = useState(0);

    return <div>
        <h2>start count:{state}</h2>
        <Button className="bg-linear-to-tr from-red-500 to-yellow-500 text-white shadow-lg"
            radius="lg" onPress={() => setState(state + 1)} >click start</Button>
    </div>;
}

export default App;