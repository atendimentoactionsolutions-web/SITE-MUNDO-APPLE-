import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StoreLocationSection } from "@/components/home/StoreLocationSection";

export const metadata = {
  title: "Contato & Localização | Mundo Apple Delivery",
  description: "Endereço da nossa loja física na Santa Ifigênia, São Paulo, horário de atendimento e contato de WhatsApp.",
};

export default function ContatoPage() {
  return (
    <div className="pt-28 pb-10 bg-apple-gray/30 min-h-screen">
      <StoreLocationSection />
    </div>
  );
}
