import Header from "../_components/header/Header";
import Footer from "../_components/footer/Footer";

export default function LojaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}