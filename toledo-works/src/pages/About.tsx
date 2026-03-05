import { Heart, Users, Wrench, MapPin } from 'lucide-react';
import Card from '../components/ui/Card';
import { BRAND_NAME } from '../lib/constants';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">About {BRAND_NAME}</h1>

      <div className="prose max-w-none space-y-6">
        <p className="text-lg text-gray-600">
          {BRAND_NAME} is a hyperlocal job board built specifically for Toledo, Ohio.
          We connect local employers with motivated workers — especially in blue-collar,
          trades, and hourly positions — without staffing agencies or corporate overhead.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <Card className="p-6">
            <MapPin className="w-8 h-8 text-orange mb-3" />
            <h3 className="font-display font-bold text-lg mb-2">Hyperlocal</h3>
            <p className="text-gray-500">
              Built for Toledo, by Toledo. Every job is local. Every employer is real.
              We know the neighborhoods, the industries, and the workforce.
            </p>
          </Card>
          <Card className="p-6">
            <Wrench className="w-8 h-8 text-orange mb-3" />
            <h3 className="font-display font-bold text-lg mb-2">Trades-First</h3>
            <p className="text-gray-500">
              Our dedicated trades section with Skills Cards gives skilled tradespeople
              a platform designed for how they actually find work.
            </p>
          </Card>
          <Card className="p-6">
            <Users className="w-8 h-8 text-orange mb-3" />
            <h3 className="font-display font-bold text-lg mb-2">Worker-Focused</h3>
            <p className="text-gray-500">
              Pay is always prominent. No degree requirements are highlighted.
              Quick Apply means no resume needed. Bilingual support for our Spanish-speaking community.
            </p>
          </Card>
          <Card className="p-6">
            <Heart className="w-8 h-8 text-orange mb-3" />
            <h3 className="font-display font-bold text-lg mb-2">Community-Powered</h3>
            <p className="text-gray-500">
              Workforce development powered by The Mona K Project (501c3).
              We're committed to creating pathways to sustainable careers in Toledo.
            </p>
          </Card>
        </div>

        <div className="bg-navy text-white rounded-card p-8">
          <h2 className="font-display text-2xl font-bold mb-3">The Mona K Project</h2>
          <p className="text-gray-300">
            The Mona K Project is a 501(c)(3) nonprofit dedicated to workforce development
            in Northwest Ohio. Through programs like the Green Trades Workforce Academy,
            they provide training, certifications, and career pathways for workers
            entering the skilled trades.
          </p>
        </div>
      </div>
    </div>
  );
}
