export type PaymentPeriod = 'hour' | 'month' | 'year';
export type TaxClass = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
export type HealthInsurance = 'public' | 'private';

export interface CalculationResult {
  gross: number;
  net: number;
  tax: number;
  social: number;
  breakdown: {
    incomeTax: number;
    soli: number;
    church: number;
    health: number;
    unemployment: number;
    pension: number;
    care: number;
  };
  hourlyRate: number;
}

export const states = [
  "Baden-Württemberg", "Baviera", "Berlim", "Brandemburgo", "Bremen", 
  "Hamburgo", "Hesse", "Baixa Saxônia", "Mecklemburgo-Pomerânia Ocidental", 
  "Renânia do Norte-Vestfália", "Renânia-Palatinado", "Sarre", "Saxônia", 
  "Saxônia-Anhalt", "Schleswig-Holstein", "Turíngia"
];

export function calculateNet(
  grossInput: number,
  period: PaymentPeriod,
  taxClass: TaxClass,
  children: number,
  healthInsurance: HealthInsurance,
  churchTax: boolean,
  state: string,
  age: number
): CalculationResult {
  // Convert to yearly for calculation
  let yearlyGross = grossInput;
  if (period === 'month') yearlyGross = grossInput * 12;
  if (period === 'hour') yearlyGross = grossInput * 40 * 52; // roughly

  const healthCareBase = Math.min(yearlyGross, 62100);
  const pensionBase = Math.min(yearlyGross, 90600);

  const pensionRate = 0.093;
  const unempRate = 0.013;
  let healthCareRate = 0.073 + 0.0085;
  let careRate = 0.017;
  
  if (children === 0 && age > 23) {
    careRate = 0.023; // Childless surcharge
  } else if (children > 1) {
    careRate = Math.max(0, 0.017 - Math.min(children - 1, 4) * 0.0025);
  }

  let healthContribution = healthInsurance === 'public' ? healthCareBase * healthCareRate : Math.min(6000, yearlyGross * 0.08);
  let careContribution = healthInsurance === 'public' ? healthCareBase * careRate : 0;
  
  const pensionContribution = pensionBase * pensionRate;
  const unempContribution = pensionBase * unempRate;

  const socialContributions = healthContribution + careContribution + pensionContribution + unempContribution;

  const zvE = Math.max(0, yearlyGross - 1230 - socialContributions);

  // Simplified tax calculation
  let tax = zvE > 11784 ? (zvE * 0.25) : 0; 
  if (taxClass === 'III') tax = tax * 0.6;
  if (taxClass === 'V' || taxClass === 'VI') tax = tax * 1.5;

  let soli = tax > 18130 ? tax * 0.055 : 0;
  
  // Church tax is 8% in Bayern/Baden-Württemberg, 9% elsewhere
  const is8Percent = state === 'Baviera' || state === 'Baden-Württemberg';
  let church = churchTax ? tax * (is8Percent ? 0.08 : 0.09) : 0;

  const totalTax = tax + soli + church;
  const yearlyNet = yearlyGross - socialContributions - totalTax;

  // Convert back to requested period
  const factor = period === 'year' ? 1 : period === 'month' ? 12 : (40 * 52);
  
  return {
    gross: yearlyGross / factor,
    net: yearlyNet / factor,
    tax: totalTax / factor,
    social: socialContributions / factor,
    hourlyRate: yearlyNet / (40 * 52),
    breakdown: {
      incomeTax: tax / factor,
      soli: soli / factor,
      church: church / factor,
      health: healthContribution / factor,
      unemployment: unempContribution / factor,
      pension: pensionContribution / factor,
      care: careContribution / factor
    }
  };
}
