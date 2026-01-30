export type ServiceName = 'water' | 'laundry' | 'car' | 'fitness';

export interface ServiceControl {
    id: string;
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    isActive: boolean;
}

export interface Service {
  id: ServiceName;
  name: string;
  subtext: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  controls: ServiceControl[];
  gradient: string;
}

export interface LogEntry {
  time: string;
  action: 'Added' | 'Consumed';
  amount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
}

export interface ManualRefillStatus {
  stage: 'requested' | 'in-progress' | 'completed';
  requestedAt: Date;
  inProgressAt?: Date;
  completedAt?: Date;
  amount?: number; // in Liters
}

export interface LaundryPickupStatus {
  stage: 'requested' | 'on-the-way' | 'completed';
  requestedAt: Date;
  onTheWayAt?: Date;
  completedAt?: Date;
  weight?: number; // in KG
}

export interface Delivery {
  id: string;
  date: string;
  amountLiters: number;
}

export interface MonthlyConsumption {
  month: string;
  liters: number;
}

export interface Partner {
  name: string;
  location: string;
}

export interface Perk {
  id: string;
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  claimed: boolean;
  gradient: string;
  partners?: Partner[];
}

export interface PricingTier {
  name: string;
  price?: string;
  annualPrice?: string;
  description: string;
  features: string[];
  isCurrent: boolean;
  cta: string;
  isCustom?: boolean;
}

export interface Invoice {
    id: string;
    name: string;
    date: string;
    amount: string;
    status: 'Paid' | 'Due';
}

export interface ServicePricing {
    name: string;
    price: string;
    unit: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface WaterQualityTest {
    category: 'Physical' | 'Chemical' | 'Biological' | 'Others';
    parameter: string;
    result: string;
    status: 'Pass' | 'Fail';
}

export interface SanitationVisit {
    date: string;
    notes: string;
    status: 'Pass' | 'Fail';
    attachmentUrl?: string;
}

export interface Review {
    author: string;
    rating: number;
    comment: string;
    date: string;
}

export interface RefillingStation {
  id: string;
  name: string;
  location: string;
  quality: 'Excellent' | 'Good' | 'Fair';
  latestTestDate: string;
  overallTestResultUrl: string;
  sanitationStatus: 'Excellent' | 'Good' | 'Fair';
  latestSanitationDate: string;
  overallSanitationReportUrl: string;
  tests: WaterQualityTest[];
  sanitationHistory: SanitationVisit[];
  reviews: Review[];
}

export interface Coach {
    id: string;
    name: string;
    specialty: string;
    imageUrl: string;
}

export interface Gym {
    id: string;
    name: string;
    location: string;
    rating: number;
    reviews: Review[];
    coaches: Coach[];
}

export interface TrainingSession {
    id: string;
    gymId: string;
    coachId: string;
    date: string;
    time: string;
}

export type ProfileModalType = 'contact' | 'notifications' | 'marketing' | 'security' | 'privacy' | null;

export interface Address {
  line1: string;
  line2: string;
  city: string;
  province: string;
}

export type HumorLevel = 'None' | 'Low' | 'High';
export type AIVoice = 'Female' | 'Male';
export type AITone = 'Friendly' | 'Moderate' | 'Straightforward';
export type AILanguage = 'English' | 'Tagalog' | 'Auto-detect';

export interface AIPersonality {
  humor: HumorLevel;
  voice: AIVoice;
  tone: AITone;
  language: AILanguage;
}
