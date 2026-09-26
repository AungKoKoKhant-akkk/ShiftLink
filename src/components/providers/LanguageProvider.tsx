"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Language = "en" | "ja";

const en = {
  dashboard: "Dashboard", employees: "Employees", shiftCalendar: "Shift Calendar", shiftManagement: "Shift Management",
  mySchedule: "My Schedule", studentHours: "Student Hours", swapRequests: "Swap Requests", logout: "Logout",
  signedInUser: "Signed-in user", admin: "Admin", manager: "Manager", user: "User",
  loginDescription: "Sign in to manage your schedule.", employeeCode: "Employee code", password: "Password",
  signIn: "Sign in", signingIn: "Signing in...", loginFailed: "Login failed. Please try again.",
  welcome: "Welcome to ShiftLink", addShift: "Add Shift", editShift: "Edit Shift", updateShift: "Update Shift",
  totalEmployees: "Total Employees", activeEmployees: "Active employees", studentEmployees: "Student Employees",
  trackingEnabled: "28-hour tracking enabled", thisMonthShifts: "This Month Shifts", openSwapRequests: "Open Swap Requests",
  approvalNeeded: "Manager approval needed", shiftOverview: "Shift Overview", studentHoursAlerts: "Student Hours Alerts",
  studentsNearLimit: "Students near the 28-hour limit", noStudentsNearLimit: "No students are near the weekly limit.",
  weeklyLimitExceeded: "Weekly limit exceeded", hoursRemaining: "{hours} hours remaining", viewAllStudentHours: "View all student hours",
  calendarDescription: "View all employee shifts by date.", today: "Today",
  shiftManagementDescription: "Create and manage employee shifts.", date: "Date", employee: "Employee", type: "Type",
  shiftTime: "Shift Time", break: "Break", workingHours: "Working Hours", status: "Status", action: "Action", actions: "Actions",
  minutesShort: "min", hoursShort: "h", selectEmployee: "Select an employee", employeeType: "Employee Type",
  startTime: "Start Time", endTime: "End Time", breakMinutes: "Break Time (minutes)", cancel: "Cancel",
  fillAllFields: "Please fill in all fields.", invalidBreak: "Break time must be non-negative and shorter than the shift duration.",
  shiftUpdated: "Shift updated.", shiftAdded: "Shift added.", shiftSaveFailed: "Failed to save shift.",
  deleteShiftConfirm: "Are you sure you want to delete this shift?", shiftDeleted: "Shift deleted.", shiftDeleteFailed: "Failed to delete shift.",
  myScheduleDescription: "View your upcoming shifts and working hours.", day: "Day", loadingShifts: "Loading shifts...",
  noShiftsScheduled: "No shifts scheduled.", requestAgain: "Request Again", requestSwap: "Request Swap",
  requestShiftSwap: "Request Shift Swap", sendManagerApproval: "Send a request to your manager for approval.",
  reason: "Reason", reasonPlaceholder: "Example: I have a school event.", submitting: "Submitting...", submitRequest: "Submit Request",
  enterReason: "Please enter a reason.", swapSubmitted: "Swap request submitted.", swapSubmitFailed: "Failed to submit swap request.",
  studentHoursDescription: "Monitor student work hours for the 28-hour rule.", currentMonitoringPeriod: "Current monitoring period",
  rollingSevenDays: "Rolling 7-day work-hour calculation", limitHours: "Limit: {hours} hours", safe: "Safe", nearLimit: "Near limit", overLimit: "Over limit",
  swapRequestsDescription: "Review and manage employee shift swap requests.", pendingRequest: "{count} pending swap request",
  pendingRequests: "{count} pending swap requests", reviewRequest: "Review and approve or reject it.", reviewNow: "Review now",
  all: "All", pending: "Pending", approved: "Approved", rejected: "Rejected", replacementEmployee: "Replacement Employee",
  managerAction: "Manager Action", loadingSwapRequests: "Loading swap requests...", noSwapRequests: "No {status} swap requests.",
  approve: "Approve", reject: "Reject", processing: "Processing...", completed: "Completed",
  selectReplacementFirst: "Please select a replacement employee first.", swapApproved: "Swap request approved.",
  swapRejected: "Swap request rejected.", swapApproveFailed: "Failed to approve swap request.", swapRejectFailed: "Failed to reject swap request.",
  employeesDescription: "Manage employee profiles and work types.", addEmployee: "Add Employee", editEmployee: "Edit Employee",
  updateEmployee: "Update Employee", saveEmployee: "Save Employee", employeeName: "Employee Name", department: "Department",
  searchEmployee: "Search by name or employee code", allTypes: "All Types", student: "Student", regular: "Regular",
  active: "Active", inactive: "Inactive", initialPassword: "Initial Password", systemRole: "System Role",
  enterEmployeeName: "Enter employee name", employeeCodeExample: "Example: STU001", departmentExample: "Example: Restaurant Service",
  setInitialPassword: "Set an initial password", keepCurrentPassword: "Leave blank to keep the current password",
  employeeUpdated: "Employee updated.", employeeAdded: "Employee added.", employeeSaveFailed: "Failed to save employee.",
  deleteEmployeeConfirm: "Are you sure you want to delete this employee?", employeeDeleted: "Employee deleted.", employeeDeleteFailed: "Failed to delete employee.",
  scheduled: "Scheduled", swapRequested: "Swap Requested", edit: "Edit", delete: "Delete", pleaseConfirm: "Please confirm",
} as const;

