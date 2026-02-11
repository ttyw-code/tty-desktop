import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, AlertCircle, Calendar, Star, Layout } from 'lucide-react';
import { Button, Input, Select, SelectItem, Card, CardBody, Chip, Checkbox } from '@heroui/react';

interface Task {
    id: number;
    text: string;
    priority: 'high' | 'medium' | 'low';
    category: 'work' | 'personal' | 'growth';
    completed: boolean;
}
const TodoList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([
    ]);
    const [input, setInput] = useState('');
    const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
    const [category, setCategory] = useState<'work' | 'personal' | 'growth'>('work');

    const addTask = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!input.trim()) return;
        const newTask: Task = {
            id: Date.now(),
            text: input,
            priority,
            category,
            completed: false,
        };
        setTasks([newTask, ...tasks]);
        setInput('');
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const priorityColors = {
        high: 'danger',
        medium: 'warning',
        low: 'primary',
    } as const;

    const categoryIcons = {
        work: <Layout size={14} className="mr-1" />,
        personal: <Star size={14} className="mr-1" />,
        growth: <Calendar size={14} className="mr-1" />,
    };

    const priorityOptions = [
        { key: 'high', label: '高' },
        { key: 'medium', label: '中' },
        { key: 'low', label: '低' },
    ];

    const categoryOptions = [
        { key: 'work', label: '工作' },
        { key: 'personal', label: '个人' },
        { key: 'growth', label: '成长' },
    ];

    return (
        <div className="h-full w-full overflow-auto p-6 font-sans">
            <div className="w-full">
                {/* Header */}
                <header className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-semibold text-default-800">清爽待办清单</h1>
                    <p className="text-default-500">理清思绪，专注当下</p>
                </header>

                {/* Form Container */}
                <Card className="mb-8 border border-default-200 shadow-sm">
                    <CardBody>
                        <form onSubmit={addTask} className="space-y-4">
                            <div className="flex flex-wrap gap-3">
                                <Input
                                    value={input}
                                    onValueChange={setInput}
                                    placeholder="想要完成什么？"
                                    size="lg"
                                    variant="bordered"
                                    className="flex-1"
                                />
                                <Button type="submit" color="primary" size="lg" startContent={<Plus size={18} />}>
                                    添加
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Select
                                    label="优先级"
                                    selectedKeys={[priority]}
                                    onSelectionChange={(keys) => {
                                        const value = Array.from(keys)[0] as 'high' | 'medium' | 'low' | undefined;
                                        if (value) setPriority(value);
                                    }}
                                    variant="bordered"
                                    size="sm"
                                >
                                    {priorityOptions.map(option => (
                                        <SelectItem key={option.key}>{option.label}</SelectItem>
                                    ))}
                                </Select>
                                <Select
                                    label="分类"
                                    selectedKeys={[category]}
                                    onSelectionChange={(keys) => {
                                        const value = Array.from(keys)[0] as 'work' | 'personal' | 'growth' | undefined;
                                        if (value) setCategory(value);
                                    }}
                                    variant="bordered"
                                    size="sm"
                                >
                                    {categoryOptions.map(option => (
                                        <SelectItem key={option.key}>{option.label}</SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </form>
                    </CardBody>
                </Card>

                {/* Task List */}
                <div className="h-[270px] space-y-3 overflow-y-auto pr-1">
                    {tasks.length === 0 ? (
                        <Card className="border border-default-200 shadow-none">
                            <CardBody className="py-12 text-center text-default-400">
                                <div className="mb-4 flex justify-center">
                                    <CheckCircle size={48} className="opacity-20" />
                                </div>
                                <p>恭喜！目前没有任何待办任务</p>
                            </CardBody>
                        </Card>
                    ) : (
                        tasks.map(task => (
                            <Card key={task.id} className={`border border-default-200 shadow-sm ${task.completed ? 'opacity-70' : ''}`}>
                                <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <Checkbox
                                        isSelected={task.completed}
                                        onValueChange={() => toggleTask(task.id)}
                                        className="items-start"
                                    >
                                        <div>
                                            <p className={`font-medium ${task.completed ? 'line-through text-default-400' : 'text-default-700'}`}>
                                                {task.text}
                                            </p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <Chip
                                                    size="sm"
                                                    variant="flat"
                                                    color={priorityColors[task.priority as keyof typeof priorityColors]}
                                                    startContent={<AlertCircle size={12} />}
                                                >
                                                    {task.priority}
                                                </Chip>
                                                <Chip
                                                    size="sm"
                                                    variant="flat"
                                                    startContent={categoryIcons[task.category as keyof typeof categoryIcons]}
                                                >
                                                    {task.category}
                                                </Chip>
                                            </div>
                                        </div>
                                    </Checkbox>
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        color="danger"
                                        onPress={() => deleteTask(task.id)}
                                        aria-label="删除任务"
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </CardBody>
                            </Card>
                        ))
                    )}
                </div>

                {/* Footer Info */}
                <footer className="mt-12 text-center text-xs text-default-400">
                    <p>建议：每天只标记 3 个高优先级任务</p>
                </footer>
            </div>
        </div>
    );
};

export default TodoList;