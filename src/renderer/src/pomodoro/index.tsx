import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, CardBody, Chip, Divider, Input } from "@heroui/react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";

type Mode = "focus" | "short" | "long";

type ModeConfig = {
  label: string;
  minutes: number;
  color: "primary" | "success" | "secondary";
};

const Pomodoro: React.FC = () => {
  const [durations, setDurations] = useState({
    focus: 25,
    short: 5,
    long: 15,
  });
  const [mode, setMode] = useState<Mode>("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [remaining, setRemaining] = useState(durations.focus * 60);

  const modeConfig: Record<Mode, ModeConfig> = {
    focus: { label: "专注", minutes: durations.focus, color: "primary" },
    short: { label: "短休", minutes: durations.short, color: "success" },
    long: { label: "长休", minutes: durations.long, color: "secondary" },
  };

  useEffect(() => {
    setRemaining(modeConfig[mode].minutes * 60);
    setIsRunning(false);
  }, [mode, durations]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning]);

  const progress = useMemo(() => {
    const total = modeConfig[mode].minutes * 60;
    return total === 0 ? 0 : Math.round(((total - remaining) / total) * 100);
  }, [mode, remaining]);

  const formatted = useMemo(() => {
    const minutes = Math.floor(remaining / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (remaining % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [remaining]);

  const updateDuration = (target: Mode, value: string) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) return;
    const next = Math.min(Math.max(parsed, 1), 180);
    setDurations(prev => ({ ...prev, [target]: next }));
  };

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <Card className="w-full max-w-2xl border border-default-200 shadow-sm">
        <CardBody className="gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-default-600">
              <Timer className="h-5 w-5" />
              <span className="text-base font-medium">倒计时 / 番茄钟</span>
            </div>
            <Chip color={modeConfig[mode].color} variant="flat">
              {modeConfig[mode].label}
            </Chip>
          </div>

          <div className="rounded-2xl border border-default-200 bg-content1 p-6 text-center">
            <div className="text-5xl font-semibold text-default-800 sm:text-6xl">
              {formatted}
            </div>
            <div className="mt-3 text-sm text-default-500">进度 {progress}%</div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Button
              variant={mode === "focus" ? "shadow" : "flat"}
              color="primary"
              onPress={() => setMode("focus")}
            >
              专注 25 分钟
            </Button>
            <Button
              variant={mode === "short" ? "shadow" : "flat"}
              color="success"
              onPress={() => setMode("short")}
            >
              短休 5 分钟
            </Button>
            <Button
              variant={mode === "long" ? "shadow" : "flat"}
              color="secondary"
              onPress={() => setMode("long")}
            >
              长休 15 分钟
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              label="专注时长（分钟）"
              labelPlacement="outside"
              type="number"
              min={1}
              max={180}
              value={String(durations.focus)}
              onValueChange={(value) => updateDuration("focus", value)}
              variant="bordered"
              size="sm"
              className="min-w-0"
            />
            <Input
              label="短休时长（分钟）"
              labelPlacement="outside"
              type="number"
              min={1}
              max={60}
              value={String(durations.short)}
              onValueChange={(value) => updateDuration("short", value)}
              variant="bordered"
              size="sm"
              className="min-w-0"
            />
            <Input
              label="长休时长（分钟）"
              labelPlacement="outside"
              type="number"
              min={1}
              max={120}
              value={String(durations.long)}
              onValueChange={(value) => updateDuration("long", value)}
              variant="bordered"
              size="sm"
              className="min-w-0"
            />
          </div>

          <Divider />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              color="primary"
              startContent={isRunning ? <Pause size={18} /> : <Play size={18} />}
              onPress={() => setIsRunning(prev => !prev)}
            >
              {isRunning ? "暂停" : "开始"}
            </Button>
            <Button
              variant="flat"
              startContent={<RotateCcw size={18} />}
              onPress={() => {
                setRemaining(modeConfig[mode].minutes * 60);
                setIsRunning(false);
              }}
            >
              重置
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Pomodoro;
