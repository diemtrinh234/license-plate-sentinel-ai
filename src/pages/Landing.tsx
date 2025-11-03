import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  TrendingDown, 
  Shield, 
  BarChart3, 
  Camera, 
  Map, 
  Clock,
  CheckCircle2,
  ArrowRight,
  Languages
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/its-hero-dashboard.jpg";
import smartCamera from "@/assets/smart-camera.jpg";
import trafficMap from "@/assets/traffic-map.jpg";

const Landing = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Language Switcher - Fixed position */}
      <div className="fixed top-6 right-6 z-50">
        <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <button
            onClick={() => setLanguage('vi')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              language === 'vi'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            VI
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              language === 'en'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background))_0%,hsl(220_70%_12%)_100%)]" />
        
        {/* Hero content */}
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Text content */}
            <div className="space-y-8 z-10">
              <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
                <span className="text-accent font-semibold text-sm">
                  {t('landing.badge')}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-foreground">{t('landing.hero.title1')}</span>
                <span className="block text-foreground">{t('landing.hero.title2')}</span>
                <span className="block bg-gradient-to-r from-[hsl(var(--its-primary))] to-[hsl(var(--its-accent))] bg-clip-text text-transparent">
                  {t('landing.hero.title3')}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {t('landing.hero.description')}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/auth?mode=register">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-[hsl(var(--its-primary))] hover:bg-[hsl(var(--its-primary-dark))] text-primary-foreground shadow-[0_0_40px_hsl(var(--its-accent)/0.3)] transition-all duration-300 hover:shadow-[0_0_60px_hsl(var(--its-accent)/0.5)]"
                  >
                    {t('landing.hero.ctaPrimary')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="#solutions">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto border-accent/50 text-accent hover:bg-accent/10 hover:border-accent"
                  >
                    {t('landing.hero.ctaSecondary')}
                  </Button>
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6 pt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span>{t('landing.hero.trust1')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span>{t('landing.hero.trust2')}</span>
                </div>
              </div>
            </div>
            
            {/* Right column - Hero image */}
            <div className="relative lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_0_60px_hsl(var(--its-accent)/0.2)] border border-accent/20">
                <img 
                  src={heroImage} 
                  alt="ITS Control Center Dashboard" 
                  className="w-full h-auto"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                
                {/* Floating stats */}
                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
                  <Card className="p-4 bg-card/90 backdrop-blur-sm border-accent/30">
                    <div className="text-2xl font-bold text-accent">98%</div>
                    <div className="text-xs text-muted-foreground">{t('landing.hero.stats.accuracy')}</div>
                  </Card>
                  <Card className="p-4 bg-card/90 backdrop-blur-sm border-accent/30">
                    <div className="text-2xl font-bold text-accent">24/7</div>
                    <div className="text-xs text-muted-foreground">{t('landing.hero.stats.monitoring')}</div>
                  </Card>
                  <Card className="p-4 bg-card/90 backdrop-blur-sm border-accent/30">
                    <div className="text-2xl font-bold text-accent">-30%</div>
                    <div className="text-xs text-muted-foreground">{t('landing.hero.stats.reduction')}</div>
                  </Card>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-accent/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-[hsl(var(--its-primary))]/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="solutions" className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('landing.benefits.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('landing.benefits.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 group hover:shadow-[0_0_30px_hsl(var(--its-accent)/0.2)]">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <TrendingDown className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('landing.benefits.benefit1.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('landing.benefits.benefit1.description')}
              </p>
            </Card>
            
            {/* Benefit 2 */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 group hover:shadow-[0_0_30px_hsl(var(--its-accent)/0.2)]">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Camera className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('landing.benefits.benefit2.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('landing.benefits.benefit2.description')}
              </p>
            </Card>
            
            {/* Benefit 3 */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 group hover:shadow-[0_0_30px_hsl(var(--its-accent)/0.2)]">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <BarChart3 className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('landing.benefits.benefit3.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('landing.benefits.benefit3.description')}
              </p>
            </Card>
            
            {/* Benefit 4 */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 group hover:shadow-[0_0_30px_hsl(var(--its-accent)/0.2)]">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Shield className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('landing.benefits.benefit4.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('landing.benefits.benefit4.description')}
              </p>
            </Card>
            
            {/* Benefit 5 */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 group hover:shadow-[0_0_30px_hsl(var(--its-accent)/0.2)]">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Map className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('landing.benefits.benefit5.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('landing.benefits.benefit5.description')}
              </p>
            </Card>
            
            {/* Benefit 6 */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 group hover:shadow-[0_0_30px_hsl(var(--its-accent)/0.2)]">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Clock className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('landing.benefits.benefit6.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('landing.benefits.benefit6.description')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Visual Features Section */}
      <section className="py-20 md:py-32 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <img 
                src={smartCamera} 
                alt="Smart Traffic Camera" 
                className="rounded-2xl shadow-[0_0_40px_hsl(var(--its-accent)/0.2)] border border-accent/20"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
                <span className="text-accent font-semibold text-sm">{t('landing.features.camera.badge')}</span>
              </div>
              <h3 className="text-3xl font-bold">
                {t('landing.features.camera.title')}
              </h3>
              <p className="text-lg text-muted-foreground">
                {t('landing.features.camera.description')}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <span>{t('landing.features.camera.feature1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <span>{t('landing.features.camera.feature2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <span>{t('landing.features.camera.feature3')}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
                <span className="text-accent font-semibold text-sm">{t('landing.features.map.badge')}</span>
              </div>
              <h3 className="text-3xl font-bold">
                {t('landing.features.map.title')}
              </h3>
              <p className="text-lg text-muted-foreground">
                {t('landing.features.map.description')}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <span>{t('landing.features.map.feature1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <span>{t('landing.features.map.feature2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <span>{t('landing.features.map.feature3')}</span>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src={trafficMap} 
                alt="Traffic Map Visualization" 
                className="rounded-2xl shadow-[0_0_40px_hsl(var(--its-accent)/0.2)] border border-accent/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--its-primary-dark)),hsl(var(--its-primary)))] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <Card className="max-w-4xl mx-auto p-12 bg-card/80 backdrop-blur-sm border-accent/30 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('landing.cta.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('landing.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=register">
                <Button 
                  size="lg" 
                  className="bg-[hsl(var(--its-primary))] hover:bg-[hsl(var(--its-primary-dark))] text-primary-foreground shadow-[0_0_40px_hsl(var(--its-accent)/0.3)] transition-all duration-300 hover:shadow-[0_0_60px_hsl(var(--its-accent)/0.5)]"
                >
                  {t('landing.cta.register')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-accent/50 text-accent hover:bg-accent/10 hover:border-accent"
                >
                  {t('landing.cta.login')}
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">{t('landing.footer.copyright')}</p>
            <p className="text-sm">{t('landing.footer.tagline')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
