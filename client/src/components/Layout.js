// Removed unused Navbar import
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
