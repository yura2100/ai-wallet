"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, MessageSquare } from "lucide-react";
import type React from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import { ClientOnly } from "@/components/client-only";
import { StoreProvider } from "@/store/store-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          {pathname === "/" ? "Your Portfolio" : "AI Assistant"}
        </h1>
        <div className="space-x-4">
          <Button asChild variant={pathname === "/" ? "default" : "ghost"}>
            <Link href="/" className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Portfolio</span>
            </Link>
          </Button>
          <Button asChild variant={pathname === "/chat" ? "default" : "ghost"}>
            <Link href="/chat" className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>AI Chat</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-background text-foreground">
          <NavBar />
          <main className="container mx-auto px-4 py-8">
            <QueryClientProvider client={new QueryClient()}>
              <StoreProvider>
                <ClientOnly>{children}</ClientOnly>
              </StoreProvider>
            </QueryClientProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
