export default function FeatureCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-12 sm:mt-16 px-2 relative z-0">
      <div className="animate-fade-in-up feature-card group">
        <div className="feature-card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
        <h3 className="text-sm font-semibold mt-2 mb-1">Lossless Background Removal</h3>
        <p className="text-xs text-white/60">Background removal in seconds without losing original quality</p>
      </div>

      <div className="animate-fade-in-up feature-card group">
        <div className="feature-card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <circle cx="13.5" cy="6.5" r="2.5"/>
            <circle cx="17.5" cy="10.5" r="2.5"/>
            <circle cx="8.5" cy="7.5" r="2.5"/>
            <circle cx="6.5" cy="12.5" r="2.5"/>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.1 2.5-.3"/>
          </svg>
        </div>
        <h3 className="text-sm font-semibold mt-2 mb-1">Custom Colors</h3>
        <p className="text-xs text-white/60">Choose from a rich color palette</p>
      </div>

      <div className="animate-fade-in-up feature-card group">
        <div className="feature-card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <h3 className="text-sm font-semibold mt-2 mb-1">Custom Backgrounds</h3>
        <p className="text-xs text-white/60">Upload your own background images</p>
      </div>
    </div>
  );
}