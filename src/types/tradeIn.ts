export interface TradeInOption {
  model: string;
  maxEstimatedValue: number;
}

export interface TradeInSubmission {
  currentModel: string;
  storage: string;
  batteryHealth: string;
  generalCondition: string;
  originalParts: boolean;
  desiredModel: string;
  observations?: string;
}