export type TranslationKey = keyof typeof en;

const ja: Record<TranslationKey, string> = {
  dashboard: "ダッシュボード", employees: "従業員", shiftCalendar: "シフトカレンダー", shiftManagement: "シフト管理",
  mySchedule: "マイスケジュール", studentHours: "学生の勤務時間", swapRequests: "シフト交換申請", logout: "ログアウト",
  signedInUser: "ログインユーザー", admin: "管理者", manager: "マネージャー", user: "ユーザー",
  loginDescription: "ログインしてスケジュールを管理します。", employeeCode: "従業員コード", password: "パスワード",
  signIn: "ログイン", signingIn: "ログイン中...", loginFailed: "ログインに失敗しました。もう一度お試しください。",
  welcome: "ShiftLinkへようこそ", addShift: "シフト追加", editShift: "シフト編集", updateShift: "シフト更新",
  totalEmployees: "従業員数", activeEmployees: "在籍中の従業員", studentEmployees: "学生従業員",
  trackingEnabled: "28時間制限を追跡中", thisMonthShifts: "今月のシフト", openSwapRequests: "未対応の交換申請",
  approvalNeeded: "マネージャーの承認が必要", shiftOverview: "シフト概要", studentHoursAlerts: "学生の勤務時間アラート",
  studentsNearLimit: "28時間の上限に近い学生", noStudentsNearLimit: "週間上限に近い学生はいません。",
  weeklyLimitExceeded: "週間上限を超えています", hoursRemaining: "残り{hours}時間", viewAllStudentHours: "学生の勤務時間をすべて表示",
  calendarDescription: "日付ごとに全従業員のシフトを確認します。", today: "今日",
  shiftManagementDescription: "従業員のシフトを作成・管理します。", date: "日付", employee: "従業員", type: "種別",
  shiftTime: "シフト時間", break: "休憩", workingHours: "勤務時間", status: "ステータス", action: "操作", actions: "操作",
  minutesShort: "分", hoursShort: "時間", selectEmployee: "従業員を選択", employeeType: "従業員種別",
  startTime: "開始時刻", endTime: "終了時刻", breakMinutes: "休憩時間（分）", cancel: "キャンセル",
  fillAllFields: "すべての項目を入力してください。", invalidBreak: "休憩時間は0以上で、シフト時間より短くしてください。",
  shiftUpdated: "シフトを更新しました。", shiftAdded: "シフトを追加しました。", shiftSaveFailed: "シフトを保存できませんでした。",
  deleteShiftConfirm: "このシフトを削除しますか？", shiftDeleted: "シフトを削除しました。", shiftDeleteFailed: "シフトを削除できませんでした。",
  myScheduleDescription: "今後のシフトと勤務時間を確認します。", day: "曜日", loadingShifts: "シフトを読み込み中...",
  noShiftsScheduled: "予定されているシフトはありません。", requestAgain: "再申請", requestSwap: "交換を申請",
  requestShiftSwap: "シフト交換を申請", sendManagerApproval: "マネージャーへ承認申請を送信します。",
  reason: "理由", reasonPlaceholder: "例：学校行事があります。", submitting: "送信中...", submitRequest: "申請を送信",
  enterReason: "理由を入力してください。", swapSubmitted: "交換申請を送信しました。", swapSubmitFailed: "交換申請を送信できませんでした。",
  studentHoursDescription: "学生の勤務時間を28時間ルールに基づいて確認します。", currentMonitoringPeriod: "現在の確認期間",
  rollingSevenDays: "連続する7日間の勤務時間", limitHours: "上限：{hours}時間", safe: "安全", nearLimit: "上限間近", overLimit: "上限超過",
  swapRequestsDescription: "従業員のシフト交換申請を確認・管理します。", pendingRequest: "未対応の交換申請：{count}件",
  pendingRequests: "未対応の交換申請：{count}件", reviewRequest: "内容を確認して承認または却下してください。", reviewNow: "今すぐ確認",
  all: "すべて", pending: "保留中", approved: "承認済み", rejected: "却下済み", replacementEmployee: "交代する従業員",
  managerAction: "マネージャー操作", loadingSwapRequests: "交換申請を読み込み中...", noSwapRequests: "{status}の交換申請はありません。",
  approve: "承認", reject: "却下", processing: "処理中...", completed: "完了",
  selectReplacementFirst: "交代する従業員を先に選択してください。", swapApproved: "交換申請を承認しました。",
  swapRejected: "交換申請を却下しました。", swapApproveFailed: "交換申請を承認できませんでした。", swapRejectFailed: "交換申請を却下できませんでした。",
  employeesDescription: "従業員情報と勤務種別を管理します。", addEmployee: "従業員を追加", editEmployee: "従業員を編集",
  updateEmployee: "従業員を更新", saveEmployee: "従業員を保存", employeeName: "従業員名", department: "部署",
  searchEmployee: "氏名または従業員コードで検索", allTypes: "すべての種別", student: "学生", regular: "一般",
  active: "在籍", inactive: "退職", initialPassword: "初期パスワード", systemRole: "システム権限",
  enterEmployeeName: "従業員名を入力", employeeCodeExample: "例：STU001", departmentExample: "例：レストランサービス",
  setInitialPassword: "初期パスワードを設定", keepCurrentPassword: "現在のパスワードを維持する場合は空欄",
  employeeUpdated: "従業員情報を更新しました。", employeeAdded: "従業員を追加しました。", employeeSaveFailed: "従業員情報を保存できませんでした。",
  deleteEmployeeConfirm: "この従業員を削除しますか？", employeeDeleted: "従業員を削除しました。", employeeDeleteFailed: "従業員を削除できませんでした。",
  scheduled: "予定", swapRequested: "交換申請中", edit: "編集", delete: "削除", pleaseConfirm: "確認してください",
};

const translations: Record<Language, Record<TranslationKey, string>> = { en, ja };
type Parameters = Record<string, string | number>;
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (key: TranslationKey, parameters?: Parameters) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ja");
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const value = useMemo<LanguageContextValue>(() => ({
    language, setLanguage,
    t: (key, parameters) => Object.entries(parameters ?? {}).reduce(
      (message, [name, replacement]) => message.replaceAll(`{${name}}`, String(replacement)), translations[language][key]
    ),
  }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
