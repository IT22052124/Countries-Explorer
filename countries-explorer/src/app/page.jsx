import Navbar from "@/components/Navbar";
import CountryList from "@/components/CountryList";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <CountryList />
      </main>
      <Footer />
    </div>
  );
}
