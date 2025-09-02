import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";


// clerk provider..
import {
  ClerkProvider,
} from '@clerk/nextjs'

// store!!!
import Providers from "@/store/provider";

// toasster
import { Toaster } from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"], // Add weights as needed
});

export const metadata: Metadata = {
  title: "Quizzy",
  description: "An Ai - Adaptive Quiz Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster
              position="bottom-right"
              toastOptions={{
                // Default styles for all toasts
                style: {
                  background: "rgb(3,8,22)", // slate-800
                  color: "#f8fafc", // slate-50
                  borderRadius: "12px",
                  padding: "10px 10px",
                  fontSize: "13px",
                  border: "1px solid #334155", // slate-700
                },

                // Success-specific
                success: {
                  style: {
                    color: "#ecfdf5",
                  },
                  iconTheme: {
                    primary: "#10b981", // emerald
                    secondary: "#fff",
                  },
                },

                // Error-specific
                error: {
                  style: {
                    color: "#fee2e2",
                  },
                  iconTheme: {
                    primary: "#ef4444", // red
                    secondary: "#fff",
                  },
                },
              }}
            />
        </Providers>
      </body>
    </html>
  </ClerkProvider>
  );
}
