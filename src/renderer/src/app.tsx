import React from "react";

import { useState } from "react";
import {
    Play,
    Undo2,
    ListChecks,
    FileText,
    Settings,
    Timer,
    Search,
    BookOpenText,
    Calculator,
    TableOfContents
} from "lucide-react";

import { Button } from "@heroui/react";
import GomokuGame from "./gomoku";
import TodoList from "./todoList";
import Pomodoro from "./pomodoro";
import BasePage from "./basic-page";


type AppId =
    | "gomoku"
    | "todo"
    | "markdown"
    | "settings"
    | "pomodoro"
    | "basicPage"
    | "search"
    | "journal"
    | "calculator";


const App: React.FC = () => {
    const [activeApp, setActiveApp] = useState<AppId | null>(null);

    function clickExit() {
        if (window.appBridge?.quit) {
            window.appBridge.quit();
        } else {
            console.warn("appBridge not available, quit skipped");
        }
    }

    const apps: Array<{
        id: AppId;
        title: string;
        description: string;
        icon: React.ReactNode;
        available: boolean;
        cta: string;
    }> = [
        {
            id: "gomoku",
            title: "五子棋",
            description: "单机对战，随时来一局。",
            icon: <Play />,
            available: true,
            cta: "开始游戏",
        },
        {
            id: "pomodoro",
            title: "倒计时/番茄钟",
            description: "专注与提醒，提升效率。",
            icon: <Timer />,
            available: true,
            cta: "打开",
        },
        {
            id: "basicPage",
            title: "基础",
            description: "基础页面。",
            icon: <TableOfContents />,
            available: true,
            cta: "打开",
        },
        {
            id: "search",
            title: "本地文件搜索",
            description: "快速定位常用文件。",
            icon: <Search />,
            available: false,
            cta: "即将上线",
        },
        {
            id: "journal",
            title: "简易日记",
            description: "每日记录与回顾。",
            icon: <BookOpenText />,
            available: false,
            cta: "即将上线",
        },
        {
            id: "calculator",
            title: "计算器/换算",
            description: "常用计算与单位换算。",
            icon: <Calculator />,
            available: false,
            cta: "即将上线",
        },
        {
            id: "todo",
            title: "待办清单",
            description: "快速记录与提醒。",
            icon: <ListChecks />,
            available: true,
            cta: "打开",
        },
        {
            id: "markdown",
            title: "Markdown 笔记",
            description: "轻量笔记与预览。",
            icon: <FileText />,
            available: false,
            cta: "即将上线",
        },
        {
            id: "settings",
            title: "设置",
            description: "个性化体验与偏好。",
            icon: <Settings />,
            available: false,
            cta: "即将上线",
        },
    ];

    return (
        <div className="drag-region flex h-full w-full flex-col overflow-hidden">
            <div className={`flex-1 overflow-hidden ${activeApp ? "p-0" : "p-6"}`}>
                {!activeApp && (
                    <div className="flex w-full h-full flex-col gap-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold">应用中心</h1>
                            <p className="text-sm text-default-500">
                                选择一个子应用开始使用。
                            </p>
                        </div>
                        <Button variant="shadow" color="default" onPress={clickExit}>
                            退出
                        </Button>
                    </div>

                    <div className="grid flex-1 auto-rows-fr grid-cols-4 grid-rows-4 gap-4">
                        {apps.map(app => (
                            <div
                                key={app.id}
                                className="flex h-full flex-col justify-between rounded-2xl border border-default-200 bg-content1 p-5 shadow-sm"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-default-600">
                                        <span className="text-xl">{app.icon}</span>
                                        <span className="text-base font-medium">{app.title}</span>
                                    </div>
                                    <p className="text-sm text-default-500">{app.description}</p>
                                </div>
                                <Button
                                    className="mt-5"
                                    variant={app.available ? "shadow" : "flat"}
                                    color={app.available ? "primary" : "default"}
                                    isDisabled={!app.available}
                                    onPress={() => setActiveApp(app.id)}
                                >
                                    {app.cta}
                                </Button>
                            </div>
                        ))}
                    </div>
                    </div>
                )}

                {activeApp === "gomoku" && (
                    <div className="mt-2 flex h-full flex-col space-y-4 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <Button
                                className="no-drag"
                                variant="shadow"
                                startContent={<Undo2 />}
                                onPress={() => setActiveApp(null)}
                            >
                                返回
                            </Button>
                            <div className="text-sm text-default-500">五子棋</div>
                        </div>
                        <div className="flex-1 h-full min-h-0 overflow-hidden rounded-2xl border border-default-200">
                            <GomokuGame />
                        </div>
                    </div>
                )}

                {activeApp === "todo" && (
                    <div className="mt-2 flex h-full flex-col space-y-4 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <Button
                                className="no-drag"
                                variant="shadow"
                                startContent={<Undo2 />}
                                onPress={() => setActiveApp(null)}
                            >
                                返回
                            </Button>
                            <div className="text-sm text-default-500">待办清单</div>
                        </div>
                        <div className="flex-1 h-full min-h-0 overflow-hidden rounded-2xl border border-default-200">
                            <TodoList />
                        </div>
                    </div>
                )}

                {activeApp === "pomodoro" && (
                    <div className="mt-2 flex h-full flex-col space-y-4 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <Button
                                className="no-drag"
                                variant="shadow"
                                startContent={<Undo2 />}
                                onPress={() => setActiveApp(null)}
                            >
                                返回
                            </Button>
                            <div className="text-sm text-default-500">倒计时 / 番茄钟</div>
                        </div>
                        <div className="flex-1 h-full min-h-0 overflow-hidden rounded-2xl border border-default-200">
                            <Pomodoro />
                        </div>
                    </div>
                )}

                {activeApp === "basicPage" && (
                    <div className="mt-2 flex w-full h-full flex-col space-y-4 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <Button
                                className="no-drag"
                                variant="shadow"
                                startContent={<Undo2 />}
                                onPress={() => setActiveApp(null)}
                            >
                                返回
                            </Button>
                            <div className="text-sm text-default-500">基础页面</div>
                        </div>
                        <div className="flex-1 h-full min-h-0 overflow-hidden rounded-2xl border border-default-200">
                            <BasePage
                                title="基础页面"
                                header={<Button size="sm" variant="flat" className="app-nodrag">示例按钮</Button>}
                            >
                                <div className="p-6 text-default-600">这里是基础页面内容区域。</div>
                            </BasePage>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;