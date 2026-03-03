"use client";

const ProductPreview = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222,47%,11%)] via-[#0D1B3C] to-[hsl(222,47%,11%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Glow effect behind image */}
          <div className="absolute left-1/2 -translate-x-1/2 w-[70%] h-[400px] bg-gradient-to-r from-[hsl(217,91%,60%)]/20 to-[hsl(174,72%,56%)]/20 blur-[120px] rounded-full -z-10" />
          
          <div className="relative group">
            {/* Image container with modern styling */}
            <div className="relative rounded-3xl overflow-hidden border border-[hsl(222,47%,25%)]/40 bg-gradient-to-b from-[hsl(222,47%,16%)]/80 to-[hsl(222,47%,12%)]/80 backdrop-blur-xl shadow-2xl shadow-black/50 transition-all duration-500 group-hover:shadow-[hsl(217,91%,60%)]/20 group-hover:border-[hsl(217,91%,60%)]/40">
              
              {/* Browser-like header */}
              <div className="flex items-center gap-2 px-5 py-4 border-b border-[hsl(222,47%,25%)]/50 bg-[hsl(222,47%,14%)]/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 group-hover:bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80 group-hover:bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80 group-hover:bg-green-500" />
                </div>
                <div className="flex-1 mx-4 px-4 py-1.5 bg-[hsl(222,47%,8%)] rounded-lg text-sm text-[hsl(215,20%,65%)] flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  app.sketchflow.io/canvas/collaborative-workspace
                </div>
              </div>
              
              {/* Product preview content */}
              <div className="relative p-8 md:p-12 bg-[hsl(222,47%,11%)]">
                <DashboardPreview />
              </div>
              
              {/* Bottom fade overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[hsl(222,47%,11%)] to-transparent pointer-events-none" />
            </div>
            
            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-[hsl(217,91%,60%)] text-white px-4 py-2 rounded-xl shadow-lg font-semibold text-sm">
              ⚡ Real-time
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[hsl(174,72%,56%)] text-white px-4 py-2 rounded-xl shadow-lg font-semibold text-sm">
              🎨 Infinite Canvas
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DashboardPreview = () => (
  <svg viewBox="0 0 1400 700" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
    {/* Background with subtle grid */}
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(222,47%,18%)" strokeWidth="0.5" opacity="0.4" />
      </pattern>
      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(217,91%,60%)" />
        <stop offset="100%" stopColor="hsl(200,90%,60%)" />
      </linearGradient>
      <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(174,72%,56%)" />
        <stop offset="100%" stopColor="hsl(190,80%,60%)" />
      </linearGradient>
    </defs>
    
    {/* Background */}
    <rect width="1400" height="700" fill="hsl(222,47%,11%)" />
    <rect width="1400" height="700" fill="url(#grid)" opacity="0.6" />
    
    {/* Main workflow diagram */}
    <g>
      {/* Workflow cards */}
      <g>
        {/* Card 1 - Start */}
        <rect x="120" y="200" width="220" height="140" rx="12" stroke="url(#blueGradient)" strokeWidth="3" fill="hsl(217,91%,60%)" fillOpacity="0.1" />
        <text x="230" y="240" textAnchor="middle" fill="hsl(217,91%,70%)" fontSize="18" fontWeight="600" fontFamily="system-ui">
          📊 Data Input
        </text>
        <rect x="140" y="260" width="180" height="8" rx="4" fill="hsl(217,91%,60%)" fillOpacity="0.3" />
        <rect x="140" y="280" width="140" height="8" rx="4" fill="hsl(217,91%,60%)" fillOpacity="0.3" />
        <rect x="140" y="300" width="160" height="8" rx="4" fill="hsl(217,91%,60%)" fillOpacity="0.3" />
      </g>
      
      {/* Arrow 1 */}
      <g>
        <path d="M 350 270 L 450 270" stroke="url(#blueGradient)" strokeWidth="3" strokeDasharray="8 4" />
        <polygon points="440 263, 460 270, 440 277" fill="hsl(217,91%,60%)" />
      </g>
      
      {/* Card 2 - Process */}
      <g>
        <rect x="470" y="200" width="220" height="140" rx="12" stroke="url(#tealGradient)" strokeWidth="3" fill="hsl(174,72%,56%)" fillOpacity="0.1" />
        <text x="580" y="240" textAnchor="middle" fill="hsl(174,72%,66%)" fontSize="18" fontWeight="600" fontFamily="system-ui">
          ⚙️ Process
        </text>
        <circle cx="530" cy="280" r="8" fill="hsl(174,72%,56%)" fillOpacity="0.4" />
        <circle cx="580" cy="280" r="8" fill="hsl(174,72%,56%)" fillOpacity="0.4" />
        <circle cx="630" cy="280" r="8" fill="hsl(174,72%,56%)" fillOpacity="0.4" />
        <rect x="490" y="305" width="180" height="8" rx="4" fill="hsl(174,72%,56%)" fillOpacity="0.3" />
      </g>
      
      {/* Arrow 2 */}
      <g>
        <path d="M 700 270 L 800 270" stroke="url(#tealGradient)" strokeWidth="3" strokeDasharray="8 4" />
        <polygon points="790 263, 810 270, 790 277" fill="hsl(174,72%,56%)" />
      </g>
      
      {/* Card 3 - Output */}
      <g>
        <rect x="820" y="200" width="220" height="140" rx="12" stroke="url(#blueGradient)" strokeWidth="3" fill="hsl(217,91%,60%)" fillOpacity="0.1" />
        <text x="930" y="240" textAnchor="middle" fill="hsl(217,91%,70%)" fontSize="18" fontWeight="600" fontFamily="system-ui">
          ✨ Results
        </text>
        <rect x="850" y="260" width="160" height="12" rx="6" fill="url(#blueGradient)" fillOpacity="0.6" />
        <rect x="850" y="285" width="140" height="12" rx="6" fill="url(#blueGradient)" fillOpacity="0.5" />
        <rect x="850" y="310" width="120" height="12" rx="6" fill="url(#blueGradient)" fillOpacity="0.4" />
      </g>
      
      {/* Collaboration indicators - Bottom section */}
      <g>
        {/* Team members working */}
        <g transform="translate(120, 420)">
          <circle cx="0" cy="0" r="40" stroke="url(#blueGradient)" strokeWidth="3" fill="hsl(217,91%,60%)" fillOpacity="0.15" />
          <text x="0" y="8" textAnchor="middle" fill="hsl(217,91%,70%)" fontSize="32">👤</text>
          <rect x="-30" y="50" width="60" height="8" rx="4" fill="hsl(217,91%,60%)" fillOpacity="0.4" />
        </g>
        
        <g transform="translate(320, 420)">
          <circle cx="0" cy="0" r="40" stroke="url(#tealGradient)" strokeWidth="3" fill="hsl(174,72%,56%)" fillOpacity="0.15" />
          <text x="0" y="8" textAnchor="middle" fill="hsl(174,72%,66%)" fontSize="32">👤</text>
          <rect x="-30" y="50" width="60" height="8" rx="4" fill="hsl(174,72%,56%)" fillOpacity="0.4" />
        </g>
        
        <g transform="translate(520, 420)">
          <circle cx="0" cy="0" r="40" stroke="url(#blueGradient)" strokeWidth="3" fill="hsl(217,91%,60%)" fillOpacity="0.15" />
          <text x="0" y="8" textAnchor="middle" fill="hsl(217,91%,70%)" fontSize="32">👤</text>
          <rect x="-30" y="50" width="60" height="8" rx="4" fill="hsl(217,91%,60%)" fillOpacity="0.4" />
        </g>
        
        {/* Connection lines */}
        <path d="M 160 420 L 280 420" stroke="hsl(217,91%,60%)" strokeWidth="2" opacity="0.3" strokeDasharray="5 5" />
        <path d="M 360 420 L 480 420" stroke="hsl(174,72%,56%)" strokeWidth="2" opacity="0.3" strokeDasharray="5 5" />
      </g>
      
      {/* Floating notes */}
      <g>
        <rect x="1100" y="220" width="140" height="110" rx="6" fill="hsl(50,100%,65%)" fillOpacity="0.15" stroke="hsl(50,100%,65%)" strokeWidth="2" />
        <line x1="1115" y1="250" x2="1210" y2="250" stroke="hsl(50,100%,55%)" strokeWidth="2" opacity="0.5" />
        <line x1="1115" y1="275" x2="1195" y2="275" stroke="hsl(50,100%,55%)" strokeWidth="2" opacity="0.5" />
        <line x1="1115" y1="300" x2="1200" y2="300" stroke="hsl(50,100%,55%)" strokeWidth="2" opacity="0.5" />
      </g>
      
      <g>
        <rect x="1100" y="360" width="140" height="110" rx="6" fill="hsl(340,100%,75%)" fillOpacity="0.15" stroke="hsl(340,100%,75%)" strokeWidth="2" />
        <line x1="1115" y1="390" x2="1210" y2="390" stroke="hsl(340,100%,70%)" strokeWidth="2" opacity="0.5" />
        <line x1="1115" y1="415" x2="1195" y2="415" stroke="hsl(340,100%,70%)" strokeWidth="2" opacity="0.5" />
        <line x1="1115" y1="440" x2="1200" y2="440" stroke="hsl(340,100%,70%)" strokeWidth="2" opacity="0.5" />
      </g>
      
      {/* Cursor indicators */}
      <g>
        <path d="M 450 160 L 450 175 L 458 170 Z" fill="hsl(217,91%,60%)" opacity="0.8" />
        <text x="465" y="172" fill="hsl(217,91%,70%)" fontSize="14" fontWeight="600" fontFamily="system-ui">Alex</text>
        
        <path d="M 800 360 L 800 375 L 808 370 Z" fill="hsl(174,72%,56%)" opacity="0.8" />
        <text x="815" y="372" fill="hsl(174,72%,66%)" fontSize="14" fontWeight="600" fontFamily="system-ui">Sarah</text>
      </g>
      
      {/* Glow effects */}
      <ellipse cx="230" cy="270" rx="140" ry="90" fill="url(#blueGradient)" opacity="0.05" />
      <ellipse cx="930" cy="270" rx="140" ry="90" fill="url(#blueGradient)" opacity="0.05" />
      <ellipse cx="320" cy="420" rx="120" ry="80" fill="url(#tealGradient)" opacity="0.05" />
    </g>
  </svg>
);

export default ProductPreview;
