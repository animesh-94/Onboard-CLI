import { motion } from 'framer-motion';

const testimonials = [
  { quote: "Onboard has completely changed how our team tackles legacy code. What used to take weeks of digging through spaghetti now takes 5 minutes.", name: "Sarah Chen", role: "Staff Engineer at TechCorp", avatar: "https://i.pravatar.cc/150?img=1" },
  { quote: "The AST visualization is pure magic. Seeing the blast radius of a change before I even commit gives me so much confidence.", name: "Alex Rivera", role: "Backend Lead", avatar: "https://i.pravatar.cc/150?img=11" },
  { quote: "We integrated Onboard into our CI/CD pipeline and the Context Owner Engine has eliminated our PR review bottleneck entirely.", name: "David Kim", role: "Engineering Manager", avatar: "https://i.pravatar.cc/150?img=33" },
  { quote: "Finally, a local-first tool that actually respects my code privacy while giving me cloud-grade insights. Absolutely essential.", name: "Elena Rostova", role: "Senior Developer", avatar: "https://i.pravatar.cc/150?img=44" },
  { quote: "I used to dread onboarding onto new microservices. Now I just spin up the execution canvas and I understand the data flow instantly.", name: "Marcus Johnson", role: "Fullstack Engineer", avatar: "https://i.pravatar.cc/150?img=15" },
  { quote: "The gamified sandbox evaluator is a brilliant way to train junior devs. It's interactive, secure, and incredibly effective.", name: "Darcey Grace", role: "MTS at StartupX", avatar: "https://i.pravatar.cc/150?img=5" },
];

export default function Testimonials() {
  return (
    <section className="relative w-full max-w-[1442px] mx-auto bg-black py-32 px-6 md:px-20 border-x border-[#1c1c1c] text-white">
      <div className="flex flex-col items-center text-center mb-20">
        <span className="text-[11px] font-mono tracking-[0.2em] text-[#555] uppercase mb-6 block">Wall of Love</span>
        <h2 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.03em] leading-[1.1] mb-6">
          Loved by <span className="text-[#888]">builders.</span>
        </h2>
        <p className="text-[18px] text-[#777] font-light max-w-[600px] leading-[1.6]">
          See how engineering teams are using Onboard to navigate their codebases faster and safer.
        </p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 relative z-10">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="break-inside-avoid bg-[#050505] border border-white/[0.05] hover:border-white/10 rounded-2xl p-8 transition-colors duration-300 shadow-xl"
          >
            <p className="text-[15px] text-[#aaa] leading-[1.7] mb-8 font-light">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-4">
              <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border border-white/10 grayscale hover:grayscale-0 transition-all duration-300" />
              <div>
                <h4 className="text-[14px] font-medium text-white">{t.name}</h4>
                <p className="text-[12px] text-[#666]">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom fade for a seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-20"></div>
    </section>
  );
}
