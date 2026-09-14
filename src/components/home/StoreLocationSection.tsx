import React from "react";
import { Container } from "@/components/ui/Container";
import { storeConfig } from "@/data/storeConfig";
import { MapPin, Clock, Navigation, MessageCircle, Phone, Building, Sparkles } from "lucide-react";
import { getWhatsAppGeneralUrl } from "@/utils/whatsapp";

export const StoreLocationSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-white border-t border-[#E5E7EB]" id="localizacao">
      <Container size="large">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F5F7] border border-[#E5E7EB] text-xs font-bold uppercase tracking-wider text-[#0071E3]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atendimento Presencial</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] font-display tracking-tight leading-tight">
            Visite nossa loja física
          </h2>

          <p className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed">
            Localização privilegiada no polo tecnológico de São Paulo, na Santa Ifigênia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Store Information Card */}
          <div className="lg:col-span-5 bg-[#F5F5F7] rounded-[24px] p-8 sm:p-10 border border-[#E5E7EB] shadow-sm flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-[#0071E3] border border-blue-100 rounded-2xl">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A] font-display">
                    {storeConfig.name}
                  </h3>
                  <span className="text-xs text-[#64748B] font-medium">
                    {storeConfig.address.complement}
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-2 text-sm text-[#0F172A]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#0071E3] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-xs uppercase tracking-wider text-gray-500 mb-0.5">Endereço:</span>
                    <span className="text-[#475569] text-xs leading-relaxed block font-medium">
                      {storeConfig.address.fullAddress}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#0071E3] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-xs uppercase tracking-wider text-gray-500 mb-0.5">Horário de Funcionamento:</span>
                    <span className="text-[#475569] text-xs block font-medium">
                      {storeConfig.openingHours.weekdays}
                    </span>
                    <span className="text-[#475569] text-xs block font-medium">
                      {storeConfig.openingHours.saturday}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#0071E3] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-xs uppercase tracking-wider text-gray-500 mb-0.5">Telefone / WhatsApp:</span>
                    <span className="text-[#475569] text-xs block font-medium">
                      {storeConfig.contact.whatsappFormatted}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 space-y-3">
              <a
                href={storeConfig.address.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs sm:text-sm rounded-full shadow-sm transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Traçar Rota no Google Maps</span>
              </a>

              <a
                href={getWhatsAppGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#00C853] hover:bg-[#00B048] text-white font-bold text-xs sm:text-sm rounded-full shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Falar com Vendedor no WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Embed */}
          <div className="lg:col-span-7 bg-[#F5F5F7] rounded-[24px] border border-[#E5E7EB] overflow-hidden min-h-[350px] relative shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.652199187371!2d-46.63935292376044!3d-23.53962656100236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce58572bca534b%3A0xb366b539ef42ab54!2sR.%20Santa%20Ifig%C3%AAnia%2C%20361%20-%20Santa%20Ifig%C3%AAnia%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001207-000!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "380px" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Localização Mundo Apple Delivery"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};
