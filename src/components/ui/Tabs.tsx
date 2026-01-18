import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
    value: string;
    onValueChange: (val: string) => void;
    children: React.ReactNode;
    className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
    return (
        <div className={cn("w-full flex flex-col", className)}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { selectedValue: value, onValueChange } as any);
                }
                return child;
            })}
        </div>
    );
}

export function TabsList({ className, children, selectedValue, onValueChange }: any) {
    return (
        <div className={cn("flex space-x-1 rounded-lg bg-white/5 p-1 border border-white/10", className)}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { selectedValue, onSelect: onValueChange } as any);
                }
                return child;
            })}
        </div>
    )
}

export function TabsTrigger({ className, value, children, selectedValue, onSelect }: any) {
    const isSelected = selectedValue === value;
    return (
        <button
            onClick={() => onSelect(value)}
            className={cn(
                "flex-1 items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isSelected ? "bg-primary text-black shadow-sm font-bold" : "text-muted-foreground hover:bg-white/5 hover:text-white",
                className
            )}
        >
            {children}
        </button>
    )
}

export function TabsContent({ className, value, selectedValue, children }: any) {
    if (value !== selectedValue) return null;
    return (
        <div
            className={cn(
                "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-in fade-in zoom-in-95 duration-200",
                className
            )}
        >
            {children}
        </div>
    )
}
