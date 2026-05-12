import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "School ERP",
  description: "Enterprise school management ERP platform"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem("school-erp.theme") || "dark";
                document.documentElement.classList.toggle("dark", theme === "dark");
                document.documentElement.style.colorScheme = theme;
              } catch (_) {}
            `
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
