import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { BearPet } from "@/components/BearPet";
import "./globals.css";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LIFT SOC | RHUL Lifting Society",
  description:
    "Royal Holloway Lifting Society. Powerlifting, bodybuilding, calisthenics and socials in Egham, Surrey. Group sessions every Monday and Friday at the RHUL gym.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${anton.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {children}
        <BearPet />
      </body>
    </html>
  );
}
