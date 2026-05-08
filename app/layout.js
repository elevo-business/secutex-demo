import "./globals.css";

export const metadata = {
  title: "Angebotsbearbeitung — Funktionsdemo",
  description: "Funktionsdemo der Angebotsautomatisierung für Polyurea und Polyurethan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
