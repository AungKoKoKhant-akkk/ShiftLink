import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { FeedbackProvider } from "@/components/providers/FeedbackProvider";
import { ShiftLinkProvider } from "@/components/providers/ShiftLinkProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "ShiftLink",
    description: "Shift management application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="ja"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <LanguageProvider>
                    <FeedbackProvider>
                        <ShiftLinkProvider>
                            <AppShell>{children}</AppShell>
                        </ShiftLinkProvider>
                    </FeedbackProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
