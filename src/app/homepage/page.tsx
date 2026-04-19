import React from 'react';
import type { Metadata } from 'next';
import HeroSection from './components/HeroSection';
import ProblemSolutionSection from './components/ProblemSolutionSection';
import HowItWorksSection from './components/HowItWorksSection';
import FeaturesSection from './components/FeaturesSection';
import PublicInsightsSection from './components/PublicInsightsSection';
import FooterSection from './components/FooterSection';
import ScrollProgressBar from '@/components/ui/ScrollProgressBar';
import BackToTopButton from '@/components/ui/BackToTopButton';
import StickyNavbar from '@/components/ui/StickyNavbar';

export const metadata: Metadata = {
  title: 'NeuroDecode — AI Copilot for ASD Caregiving',
  description:
    'Real-time multimodal AI companion for autism spectrum disorder caregivers. Powered by Gemini Live, Keras/TensorFlow, Cloud Run, and Firestore. Detect behavioral crises in under 3 seconds and receive personalized intervention guidance.',
  keywords: [
    'autism caregiving',
    'ASD copilot',
    'AI for autism',
    'Gemini Live',
    'behavioral pattern recognition',
    'NeuroDecode',
    'meltdown intervention',
    'caregiver support app',
  ],
  openGraph: {
    title: 'NeuroDecode — AI Copilot for ASD Caregiving',
    description:
      'Multimodal real-time AI companion for autism caregivers. Voice + vision powered by Gemini Live and Keras.',
    type: 'website',
  },
};

export default function HomepagePage() {
  return (
    <main className="min-h-screen bg-warm-white overflow-x-hidden">
      <ScrollProgressBar />
      <StickyNavbar />
      <HeroSection />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PublicInsightsSection />
      <FooterSection />
      <BackToTopButton />
    </main>
  );
}
