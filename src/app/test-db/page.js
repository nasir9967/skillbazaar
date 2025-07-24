import { connectDB } from "@/app/lib/mongodb";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default async function TestDB() {
  await connectDB();

  return (
    <>
      <Header />
      <div className="p-5 text-green-600 font-bold min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Database Connection Test</h1>
          <p className="text-xl">✅ MongoDB Connected Successfully!</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
