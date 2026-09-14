import React from "react";
import { TechnicalService } from "@/types/service";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

interface ServicesOverviewProps {
  services: TechnicalService[];
}

export const ServicesOverview: React.FC<ServicesOverviewProps> = ({ services }) => {
  return (
    <section className="py-20 bg-apple-gray/40 border-t border-apple-border/40">
      <Container>
        <SectionHeading
          eyebrow="Laboratório Especializado"
          title="Assistência Técnica Apple"
          subtitle="Reparos de alta precisão realizados por especialistas qualificados, peças de excelência e garantia expressa."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button href="/servicos" variant="secondary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
            Ver todos os serviços & reparos
          </Button>
        </div>
      </Container>
    </section>
  );
};
