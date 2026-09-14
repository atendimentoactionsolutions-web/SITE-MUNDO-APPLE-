import React from "react";
import { TechnicalService } from "@/types/service";
import { formatBRL } from "@/utils/formatters";
import { getWhatsAppServiceUrl } from "@/utils/whatsapp";
import { Button } from "@/components/ui/Button";
import { Wrench, Smartphone, BatteryCharging, Cpu, Camera, Shield, Zap, Search, Clock, ShieldCheck } from "lucide-react";

interface ServiceCardProps {
  service: TechnicalService;
}

const iconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-6 h-6 text-apple-blue" />,
  BatteryCharging: <BatteryCharging className="w-6 h-6 text-emerald-500" />,
  Cpu: <Cpu className="w-6 h-6 text-purple-500" />,
  Camera: <Camera className="w-6 h-6 text-blue-500" />,
  Shield: <Shield className="w-6 h-6 text-amber-500" />,
  Zap: <Zap className="w-6 h-6 text-yellow-500" />,
  Search: <Search className="w-6 h-6 text-indigo-500" />,
  Wrench: <Wrench className="w-6 h-6 text-apple-dark" />,
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const whatsappUrl = getWhatsAppServiceUrl(service.title);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-apple-border/60 hover:border-apple-border shadow-apple-card hover:shadow-apple-card-hover transition-all duration-300 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header Icon & Badge */}
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-apple-gray">
            {iconMap[service.iconName] || <Wrench className="w-6 h-6 text-apple-dark" />}
          </div>
          <span className="text-[11px] font-semibold text-apple-muted flex items-center gap-1 bg-apple-gray px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            {service.estimatedTime}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-apple-dark">
          {service.title}
        </h3>

        <p className="text-sm text-apple-muted leading-relaxed font-normal">
          {service.description}
        </p>

        {/* Warranty Tag */}
        <div className="flex items-center gap-1.5 text-xs text-apple-dark font-medium pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{service.warranty}</span>
        </div>
      </div>

      {/* Footer & CTA */}
      <div className="pt-6 mt-6 border-t border-apple-border/40 flex items-center justify-between gap-4">
        {service.priceStartingFrom ? (
          <div>
            <span className="text-[11px] text-apple-muted block">A partir de</span>
            <span className="text-lg font-bold text-apple-dark">
              {formatBRL(service.priceStartingFrom)}
            </span>
          </div>
        ) : (
          <span className="text-xs text-apple-muted font-medium">Orçamento sob medida</span>
        )}

        <Button href={whatsappUrl} external variant="whatsapp" size="sm">
          Solicitar orçamento
        </Button>
      </div>
    </div>
  );
};
