// src/app/layout.tsx
import React from "react";
import "./globals.css";
import ClientProviders from "./ClientProviders";

export const metadata = {
  title: "Plataforma IA para Terapia",
  description: "Plataforma para análisis emocional, reportes AI, citas y mensajería segura para terapias online."
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Plataforma para análisis emocional, reportes AI, citas y mensajería segura para terapias online." />
        <meta name="theme-color" content="#1976d2" />
        <title>Plataforma IA para Terapia</title>
        {/* Se pueden integrar herramientas de analytics (Google Analytics, Mixpanel) y variables de entorno para seguridad */}
      </head>
      <body>
        <ClientProviders>
          {/* Header con navegación centralizada */}
          <header role="banner">
            <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h1 style={{ margin: 0, fontSize: "1.75rem", color: "#1976d2" }}>
                Plataforma IA para Terapia
              </h1>
              <nav aria-label="Navegación principal">
                <ul style={{ display: "flex", gap: "16px", listStyle: "none", margin: 0, padding: 0 }}>
                  <li><a href="/" style={{ color: "#1976d2", fontWeight: 500 }}>Inicio</a></li>
                  <li><a href="/about" style={{ color: "#1976d2", fontWeight: 500 }}>Acerca de</a></li>
                  <li><a href="/services" style={{ color: "#1976d2", fontWeight: 500 }}>Servicios</a></li>
                  <li><a href="/contact" style={{ color: "#1976d2", fontWeight: 500 }}>Contacto</a></li>
                </ul>
              </nav>
            </div>
          </header>

          {/* Contenedor principal con layout de dos columnas */}
          <div className="container" style={{ marginTop: "24px", padding: "0 16px" }}>
            <div className="layout-grid">
              <main
                role="main"
                style={{
                  backgroundColor: "#ffffff",
                  padding: "16px",
                  borderRadius: "var(--border-radius)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                {children}
              </main>
              <aside
                role="complementary"
                style={{
                  backgroundColor: "#ffffff",
                  padding: "16px",
                  borderRadius: "var(--border-radius)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                <h2 style={{ fontSize: "1.5rem", color: "#1976d2", marginTop: 0, marginBottom: "16px" }}>
                  Recursos Adicionales
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: "8px" }}><a href="/faq" style={{ color: "#1976d2" }}>Preguntas Frecuentes</a></li>
                  <li style={{ marginBottom: "8px" }}><a href="/support" style={{ color: "#1976d2" }}>Soporte Técnico</a></li>
                  <li><a href="/blog" style={{ color: "#1976d2" }}>Blog y Noticias</a></li>
                </ul>
              </aside>
            </div>
          </div>

          {/* Footer */}
          <footer role="contentinfo" style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e0e0e0", padding: "16px 0", textAlign: "center", marginTop: "24px" }}>
            <div className="container">
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#555555" }}>
                &copy; {new Date().getFullYear()} Plataforma IA para Terapia. Todos los derechos reservados.
              </p>
              <p style={{ margin: "8px 0 0 0", fontSize: "0.75rem", color: "#888888" }}>
                Desarrollado con pasión y tecnología de punta.
              </p>
              <p style={{ margin: "8px 0 0 0", fontSize: "0.75rem", color: "#888888" }}>
                Política de privacidad | Términos de uso
              </p>
            </div>
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}
