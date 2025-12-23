"use client";

import * as React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { calculateLifeData, LifeData, ViewMode, TimeUnit } from "@/lib/calculator";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MemorableDate {
    id: string;
    date: Date;
    label: string;
    color: string;
}

const PRESET_COLORS = [
    "#ef4444", // Red
    "#f97316", // Orange
    "#eab308", // Yellow
    "#22c55e", // Green
    "#06b6d4", // Cyan
    "#3b82f6", // Blue
    "#a855f7", // Purple
    "#ec4899", // Pink
];

export function LifeDashboard() {
    const [birthDate, setBirthDate] = React.useState<Date | undefined>(undefined);
    const [viewMode, setViewMode] = React.useState<ViewMode>("weeks");
    const [memorableDates, setMemorableDates] = React.useState<MemorableDate[]>([]);

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [newDate, setNewDate] = React.useState<Date | undefined>(undefined);
    const [newLabel, setNewLabel] = React.useState("");
    const [newColor, setNewColor] = React.useState(PRESET_COLORS[0]);

    const data = React.useMemo(() => {
        if (!birthDate) return null;
        return calculateLifeData(birthDate, viewMode);
    }, [birthDate, viewMode]);

    const addMemorableDate = () => {
        if (!newDate || !newLabel) return;

        if (editingId) {
            setMemorableDates(prev => prev.map(d => d.id === editingId ? {
                ...d,
                date: newDate,
                label: newLabel,
                color: newColor
            } : d));
        } else {
            setMemorableDates(prev => [...prev, {
                id: Math.random().toString(36).substr(2, 9),
                date: newDate,
                label: newLabel,
                color: newColor
            }]);
        }

        closeDialog();
    };

    const editDate = (date: MemorableDate) => {
        setEditingId(date.id);
        setNewDate(date.date);
        setNewLabel(date.label);
        setNewColor(date.color);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingId(null);
        setNewDate(undefined);
        setNewLabel("");
        setNewColor(PRESET_COLORS[0]);
    };

    const removeDate = (id: string) => {
        setMemorableDates(prev => prev.filter(d => d.id !== id));
    };

    return (
        <div className="container mx-auto p-4 max-w-[1400px] animate-in fade-in duration-500">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-end justify-between">
                <div className="space-y-4 w-full md:w-auto">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-1">Life Calendar</h1>
                        <p className="text-muted-foreground text-sm">Visualize your life in blocks.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !birthDate && "text-muted-foreground"
                                    )}
                                >
                                    {birthDate ? (
                                        format(birthDate, "PPP", { locale: ru })
                                    ) : (
                                        <span>Выберите дату рождения</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={birthDate}
                                    onSelect={setBirthDate}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                    captionLayout="dropdown"
                                    fromYear={1900}
                                    toYear={new Date().getFullYear()}
                                />
                            </PopoverContent>
                        </Popover>

                        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                            <TabsList>
                                <TabsTrigger value="weeks">Weeks</TabsTrigger>
                                <TabsTrigger value="months">Months</TabsTrigger>
                                <TabsTrigger value="years">Years</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && closeDialog()}>
                            <DialogTrigger asChild>
                                <Button variant="secondary" className="gap-2" onClick={() => {
                                    setEditingId(null); // Ensure add mode
                                    setNewDate(undefined);
                                    setNewLabel("");
                                    setNewColor(PRESET_COLORS[0]);
                                    setIsDialogOpen(true);
                                }}>
                                    <Plus className="h-4 w-4" />
                                    Памятная дата
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingId ? "Редактировать событие" : "Добавить памятную дату"}</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label>Название</Label>
                                        <Input
                                            value={newLabel}
                                            onChange={(e) => setNewLabel(e.target.value)}
                                            placeholder="Например: Свадьба, Переезд..."
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Дата</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className={cn("justify-start text-left font-normal", !newDate && "text-muted-foreground")}>
                                                    {newDate ? format(newDate, "PPP", { locale: ru }) : "Выберите дату"}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar mode="single" selected={newDate} onSelect={setNewDate} initialFocus captionLayout="dropdown" fromYear={1900} toYear={2100} />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Цвет</Label>
                                        <div className="flex gap-2 flex-wrap">
                                            {PRESET_COLORS.map(c => (
                                                <button
                                                    key={c}
                                                    className={cn(
                                                        "w-8 h-8 rounded-full border-2 transition-all",
                                                        newColor === c ? "border-slate-900 scale-110" : "border-transparent"
                                                    )}
                                                    style={{ backgroundColor: c }}
                                                    onClick={() => setNewColor(c)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <Button onClick={addMemorableDate} disabled={!newDate || !newLabel}>
                                        {editingId ? "Сохранить" : "Добавить"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats Summary */}
                {data && (
                    <div className="flex gap-6 text-sm text-muted-foreground mr-6">
                        <div>
                            <span className="block font-bold text-xl text-foreground">{data.ageYears}</span>
                            лет
                        </div>
                        <div>
                            <span className="block font-bold text-xl text-foreground">{data.percentage}%</span>
                            прожито
                        </div>
                        <div>
                            <span className="block font-bold text-xl text-foreground">{memorableDates.length}</span>
                            событий
                        </div>
                    </div>
                )}
            </div>

            {/* Grid Container */}
            <div className="w-full overflow-x-auto pb-10">
                {data ? (
                    <div
                        className="grid gap-[2px] mx-auto min-w-[800px]"
                        style={{
                            gridTemplateColumns: viewMode === 'weeks'
                                ? `repeat(52, minmax(0, 1fr))`
                                : viewMode === 'months'
                                    ? `repeat(36, minmax(0, 1fr))` // 3 years per row for months looks decent? or 12? 
                                    : `repeat(10, minmax(0, 1fr))` // 10 years per row
                        }}
                    >
                        {/* If months, 12 per row is better for readability usually, let's stick to standard */}
                        {/* Wait, user asked for Unified Block 52*80 for weeks. 
                 For months, 12*80 is tall. Maybe 24 or 36 columns?
                 Let's do 12 for months for clarity.
             */}
                        <style jsx>{`
               .life-grid-weeks { grid-template-columns: repeat(52, minmax(0, 1fr)); }
               .life-grid-months { grid-template-columns: repeat(36, minmax(0, 1fr)); } /* 3 years per row */
               .life-grid-years { grid-template-columns: repeat(20, minmax(0, 1fr)); } /* 20 years per row */
             `}</style>

                        {data.units.map((unit) => {
                            // Find overlapping memorable date
                            // Overlap: memorable date falls within startDate and endDate of unit
                            const memDate = memorableDates.find(d =>
                                d.date >= unit.startDate && d.date <= unit.endDate
                            );

                            return (
                                <UnitCell
                                    key={unit.index}
                                    unit={unit}
                                    memDate={memDate}
                                    mode={viewMode}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 text-muted-foreground bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed">
                        Выберите дату рождения, чтобы увидеть визуализацию
                    </div>
                )}
            </div>

            {/* Legend for Memorable Dates */}
            {memorableDates.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                    {memorableDates.map(d => (
                        <div key={d.id} className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs group">
                            <div
                                className="w-3 h-3 rounded-full cursor-pointer hover:scale-110 transition-transform"
                                style={{ backgroundColor: d.color }}
                                onClick={() => editDate(d)}
                                title="Edit Color"
                            />
                            <span
                                className="cursor-pointer hover:underline underline-offset-2"
                                onClick={() => editDate(d)}
                            >
                                {d.label}
                            </span>
                            <span className="text-muted-foreground opacity-50">|</span>
                            <span className="cursor-pointer" onClick={() => editDate(d)}>{format(d.date, "P", { locale: ru })}</span>

                            <button
                                onClick={() => editDate(d)}
                                className="ml-1 text-muted-foreground hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Edit"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                            </button>

                            <button onClick={() => removeDate(d.id)} className="ml-1 text-muted-foreground hover:text-red-500">
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function UnitCell({ unit, memDate, mode }: { unit: TimeUnit, memDate?: MemorableDate, mode: ViewMode }) {
    const [open, setOpen] = React.useState(false);

    // Dynamic sizing based on mode
    const sizeClass = mode === 'weeks'
        ? "h-[6px] w-[6px]" // Small dots
        : mode === 'months'
            ? "h-3 w-full"
            : "h-6 w-full"; // Years

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                    className={cn(
                        "rounded-[1px] transition-all duration-200 cursor-pointer hover:scale-150 hover:z-10",
                        mode === 'weeks' ? "rounded-full" : "rounded-sm",

                        // Base Color
                        unit.isLived
                            ? "bg-slate-800 dark:bg-slate-400"
                            : "bg-slate-200 dark:bg-slate-800",

                        // Memorable overwrite
                        memDate && "!bg-[var(--mem-color)] shadow-[0_0_5px_var(--mem-color)]",

                        // Current Unit Pulse
                        unit.isCurrent && "bg-blue-500 animate-pulse scale-125 z-10",

                        // Size
                        mode === 'weeks' ? "aspect-square" : "aspect-auto h-3"
                    )}
                    style={memDate ? { "--mem-color": memDate.color } as React.CSSProperties : undefined}
                />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 text-xs" side="top">
                <div className="font-semibold">{memDate ? memDate.label : (unit.isLived ? "Прожито" : "Будущее")}</div>
                <div className="text-muted-foreground">
                    {unit.label} ({unit.startDate.toLocaleDateString()})
                </div>
            </PopoverContent>
        </Popover>
    );
}
