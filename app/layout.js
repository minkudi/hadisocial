// app/layout.js
import "./globals.css";

export const metadata = {
  title: "SCAP BEN",
  description: "SCAP BEN",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
