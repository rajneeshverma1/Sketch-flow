import { Zap, Users, Lock, Palette, Download, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant response with optimized rendering. No lag, just pure creativity.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Work together with your team in real-time. See changes as they happen.",
  },
  {
    icon: Lock,
    title: "End-to-End Encrypted",
    description: "Your drawings are private. Full encryption keeps your ideas safe.",
  },
  {
    icon: Palette,
    title: "Hand-drawn Style",
    description: "Beautiful sketchy aesthetic that makes diagrams feel personal and approachable.",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description: "Export to PNG, SVG, or share a link. Your drawings, your way.",
  },
  {
    icon: Globe,
    title: "Works Offline",
    description: "No internet? No problem. Keep sketching and sync when you're back online.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[hsl(217,91%,60%)]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[hsl(174,72%,56%)]/6 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[hsl(210,40%,98%)] leading-tight">
            Everything You Need to
            <br />
            Collaborate Visually
          </h2>
          <p className="text-lg text-[hsl(215,20%,70%)] max-w-2xl mx-auto leading-relaxed">
            Powerful features wrapped in a simple, intuitive interface. 
            Start creating in seconds.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl border border-[hsl(222,47%,25%)]/40 hover:border-[hsl(217,91%,60%)]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[hsl(217,91%,60%)]/10"
              style={{ 
                background: 'linear-gradient(135deg, hsl(222,47%,15%) 0%, hsl(222,47%,12%) 100%)'
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(217,91%,60%)]/10 border border-[hsl(217,91%,60%)]/20 mb-5 group-hover:bg-[hsl(217,91%,60%)]/15 group-hover:border-[hsl(217,91%,60%)]/30 transition-all duration-300">
                <feature.icon className="h-6 w-6 text-[hsl(217,91%,70%)]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[hsl(210,40%,98%)]">
                {feature.title}
              </h3>
              <p className="text-[hsl(215,20%,70%)] leading-relaxed text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;