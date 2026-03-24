import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { Mail, Instagram, Twitter, Send, Clock, MapPin, MessageCircle } from "lucide-react";
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
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setSubmitted(false);
      timeoutRef.current = null;
    }, 3000);
  };

  return (
    <>
      {/* Hero strip */}
      <section className="section-dark pt-32 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-handwritten text-xl text-orange mb-3">let's work together</p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider text-off-white leading-[0.95]">
              GET IN <span className="highlight-orange">TOUCH</span>
            </h1>
            <p className="font-body text-mid-gray mt-4 max-w-lg mx-auto leading-relaxed">
              Got a project in mind? Whether it's a YouTube video, brand film, or motion graphics — I'd love to hear about it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick info cards */}
      <section className="section-light py-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Mail, title: "Email Me", detail: "hello@editxsubh.com", href: "mailto:hello@editxsubh.com" },
              { icon: Clock, title: "Response Time", detail: "Within 24 hours", href: null },
              { icon: MapPin, title: "Based In", detail: "India · Remote Worldwide", href: null },
            ].map(({ icon: Icon, title, detail, href }) => (
              <StaggerItem key={title}>
                <div className="bg-near-black rounded-xl p-6 flex items-start gap-4 group hover:ring-2 hover:ring-orange/40 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-orange/15 flex items-center justify-center shrink-0 group-hover:bg-orange/25 transition-colors">
                    <Icon size={18} className="text-orange" />
                  </div>
                  <div>
                    <p className="font-heading text-sm text-mid-gray">{title}</p>
                    {href ? (
                      <a href={href} className="font-body text-off-white hover:text-orange transition-colors text-sm">
                        {detail}
                      </a>
                    ) : (
                      <p className="font-body text-off-white text-sm">{detail}</p>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="section-light pb-24 pt-8">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
            {/* Form — 3 cols */}
            <ScrollReveal direction="left" className="lg:col-span-3">
              <div className="bg-near-black rounded-2xl p-8 md:p-10">
                <div className="flex items-center gap-2 mb-8">
                  <MessageCircle size={20} className="text-orange" />
                  <h2 className="font-heading text-lg text-off-white">Send a Message</h2>
                </div>

                {submitted ? (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-orange/20 flex items-center justify-center mx-auto mb-4">
                      <Send size={24} className="text-orange" />
                    </div>
                    <p className="font-heading text-xl text-off-white mb-1">Message Sent!</p>
                    <p className="font-body text-mid-gray text-sm">I'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Row: Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder=" "
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="peer w-full bg-dark-gray/30 border border-dark-gray focus:border-orange rounded-lg text-off-white font-body pt-5 pb-2 px-4 outline-none transition-colors"
                        />
                        <label className="absolute left-4 top-1.5 text-mid-gray text-xs font-body peer-focus:text-orange peer-[:not(:placeholder-shown)]:text-orange transition-colors">
                          Your Name
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder=" "
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="peer w-full bg-dark-gray/30 border border-dark-gray focus:border-orange rounded-lg text-off-white font-body pt-5 pb-2 px-4 outline-none transition-colors"
                        />
                        <label className="absolute left-4 top-1.5 text-mid-gray text-xs font-body peer-focus:text-orange peer-[:not(:placeholder-shown)]:text-orange transition-colors">
                          Email Address
                        </label>
                      </div>
                    </div>

                    {/* Row: Project Type + Budget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="relative">
                        <select
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="w-full bg-dark-gray/30 border border-dark-gray focus:border-orange rounded-lg text-off-white font-body pt-5 pb-2 px-4 outline-none transition-colors appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-near-black">Select type…</option>
                          <option value="youtube" className="bg-near-black">YouTube Editing</option>
                          <option value="social" className="bg-near-black">Social Media</option>
                          <option value="motion" className="bg-near-black">Motion Graphics</option>
                          <option value="brand" className="bg-near-black">Brand Film</option>
                          <option value="other" className="bg-near-black">Other</option>
                        </select>
                        <label className="absolute left-4 top-1.5 text-mid-gray text-xs font-body">
                          Project Type
                        </label>
                      </div>
                      <div className="relative">
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full bg-dark-gray/30 border border-dark-gray focus:border-orange rounded-lg text-off-white font-body pt-5 pb-2 px-4 outline-none transition-colors appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-near-black">Select range…</option>
                          <option value="5k-10k" className="bg-near-black">₹5,000 — ₹10,000</option>
                          <option value="10k-25k" className="bg-near-black">₹10,000 — ₹25,000</option>
                          <option value="25k-50k" className="bg-near-black">₹25,000 — ₹50,000</option>
                          <option value="50k+" className="bg-near-black">₹50,000+</option>
                        </select>
                        <label className="absolute left-4 top-1.5 text-mid-gray text-xs font-body">
                          Budget
                        </label>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="relative">
                      <textarea
                        required
                        rows={5}
                        placeholder=" "
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="peer w-full bg-dark-gray/30 border border-dark-gray focus:border-orange rounded-lg text-off-white font-body pt-5 pb-2 px-4 outline-none transition-colors resize-none"
                      />
                      <label className="absolute left-4 top-1.5 text-mid-gray text-xs font-body peer-focus:text-orange peer-[:not(:placeholder-shown)]:text-orange transition-colors">
                        Tell me about your project
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-orange text-primary-foreground font-heading font-bold text-base rounded-full hover:bg-orange-dark active:scale-[0.97] transition-all duration-250 flex items-center justify-center gap-2"
                    >
                      Send Message <Send size={18} />
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Sidebar — 2 cols */}
            <ScrollReveal direction="right" className="lg:col-span-2">
              <div className="space-y-6">
                {/* Mini about */}
                <div className="bg-near-black rounded-2xl p-8">
                  <p className="font-handwritten text-orange text-lg mb-3">about me</p>
                  <p className="font-body text-off-white/80 text-sm leading-relaxed mb-4">
                    I'm Shubham — a video editor & motion designer helping creators and brands craft cinematic stories. With 3+ years of editing experience, I specialize in YouTube content, brand films, and social media visuals.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Premiere Pro", "After Effects", "DaVinci Resolve", "Photoshop"].map((tool) => (                      <span
                        key={tool}
                        className="px-3 py-1 rounded-full bg-dark-gray/50 text-mid-gray text-xs font-body"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social */}
                <div className="bg-near-black rounded-2xl p-8">
                  <p className="font-heading text-sm text-mid-gray mb-4">Connect on socials</p>
                  <div className="space-y-3">
                    {[
                      { icon: Instagram, href: "https://instagram.com/editxshubh", label: "Instagram", handle: "@editxshubh" },
                      { icon: Twitter, href: "https://twitter.com/editxsubh", label: "Twitter", handle: "@editxsubh" },
                    ].map(({ icon: Icon, href, label, handle }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-gray/40 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full bg-deep-black flex items-center justify-center text-off-white group-hover:bg-orange transition-colors">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="font-body text-off-white text-sm">{label}</p>
                          <p className="font-body text-mid-gray text-xs">{handle}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick note */}
                <div className="bg-yellow-highlight/10 border border-yellow-highlight/20 rounded-2xl p-6">
                  <p className="font-handwritten text-orange text-base leading-relaxed">
                    ↳ "I'm always open to exciting projects and collaborations. Don't hesitate to reach out!"
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
