import { Star, Sparkles } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}

export function TestimonialCard({ name, role, avatar, rating, text }: TestimonialCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#FFE87C] to-[#FFD523] rounded-xl p-5 md:p-6 relative overflow-hidden h-full flex flex-col md:flex-row gap-5 items-start shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_4px_20px_rgba(0,0,0,0.08)] border border-[#F3C623]/50">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl transform translate-x-8 -translate-y-8 pointer-events-none" />

      {/* Left Column: User Info */}
      <div className="flex flex-col flex-shrink-0 w-full md:w-48 relative z-10">
        <div className="flex items-start gap-3">
          <div className="w-[48px] h-[48px] rounded-full overflow-hidden border-2 border-white/80 shadow-sm shrink-0">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          </div>
          <Sparkles className="w-6 h-6 text-deep-black mt-1 opacity-80" strokeWidth={1.5} />
        </div>
        
        <div className="mt-4">
          <h4 className="font-heading font-extrabold text-deep-black text-base leading-tight mb-1">{name}</h4>
          <p className="font-body text-deep-black/70 text-xs font-medium">{role}</p>
        </div>
        
        <div className="flex items-center gap-[2px] mt-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-[14px] h-[14px] ${
                i < rating ? "fill-deep-black text-deep-black" : "text-deep-black/20"
              }`} 
            />
          ))}
        </div>
      </div>

      {/* Vertical Divider (Hidden on mobile) */}
      <div className="hidden md:block w-[1px] self-stretch bg-deep-black/10 mx-2" />
      {/* Horizontal Divider (Mobile only) */}
      <div className="block md:hidden h-[1px] w-full bg-deep-black/10 my-2" />

      {/* Right Column: Text */}
      <div className="flex-1 relative z-10 md:pt-1">
        <p className="font-body text-deep-black/90 leading-relaxed text-sm md:text-[15px] font-medium">
          {text}
        </p>
      </div>
    </div>
  );
}
