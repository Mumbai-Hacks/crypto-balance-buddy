import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import Particles from "@/components/Particles";
import Preloader from "@/components/preloader";
import EasterEggs from "@/components/easter-eggs";
import ElasticCursor from "@/components/ui/ElasticCursor";
import SocketContextProvider from "@/contexts/socketio";
import RemoteCursors from "@/components/realtime/remote-cursors";

// Pages
import Index from "@/pages/Index";
import About from "@/pages/About";
import Projects from "@/pages/Projects";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark">
        <Particles
          className="fixed inset-0 -z-10 animate-fade-in"
          quantity={100}
        />
        <Preloader>
          <SocketContextProvider>
            <RemoteCursors />
            <TooltipProvider>
              <Header />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </TooltipProvider>
          </SocketContextProvider>
          <Toaster />
          <EasterEggs />
          <ElasticCursor />
        </Preloader>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
