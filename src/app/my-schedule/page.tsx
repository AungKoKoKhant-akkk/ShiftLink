"use client";

import StatusBadge from "@/components/StatusBadge";
import {  useState } from "react";
import { Repeat2 } from "lucide-react";
import type { Shift } from "@/types/shift";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import { useFeedback } from "@/components/providers/FeedbackProvider";
import { useShiftLink } from "@/components/providers/ShiftLinkProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";

type MyShift = Shift & {
    day: string;
    displayStatus: Shift["status"] | "Rejected";
};


export default function MySchedulePage() {
    const { shifts, swapRequests, currentUser, requestSwap, isLoadingShifts } = useShiftLink();
    const {notify} = useFeedback();
    const { language, t } = useLanguage();
    const [isSubmitting , setIsSubmitting] = useState(false);


    const latestSwapByShiftId = new Map<number, (typeof swapRequests)[number]>();

    for (const request of swapRequests) {
        if (!latestSwapByShiftId.has(request.shiftId)) {
            latestSwapByShiftId.set(request.shiftId, request);
        }
    }

    const myShifts: MyShift[] = shifts
        .filter((shift) => shift.employee === currentUser?.name)
        .map((shift) => {
            const latestSwap = latestSwapByShiftId.get(shift.id);

            const displayStatus: MyShift["displayStatus"] =
                latestSwap?.status === "Pending"
                    ? "Swap Requested"
                    : latestSwap?.status === "Rejected"
                        ? "Rejected"
                        : shift.status;

            return {
                ...shift,
                day: new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "en-US", { weekday: "long", timeZone: "UTC" }).format(new Date(`${shift.date}T00:00:00Z`)),
                displayStatus,
            };
        })
        .sort(
            (a, b) =>
                a.date.localeCompare(b.date) ||
                a.time.localeCompare(b.time)
        );




    const [selectedShift, setSelectedShift] =
        useState<MyShift | null>(null);

    const [swapReason, setSwapReason] = useState("");


    async function handleSubmitSwapRequest() {
        if (!selectedShift || isSubmitting) return;

        if (!swapReason.trim()) {
            notify(t("enterReason"), "error");
            return;
        }

        setIsSubmitting(true);

        try {
            await requestSwap(selectedShift.id, swapReason.trim());

            notify(t("swapSubmitted"));
            setSelectedShift(null);
            setSwapReason("");
        } catch (error) {
            notify(
                error instanceof Error
                    ? error.message
                    : t("swapSubmitFailed"),
                "error"
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <PageHeader
                title={t("mySchedule")}
                description={t("myScheduleDescription")}
            />

            <div className="mt-8 overflow-x-auto rounded-box bg-base-100 shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>{t("date")}</th><th>{t("day")}</th><th>{t("shiftTime")}</th>
                            <th>{t("break")}</th><th>{t("workingHours")}</th><th>{t("status")}</th><th>{t("action")}</th>
                        </tr>
                    </thead>

                    <tbody>

                    {isLoadingShifts ? (
                        <tr>
                            <td colSpan={7} className="py-10 text-center">
                                <span className="loading loading-spinner loading-sm" />
                                <span className="ml-2">{t("loadingShifts")}</span>
                            </td>
                        </tr>
                    ) : myShifts.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="py-10 text-center text-base-content/60">
                                {t("noShiftsScheduled")}
                            </td>
                        </tr>
                    ) : (
                        myShifts.map((shift) => {
                        

                        return (
                            <tr key={shift.id}>
                                <td>{shift.date}</td>
                                <td>{shift.day}</td>
                                <td className="font-medium">{shift.time}</td>
                                <td>{shift.breakMinutes} {t("minutesShort")}</td>
                                <td>{shift.hours} {t("hoursShort")}</td>

                                <td>
                                    <StatusBadge status={shift.displayStatus} />
                                </td>

                                <td>
                                    <button
                                        className="btn btn-outline btn-primary btn-sm"
                                        disabled={shift.displayStatus === "Swap Requested"}
                                        onClick={() => setSelectedShift(shift)}
                                    >
                                        <Repeat2 size={16} />
                                        {shift.displayStatus === "Rejected"
                                            ? t("requestAgain")
                                            : t("requestSwap")}
                                    </button>
                                </td>
                            </tr>
                        );
                        })
                    )}
                    </tbody>
                </table>
            </div>

            {selectedShift && (
                <Modal className="max-w-xl p-7">
                    <h2 className="text-2xl font-bold">{t("requestShiftSwap")}</h2>

                    <p className="mt-1 text-sm text-base-content/60">
                        {t("sendManagerApproval")}
                    </p>

                    <div className="mt-6 rounded-box border border-base-300 bg-base-200 p-4">
                        <p className="font-semibold">{selectedShift.date}</p>

                        <p className="mt-1 text-sm text-base-content/70">
                            {selectedShift.day} · {selectedShift.time}
                        </p>

                        <p className="mt-2 text-sm text-base-content/70">
                            {t("workingHours")}: {selectedShift.hours} {t("hoursShort")}
                        </p>
                    </div>

                    <div className="mt-6">
                        <label
                            htmlFor="swap-reason"
                            className="mb-2 block text-sm font-medium"
                        >
                            {t("reason")}
                        </label>

                        <textarea
                            id="swap-reason"
                            className="textarea textarea-bordered h-28 w-full"
                            placeholder={t("reasonPlaceholder")}
                            value={swapReason}
                            onChange={(e) => setSwapReason(e.target.value)}
                        />
                    </div>

                    <div className="modal-action mt-7">
                        <button
                            className="btn"
                            disabled={isSubmitting}
                            onClick={() => {
                                setSelectedShift(null);
                                setSwapReason("");
                            }}
                        >
                            {t("cancel")}
                        </button>

                        <button
                            className="btn btn-primary"
                            disabled={isSubmitting}
                            onClick={handleSubmitSwapRequest}
                        >
                            {isSubmitting ? t("submitting") : t("submitRequest")}
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}
