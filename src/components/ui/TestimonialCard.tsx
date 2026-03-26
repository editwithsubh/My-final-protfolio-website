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
    <div className="bg-gradient-to-br from-[#FFE87C] to-[#FFD523] rounded-xl p-6 md:p-8 relative overflow-hidden h-full flex flex-col md:flex-row gap-6 items-start shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_4px_20px_rgba(0,0,0,0.08)] border border-[#F3C623]/50">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10 pointer-events-none" />

      {/* Left Column: User Info */}
      <div className="flex flex-col flex-shrink-0 w-full md:w-52 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-white/80 shadow-sm shrink-0">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          </div>
          <Sparkles className="w-8 h-8 text-deep-black mt-2 opacity-80" strokeWidth={1.5} />
        </div>
        
        <div className="mt-5">
          <h4 className="font-heading font-extrabold text-deep-black text-[17px] leading-tight mb-1">{name}</h4>
          <p className="font-body text-deep-black/70 text-sm font-medium">{role}</p>
        </div>
        
        <div className="flex items-center gap-[2px] mt-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-[18px] h-[18px] ${
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
      <div className="flex-1 relative z-10 md:pt-2">
        <p className="font-body text-deep-black/90 leading-relaxed text-[15px] md:text-base font-medium">
          {text}
        </p>
      </div>
    </div>
  );
}
