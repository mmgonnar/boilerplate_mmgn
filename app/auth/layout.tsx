// 🚀 Importamos los estilos globales desde tu archivo principal
// Ajusta la ruta si tus estilos globales están en otro lado (ej: '@/app/globals.css')
import '@/app/globals.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background antialiased selection:bg-black selection:text-white">
      {children}
    </div>
  );
}
