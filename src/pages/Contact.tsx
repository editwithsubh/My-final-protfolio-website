import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { Mail, Instagram, Twitter, Linkedin, Send, Clock, MapPin, MessageCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const apiBase = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send message.');
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", projectType: "", budget: "", message: "" });
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setSubmitted(false);
        timeoutRef.current = null;
      }, 5000);
    } catch (err: any) {
      console.error('Contact form error:', err);
      setSubmitError(err.message || 'Failed to send message. Please try emailing directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-off-white text-deep-black font-body overflow-x-hidden min-h-screen">
      
      {/* Hero Strip */}
      <section className="section-light pt-32 pb-16 relative">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            className="text-center relative inline-block mx-auto w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Hand drawn loop */}
            <div className="absolute top-0 right-1/4 opacity-80 hidden md:flex items-end gap-2 -translate-y-8">
               <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className="-rotate-12">
                  <path d="M5 10C25 5 45 30 55 15" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
                  <path d="M50 10L55 15L60 20" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
               </svg>
               <span className="font-handwritten text-xl text-mid-gray -rotate-3">Let's talk</span>
            </div>

            <p className="font-handwritten text-xl text-orange mb-3 inline-block -rotate-2 bg-brutal-yellow px-2 border border-deep-black shadow-[2px_2px_0px_#111]">
               Available for work
            </p>
            <h1 className="font-display text-[14vw] md:text-7xl lg:text-[100px] tracking-tight text-deep-black leading-[0.9] uppercase mt-2 break-words md:break-normal">
              SEND A <span className="text-white bg-deep-black px-4 border-2 border-deep-black shadow-[4px_4px_0px_theme(colors.brutal-yellow)]">MESSAGE</span>
            </h1>
            <p className="font-mono mt-6 mb-4 max-w-lg mx-auto text-sm bg-white border-2 border-deep-black shadow-[4px_4px_0px_#111] p-4 font-bold">
              Got a project in mind? Whether it's a YouTube video, brand film, or motion graphics — I'd love to hear about it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="pb-32 relative">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact Form Container (Left 8 cols) */}
            <ScrollReveal direction="left" className="lg:col-span-8 order-last lg:order-last">
              <div className="bg-white border-4 border-deep-black shadow-[8px_8px_0px_#111] p-8 md:p-12 relative z-20">
                {/* Visual Tape */}
                <div className="absolute -top-4 -left-4 w-20 h-8 bg-brutal-yellow rotate-[-10deg] border border-deep-black/20 mix-blend-multiply opacity-80" />
                <div className="absolute -bottom-5 right-10 w-24 h-8 bg-black rotate-[5deg] opacity-90" />

                <div className="flex items-center gap-3 mb-10 border-b-2 border-dashed border-deep-black pb-4">
                  <div className="w-10 h-10 bg-brutal-yellow border-2 border-deep-black flex items-center justify-center shadow-[2px_2px_0px_#111]">
                     <MessageCircle size={20} className="text-deep-black" />
                  </div>
                  <h2 className="font-heading font-black uppercase text-xl text-deep-black">Transmission Link</h2>
                </div>

                {submitted ? (
                  <motion.div
                    className="text-center py-20 bg-light-gray border-2 border-deep-black"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-brutal-yellow border-[3px] border-deep-black flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_#111]">
                      <Send size={32} className="text-deep-black" />
                    </div>
                    <p className="font-heading font-black text-2xl text-deep-black mb-2 uppercase">Message Secured</p>
                    <p className="font-mono font-bold text-deep-black/60 text-sm">I'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Row: Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-xs font-bold text-deep-black uppercase">Your Name *</label>
                        <input
                          type="text"
                          required
                          autoComplete="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-off-white border-2 border-deep-black p-3 sm:py-4 text-base text-deep-black font-body outline-none focus:bg-brutal-yellow/20 transition-colors shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-xs font-bold text-deep-black uppercase">Email Address *</label>
                        <input
                          type="email"
                          required
                          autoComplete="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-off-white border-2 border-deep-black p-3 sm:py-4 text-base text-deep-black font-body outline-none focus:bg-brutal-yellow/20 transition-colors shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)]"
                        />
                      </div>
                    </div>

                    {/* Row: Project Type + Budget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-xs font-bold text-deep-black uppercase">Project Type</label>
                        <div className="relative">
                          <select
                            value={formData.projectType}
                            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                            className="w-full bg-off-white border-2 border-deep-black p-3 sm:py-4 pr-10 text-base text-deep-black font-body outline-none focus:bg-brutal-yellow/20 transition-colors shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)] appearance-none cursor-pointer rounded-none"
                          >
                            <option value="">Select type…</option>
                            <option value="youtube">YouTube Editing</option>
                            <option value="social">Social Media (Short Form)</option>
                            <option value="motion">Motion Graphics</option>
                            <option value="brand">Brand Film</option>
                            <option value="other">Other</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-deep-black">
                              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                         <label className="font-mono text-xs font-bold text-deep-black uppercase">Budget</label>
                        <div className="relative">
                          <select
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            className="w-full bg-off-white border-2 border-deep-black p-3 sm:py-4 pr-10 text-base text-deep-black font-body outline-none focus:bg-brutal-yellow/20 transition-colors shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)] appearance-none cursor-pointer rounded-none"
                          >
                            <option value="">Select range…</option>
                            <option value="5k-10k">₹5,000 — ₹10,000</option>
                            <option value="10k-25k">₹10,000 — ₹25,000</option>
                            <option value="25k-50k">₹25,000 — ₹50,000</option>
                            <option value="50k+">₹50,000+</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-deep-black">
                              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message Area */}
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-xs font-bold text-deep-black uppercase">Overview *</label>
                      <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                         className="w-full bg-off-white border-2 border-deep-black p-3 sm:py-4 text-base text-deep-black font-body outline-none focus:bg-brutal-yellow/20 transition-colors shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)] resize-none"
                      />
                    </div>

                    {submitError && (
                      <div className="font-mono text-xs text-white bg-red-600 p-3 border-2 border-deep-black shadow-[3px_3px_0px_#111] inline-block">
                        [ERROR] {submitError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 sm:py-5 bg-deep-black text-white font-mono font-bold uppercase text-sm sm:text-lg hover:bg-brutal-yellow hover:text-deep-black hover:border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_#111] border-2 border-transparent active:translate-y-0 active:shadow-none transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Transmitting...' : <>Send Inquiry <Send className="w-5 h-5" /></>}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Sidebar Sticky Panel (Right 4 cols) */}
            <ScrollReveal direction="right" className="lg:col-span-4 space-y-8 order-first lg:order-last">
               
               {/* Quick Info Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                 {[
                   { icon: Mail, title: "Email", detail: "shubhams6068@gmail.com", href: "mailto:shubhams6068@gmail.com" },
                   { icon: Clock, title: "Response", detail: "Within 24 Hours", href: null },
                   { icon: MapPin, title: "Location", detail: "India / Remote", href: null },
                 ].map(({ icon: Icon, title, detail, href }) => (
                   <div key={title} className="bg-white border-2 border-deep-black p-4 shadow-[4px_4px_0px_#111] flex items-center gap-4 hover:bg-brutal-yellow transition-colors group cursor-default">
                     <div className="w-10 h-10 border-2 border-deep-black bg-off-white flex items-center justify-center group-hover:bg-white transition-colors">
                       <Icon size={20} className="text-deep-black" />
                     </div>
                     <div>
                       <p className="font-mono text-[10px] font-bold text-deep-black/60 uppercase">{title}</p>
                       {href ? (
                         <a href={href} className="font-heading font-black text-xs sm:text-sm uppercase block hover:underline break-all">
                           {detail}
                         </a>
                       ) : (
                         <p className="font-heading font-black text-xs sm:text-sm uppercase break-all">{detail}</p>
                       )}
                     </div>
                   </div>
                 ))}
               </div>

               {/* Social Callout Card */}
               <div className="bg-[#D8A1FF] border-2 border-deep-black p-6 shadow-[6px_6px_0px_#111] relative">
                  {/* Pinned top tape */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/50 border border-deep-black backdrop-blur-sm -rotate-3" />
                  
                  <h3 className="font-heading font-black text-2xl uppercase mb-1">Stalk My Work</h3>
                  <p className="font-mono text-xs text-deep-black/70 font-bold mb-6">See day-to-day updates and snippets.</p>
                  
                  <div className="flex flex-col gap-3">
                    {[
                      { icon: Instagram, href: "https://www.instagram.com/editwithshub/", label: "Instagram" },
                      { icon: Twitter, href: "https://x.com/editxshub", label: "X" },
                      { icon: Linkedin, href: "https://www.linkedin.com/in/editxsubh/", label: "LinkedIn" },
                    ].map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white border-2 border-deep-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_#111] transition-all group"
                      >
                        <Icon size={18} className="text-deep-black group-hover:scale-110 transition-transform" />
                        <span className="font-mono font-bold uppercase text-sm">{label}</span>
                      </a>
                    ))}
                  </div>
               </div>

            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
