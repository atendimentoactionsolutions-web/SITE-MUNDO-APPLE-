"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { SellWizard } from "@/components/sell/SellWizard";

export default function SellPage() {
  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container size="default">
        <SellWizard />
      </Container>
    </div>
  );
}
