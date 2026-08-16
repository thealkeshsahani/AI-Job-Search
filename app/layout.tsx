import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FloatingChatWidget } from "@/components/assistant/FloatingChatWidget";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Byte Builder AI - Your AI-Powered Career Companion",
  description:
    "Byte Builder AI searches jobs, analyzes your resume, matches you with relevant opportunities in the Indian job market, researches companies, and manages your applications.",
  keywords: [
    "AI Job Search",
    "Career Companion",
    "Indian Job Market",
    "LPA Salary",
    "Resume Analyzer",
    "ATS Score",
    "Kanban Application Tracker",
    "Bangalore Jobs",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 dark:bg-slate-950 light:bg-slate-50 text-slate-100 dark:text-slate-100 light:text-slate-800 font-sans relative transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <AuthGuard>
              {children}
              <FloatingChatWidget />
            </AuthGuard>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
