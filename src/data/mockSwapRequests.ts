import type { SwapRequest } from "@/types/swapRequest";

export const mockSwapRequests: SwapRequest[] = [
    {
        id: 1,
        employee: "Aung Ko Ko Khant",
        date: "2026-09-16",
        time: "17:00 – 22:00",
        reason: "I have a school event.",
        replacementEmployee: "",
        shiftId: 1,
        status: "Pending",
    },
    {
        id: 2,
        employee: "Maria Santos",
        date: "2026-09-20",
        time: "16:00 – 22:00",
        reason: "I need to attend a medical appointment.",
        replacementEmployee: "",
        shiftId: 2,
        status: "Pending",
    },
];
