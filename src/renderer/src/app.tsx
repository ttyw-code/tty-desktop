import React from "react";

import { useState, useEffect } from "react";
import { Play, Undo2, } from 'lucide-react';

import { Button } from "@heroui/react";
import GomokuGame from "./gomoku";

const App: React.FC = () => {


    const [state, setState] = useState(0);
    const [showGame, setShowGame] = useState(false);

    function clickStart() {
        //开始gomoku游戏
        setShowGame(true);
    }

    function clickBack() {
        setShowGame(false);
    }

    function clickExit() {
        if (window.appBridge?.quit) {
            window.appBridge.quit();
        } else {
            console.warn('appBridge not available, quit skipped');
        }
    }

    return <div className="h-full w-full overflow-hidden p-6 ">

        {
            !showGame && (
                <div className="flex flex-col gap-4">
                    <Button variant="shadow" startContent={<Play />} onPress={clickStart}>开始</Button>
                    <Button variant="shadow" color="danger" onPress={clickExit}>退出</Button>
                </div>
            )
        }
        {showGame && (
            <div className="mt-4 flex h-full flex-col space-y-4 overflow-hidden">
                <Button variant="shadow" startContent={<Undo2 />} onPress={clickBack}>返回</Button>
                <div className="flex-1 min-h-0">
                    <GomokuGame />
                </div>
            </div>
        )}
    </div>;
}

export default App;