import type { Metadata } from "next";
import { LanguageProvider } from "@/components/language-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "نور القرآن | Noor-ul-Quran",
  description: "مدرسہ مینجمنٹ، قرآن تعلیم اور اسلامی تربیت",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ur" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Source+Sans+3:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
