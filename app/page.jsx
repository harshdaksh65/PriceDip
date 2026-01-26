import { Button } from "@/components/ui/button";
import { Bell, Icon, LogIn, Rabbit, Shield } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const user = null;

  const products = [];

  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description:
        "Deal Drop extracts prices in seconds, handling JavaScript and dynamic content",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works across all major e-commerce sites with built-in anti-bot protection",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified instantly when prices drop below your target",
    },
  ];

  return (
    <main className="min-h-screen bg-linear-to-br from-primary/20 via-white to-primary/20">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src={'/pricedip-logo.png'} alt="logo" width={600} height={200} className="h-10 w-auto" />
          </div>
          <Button variant="default" size="sm" className="bg-background text-text hover:bg-orange-600 gap-2 ">
            <LogIn className="w-4 h-4 "/>
            Sign In
            </Button>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-text mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-background">Never Miss a Price Drop</h2>
          <p className="text-xl text-text/70 mb-12 max-w-2xl mx-auto">
            Track prices from any e-commerce site. Get instant alerts when prices drop. Save money effortlessly.
          </p>

          {products.length === 0 && <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            {FEATURES.map(({icon: Icon, title,description})=>{
              return <div key={title} className="bg-transparent p-6 rounded-xl border border-text/10">
                <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center mb-4 mx-auto text-text">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-text mb-2">{title}</h3>
                <p className="text-sm text-text/80">{description}</p>
              </div>
            })}
            </div>}
        </div>
      </section>
    </main>
  );
}
