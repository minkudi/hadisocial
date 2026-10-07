// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Bank Group",
  description: "HADI SOCIAL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
