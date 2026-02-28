'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { paymentService } from '@/services/payment.service';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Crown, Zap, Check, Star, Sparkles, Flame, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const plans = [
  { 
    name: 'Basic', 
    price: 0, 
    period: 'Forever Free', 
    description: 'Perfect for casual trekkers',
    features: ['Browse all trails', 'Join trekking groups', 'Step tracking', 'Basic checklist', 'Community chat', 'Trail reviews'],
    icon: <Zap className="h-6 w-6" />, 
    color: 'from-slate-500 to-gray-600',
    highlight: false
  },
  { 
    name: 'Pro', 
    price: 499, 
    period: '/month', 
    description: 'For passionate adventurers',
    features: ['Everything in Basic', 'AI Chatbot guide', 'Advanced analytics', 'Priority support', 'Create groups', 'Custom checklists', 'Offline maps'],
    icon: <Sparkles className="h-6 w-6" />, 
    color: 'from-blue-500 to-cyan-500', 
    popular: true,
    highlight: true
  },
  { 
    name: 'Premium', 
    price: 999, 
    period: '/month', 
    description: 'For extreme explorers',
    features: ['Everything in Pro', 'Unlimited groups', 'Analytics dashboard', 'Custom trail creation', 'Premium badge', 'Early access features', '24/7 dedicated support'],
    icon: <Crown className="h-6 w-6" />, 
    color: 'from-amber-500 to-orange-500',
    highlight: false
  },
];

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState('');

  const handleSubscribe = async (planName: string, price: number) => {
    if (planName === 'Basic') return;
    if (user?.subscription === planName) {
      toast('You are already on this plan');
      return;
    }
    setLoading(planName);
    try {
      const res = await paymentService.initiatePayment({ plan: planName, amount: price });
      const esewaData = res.data;
      
      if (!esewaData) {
        toast.error('No payment data received');
        return;
      }

      if (!esewaData.signature || !esewaData.transaction_uuid) {
        console.error('Missing required eSEWA fields:', esewaData);
        toast.error('Invalid payment data: missing signature or transaction UUID');
        return;
      }

      // Create and submit form to eSEWA
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
      
      // Add all required fields
      Object.entries(esewaData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        }
      });
      
      // Log form data for debugging
      console.log('eSEWA Form Data:', {
        total_amount: esewaData.total_amount,
        transaction_uuid: esewaData.transaction_uuid,
        product_code: esewaData.product_code,
        signature: esewaData.signature?.substring(0, 20) + '...',
      });
      
      document.body.appendChild(form);
      form.submit();
    } catch (err: any) { 
      console.error('Payment error:', err);
      toast.error(err?.response?.data?.message || 'Payment initiation failed'); 
    }
    setLoading('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Flame className="h-6 w-6 text-orange-500" />
              <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Upgrade Your Experience</span>
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent mb-3">
              Choose Your Adventure
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Unlock premium features and join thousands of trekkers exploring the most beautiful trails
            </p>
          </div>

          {/* Current Plan Badge */}
          {user?.subscription && user.subscription !== 'Basic' && (
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-full px-6 py-2 flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-600" />
                <span className="text-emerald-900 font-semibold">Currently on {user.subscription} Plan</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan) => {
            const isCurrent = user?.subscription === plan.name;
            
            return (
            <div key={plan.name} className="relative group pt-6">
              {/* Glow effect for current plan only */}
              {isCurrent && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-2xl opacity-25 group-hover:opacity-40 transition-opacity pointer-events-none" />
              )}
              
              <div className={`relative h-full rounded-2xl transition-all duration-300 ${
                isCurrent ? 'scale-105' : ''
              }`}>
                <Card className={`h-full p-8 flex flex-col transition-all duration-300 hover:shadow-2xl ${
                  isCurrent
                    ? 'border-2 border-blue-500 bg-gradient-to-br from-white to-blue-50 shadow-xl' 
                    : 'border border-gray-200 hover:border-gray-300'
                }`}>
                  {/* Current Plan Badge - Only on subscribed plan */}
                  {isCurrent && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                        <Check className="h-4 w-4" />
                        Current Plan
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {plan.icon}
                </div>

                {/* Plan Name and Description */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-6 h-10">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-gray-900">Rs. {plan.price}</span>
                    <span className="text-gray-600 font-medium">{plan.period}</span>
                  </div>
                  {plan.price === 0 && <p className="text-emerald-600 text-sm font-semibold mt-2">No credit card required</p>}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 pt-1">
                        <Check className={`h-5 w-5 ${
                          isCurrent ? 'text-blue-500' : 'text-emerald-500'
                        } font-bold`} />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <Button 
                  onClick={() => handleSubscribe(plan.name, plan.price)}
                  className={`w-full py-3 font-semibold rounded-lg transition-all ${
                    plan.price === 0 
                      ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-default'
                      : isCurrent
                      ? 'bg-gray-100 text-gray-600 cursor-default'
                      : plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/50'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                  isLoading={loading === plan.name}
                  disabled={plan.price === 0 || isCurrent}
                >
                  {plan.price === 0 ? 'Your Starting Plan' : isCurrent ? '✓ Active' : 'Subscribe Now'}
                </Button>

                {/* Upgrade indicator */}
                {user?.subscription && plan.name !== 'Basic' && !isCurrent && (
                  <p className="text-xs text-gray-500 text-center mt-3">
                    {(plan.name === 'Pro' && user.subscription === 'Basic') || 
                     (plan.name === 'Premium') ? '✨ Upgrade to unlock' : 'Switch to this plan'}
                  </p>
                )}
                </Card>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 mt-8">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="h-6 w-6 text-indigo-600" />
            Why Choose Premium?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <Check className="h-6 w-6 text-emerald-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Priority Support</h3>
                <p className="text-gray-600 text-sm">Get instant help from our expert team</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="h-6 w-6 text-emerald-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">AI-Powered Insights</h3>
                <p className="text-gray-600 text-sm">Personalized trekking recommendations</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="h-6 w-6 text-emerald-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Exclusive Features</h3>
                <p className="text-gray-600 text-sm">Early access to new trails and tools</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="h-6 w-6 text-emerald-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Community Badges</h3>
                <p className="text-gray-600 text-sm">Stand out as a premium member</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 mb-2">Have questions? Our support team is here to help</p>
        <p className="text-gray-500 text-sm">Money-back guarantee if you're not satisfied within 7 days</p>
      </div>
    </div>
  );
}
