import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Header } from "./components/Layout/Header";
import { Footer } from "./components/Layout/Footer";
import { HomePage } from "./components/Pages/5-Home/HomePage";
import { CatalogPage } from "./components/Pages/4-Catalog/CatalogPage";
import { ProductDetailPage } from "./components/Pages/7-ProductDetail/ProductDetailPage";
import { CartPage } from "./components/Pages/3-Cart/CartPage";
import { LoginPage } from "./components/Pages/6-Login/LoginPage";
import { RegisterPage } from "./components/Pages/8-Register/RegisterPage";
import { BlogPage } from "./components/Pages/2-Blog/BlogPage";
import { ContactPage } from "./components/Pages/9-Contact/ContactPage";
import { AdminPage } from "./components/Pages/1-Admin/AdminPage";
import { useState } from "react";
import { BlogDetail } from "./components/Pages/2-Blog/Post/BlogDetail";

type PageType =
  | "home"
  | "catalog"
  | "product-detail"
  | "cart"
  | "login"
  | "register"
  | "blog"
  | "blog-detail"
  | "contact"
  | "admin";

interface NavigationState {
  page: PageType;
  data?: any;
}

export default function App() {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    page: "home",
  });

  const handleNavigate = (page: string, data?: any) => {
    setNavigationState({ page: page as PageType, data });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (navigationState.page) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "catalog":
        return (
          <CatalogPage
            onNavigate={handleNavigate}
            initialData={navigationState.data}
          />
        );
      case "product-detail":
        return (
          <ProductDetailPage
            productId={navigationState.data?.productId}
            onNavigate={handleNavigate}
          />
        );
      case "cart":
        return <CartPage onNavigate={handleNavigate} />;
      case "login":
        return <LoginPage onNavigate={handleNavigate} />;
      case "register":
        return <RegisterPage onNavigate={handleNavigate} />;
      case "blog":
        return <BlogPage onNavigate={handleNavigate} />;
      case "blog-detail":
        return (
          <BlogDetail
            post={navigationState.data}
            onBack={() => handleNavigate("blog")}
          />
        );
      case "contact":
        return <ContactPage />;
      case "admin":
        return <AdminPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-black text-white">
          <Header
            onNavigate={handleNavigate}
            currentPage={navigationState.page}
          />
          <main className="flex-1">{renderPage()}</main>
          <Footer />
          <Toaster position="top-right" theme="dark" />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}