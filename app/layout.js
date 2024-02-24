import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./components/navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Issue Tracker",
  description: "Web App for Tracking Technical Issues",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />
        <Navbar />
        <main className="p-5 min-h-[90vh]">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
