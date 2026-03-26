import { useState, useEffect } from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Winchester Blain",
    role: "Actor / Model",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    text: "A learning edit is exactly something that I should have begun long ago. The concepts are nothing new, they are literally the ad you know block. Very highly recommended training.",
  },
  {
    id: 2,
    name: "Henrietta Sten",
    role: "Top Journalist 47",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    text: "This is thank you text. I found myself thinking about learning edit. I would simply recommend it for any leader that is now trying to teach new teams the ad tech.",
  },
  {
    id: 3,
    name: "Alex Mercer",
    role: "Content Creator",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    text: "Shubham's edits completely transformed my channel. The retention rate went up by 40% in just two weeks. Highly recommended for pacing and sound design!",
  },
];

export default function TestimonialsSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className="section-light py-16 md:py-20 bg-[#FCFAF5]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[120px]">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-deep-black tracking-wider">
              Testimonials
            </h2>
          </div>
        </ScrollReveal>

        <div className="relative mx-auto w-full max-w-[900px]">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-8">
              {testimonials.map((t, index) => (
                <CarouselItem key={t.id} className="pl-4 md:pl-8 md:basis-1/2">
                  <ScrollReveal delay={0.1 * index}>
                    <TestimonialCard {...t} />
                  </ScrollReveal>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Custom Navigation */}
            <div className="flex items-center justify-center gap-4 mt-10 pb-2">
              <button
                onClick={() => api?.scrollPrev()}
                className="w-10 h-10 rounded-full bg-deep-black text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 shadow-md"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
              
              <div className="font-heading font-bold text-sm text-deep-black/60 tracking-[0.15em] uppercase w-20 text-center">
                {current} OF {count}
              </div>
              
              <button
                onClick={() => api?.scrollNext()}
                className="w-10 h-10 rounded-full bg-deep-black text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 shadow-md"
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
