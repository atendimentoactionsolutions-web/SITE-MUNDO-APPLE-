import { getTechnicalServices } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Wrench, ShieldCheck, Clock, Cpu } from "lucide-react";

export const metadata = {
  title: "Assistência Técnica Especializada Apple | Mundo Apple Delivery",
  description: "Reparo de placas, troca de telas, substituição de baterias e manutenção avançada de iPhones, iPads e MacBooks.",
};

export default async function ServicesPage() {
  const services = await getTechnicalServices();

  return (
    <div className="pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        <SectionHeading
          eyebrow="Laboratório Técnico"
          title="Assistência Técnica Especializada"
          subtitle="Diagnósticos precisos, microsolda avançada em placa e substituição de componentes com garantia."
        />

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-6 border border-apple-border/60 shadow-apple-card text-center space-y-2">
            <Clock className="w-6 h-6 text-apple-blue mx-auto" />
            <h3 className="font-semibold text-apple-dark text-xs">Reparos Rápidos</h3>
            <p className="text-[11px] text-apple-muted">Troca de tela e bateria em 30 a 60 minutos.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-apple-border/60 shadow-apple-card text-center space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto" />
            <h3 className="font-semibold text-apple-dark text-xs">Garantia nos Serviços</h3>
            <p className="text-[11px] text-apple-muted">Garantia estendida de 90 a 180 dias.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-apple-border/60 shadow-apple-card text-center space-y-2">
            <Cpu className="w-6 h-6 text-purple-600 mx-auto" />
            <h3 className="font-semibold text-apple-dark text-xs">Microsolda em Placa</h3>
            <p className="text-[11px] text-apple-muted">Solução para aparelhos que não ligam.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-apple-border/60 shadow-apple-card text-center space-y-2">
            <Wrench className="w-6 h-6 text-indigo-600 mx-auto" />
            <h3 className="font-semibold text-apple-dark text-xs">Técnicos Certificados</h3>
            <p className="text-[11px] text-apple-muted">Especialistas com vasta experiência.</p>
          </div>
        </div>

        {/* All Technical Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Container>
    </div>
  );
}
