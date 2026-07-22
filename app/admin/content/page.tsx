"use client";

import React, { useEffect, useState } from "react";
import { Save, Loader2, AlertCircle, PenTool, ImageOff, Trash2, Eye, X } from "lucide-react";
import { useAdminTheme } from "@/components/providers/AdminTheme";
import { auth } from "@/lib/firebase";

interface SiteContent {
  hero: { title: string; subtitle: string; description: string };
  services_title: string;
  services_subtitle: string;
  services: Array<{ id: string; title: string; desc: string; features: string[]; price: string }>;
  about_title: string;
  about_subtitle: string;
  about_description: string;
  about_values: Array<{ title: string; description: string }>;
  why_choose_title: string;
  why_choose_items: Array<{ title: string; description: string }>;
  testimonials_title: string;
  testimonials: Array<{ name: string; event_type: string; quote: string }>;
  faq_title: string;
  faq: Array<{ question: string; answer: string }>;
  cta_title: string;
  cta_subtitle: string;
  cta_button_text: string;
  contact_title: string;
  gallery_title: string;
}

const defaultContent: SiteContent = {
  hero: { title: "Where passion meets creativity", subtitle: "Hyderabad's Finest", description: "Luxury floral design for weddings, housewarming, baby showers & every celebration that deserves beauty." },
  services_title: "Our Services",
  services_subtitle: "Crafted with love",
  services: [
    { id: "wedding", title: "Wedding", desc: "Grand floral arrangements, mandap decoration & complete venue transformation.", features: ["Mandap decoration", "Floral arches", "Table centerpieces", "Entrance decor", "Bridal bouquet", "Stage decoration"], price: "₹15,000 — ₹2,00,000" },
    { id: "housewarming", title: "Housewarming", desc: "Traditional floral welcome for your new home.", features: ["Toran & entrance decoration", "Rangoli designs", "Floral pillars", "Living room decoration", "Puja room setup", "Welcome board"], price: "₹2,000 — ₹25,000" },
    { id: "baby-shower", title: "Baby Shower", desc: "Adorable themed decorations, balloon arrangements & photo booths.", features: ["Themed balloon arches", "Photo booth setups", "Cake table decoration", "Welcome board design", "Centerpiece arrangements", "Cradle & crib decoration"], price: "₹3,000 — ₹15,000" },
    { id: "pooja", title: "Pooja Decoration", desc: "Sacred and serene decorations for all religious ceremonies.", features: ["Puja mandap decoration", "Floral garlands & malas", "Rangoli designs", "Deity decoration", "Sacred entrance torans", "Havan kund decoration"], price: "₹1,500 — ₹10,000" },
    { id: "corporate", title: "Corporate Event", desc: "Professional floral design for office events & celebrations.", features: ["Conference table decor", "Entrance floral display", "Branded flower arrangements", "Lounge area decoration", "Photo wall setup", "Award ceremony decor"], price: "₹5,000 — ₹50,000" },
    { id: "custom", title: "Custom Decoration", desc: "Tell us your vision — we'll create something extraordinary.", features: ["Custom theme design", "Flexible budgets", "Any occasion", "Personal consultation", "3D mockup preview", "Full venue transformation"], price: "₹1,000 — ₹1,00,000+" },
  ],
  about_title: "Where passion meets creativity",
  about_subtitle: "Our Story",
  about_description: "Founded in the heart of Hyderabad, we bring together traditional Indian floral artistry with modern design sensibilities. Every petal, every arrangement, every decoration is crafted with love and an unwavering commitment to making your celebration unforgettable.",
  about_values: [
    { title: "Artistry", description: "Every arrangement is a masterpiece — blending traditional Indian motifs with contemporary elegance." },
    { title: "Quality", description: "We source the freshest flowers from local growers, ensuring vibrant colors and lasting beauty." },
    { title: "Personalization", description: "No two celebrations are the same. We listen, understand, and create decorations that tell your story." },
  ],
  why_choose_title: "Why Choose Us",
  why_choose_items: [
    { title: "10+ Years Experience", description: "Deep expertise in Indian floral decoration traditions and modern trends." },
    { title: "500+ Events Decorated", description: "From intimate gatherings to grand weddings — we've handled every scale." },
    { title: "Fresh Flowers Daily", description: "Sourced from local growers for peak freshness and vibrant colors." },
    { title: "24/7 Support", description: "Our team is available round the clock for emergencies and last-minute changes." },
  ],
  testimonials_title: "What Our Clients Say",
  testimonials: [
    { name: "Priya Sharma", event_type: "Wedding", quote: "The mandap decoration was absolutely stunning — our guests couldn't stop taking photos!" },
    { name: "Rajesh Kumar", event_type: "Housewarming", quote: "They transformed our new home into a floral paradise. The toran was breathtaking." },
    { name: "Anitha Reddy", event_type: "Baby Shower", quote: "From balloon arches to the photo booth — every detail was perfect and personal." },
  ],
  faq_title: "Frequently Asked Questions",
  faq: [
    { question: "How do I book a decoration?", answer: "Simply fill out our booking form with your event details. We'll review it and confirm within 2 hours." },
    { question: "What's the minimum budget?", answer: "Our packages start from ₹1,500 for basic pooja decoration. Custom packages are available for any budget." },
    { question: "Can I cancel or reschedule?", answer: "Yes! You can cancel or reschedule from our track page anytime for pending/confirmed bookings." },
    { question: "Do you provide setup and teardown?", answer: "Yes, our team handles complete setup before the event and teardown afterward." },
  ],
  cta_title: "Ready to celebrate?",
  cta_subtitle: "Let us turn your event into a floral masterpiece",
  cta_button_text: "Book Your Decoration",
  contact_title: "Get in Touch",
  gallery_title: "Our Gallery",
};

type SectionKey = "hero" | "services" | "about" | "why_choose" | "testimonials" | "faq" | "cta" | "contact" | "gallery";

const sections: Array<{ key: SectionKey; label: string }> = [
  { key: "hero", label: "Hero Section" },
  { key: "services", label: "Services" },
  { key: "about", label: "About Page" },
  { key: "why_choose", label: "Why Choose Us" },
  { key: "testimonials", label: "Testimonials" },
  { key: "faq", label: "FAQ" },
  { key: "cta", label: "Call to Action" },
];

export default function AdminContent() {
  const { theme } = useAdminTheme();
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content").then(r => r.json()).then(data => {
      if (data.content && Object.keys(data.content).length > 0) {
        setContent({ ...defaultContent, ...data.content });
      }
      setIsLoaded(true);
    }).catch(() => setIsLoaded(true));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) { alert("Please log in first."); setIsSaving(false); return; }
      const idToken = await currentUser.getIdToken();
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.error) { alert(data.error); } else { alert("Content saved! Changes will appear on the website."); }
    } catch { alert("Failed to save content."); }
    setIsSaving(false);
  };

  const updateField = (path: string, value: string) => {
    const newContent = JSON.parse(JSON.stringify(content));
    const keys = path.split(".");
    let obj = newContent;
    for (let i = 0; i < keys.length - 1; i++) { obj = obj[keys[i]]; }
    obj[keys[keys.length - 1]] = value;
    setContent(newContent);
  };

  const updateArrayItem = (arrayKey: string, index: number, field: string, value: string) => {
    const newContent = JSON.parse(JSON.stringify(content));
    const arr = newContent[arrayKey] as Array<Record<string, unknown>>;
    arr[index][field] = value;
    setContent(newContent);
  };

  const addArrayItem = (arrayKey: string, template: Record<string, unknown>) => {
    const newContent = JSON.parse(JSON.stringify(content));
    const arr = newContent[arrayKey] as Array<Record<string, unknown>>;
    arr.push(template);
    setContent(newContent);
  };

  const removeArrayItem = (arrayKey: string, index: number) => {
    const newContent = JSON.parse(JSON.stringify(content));
    const arr = newContent[arrayKey] as Array<Record<string, unknown>>;
    arr.splice(index, 1);
    setContent(newContent);
  };

  const updateFeature = (serviceIndex: number, featureIndex: number, value: string) => {
    const newContent = JSON.parse(JSON.stringify(content));
    newContent.services[serviceIndex].features[featureIndex] = value;
    setContent(newContent);
  };

  const addFeature = (serviceIndex: number) => {
    const newContent = JSON.parse(JSON.stringify(content));
    newContent.services[serviceIndex].features.push("New feature");
    setContent(newContent);
  };

  const removeFeature = (serviceIndex: number, featureIndex: number) => {
    const newContent = JSON.parse(JSON.stringify(content));
    newContent.services[serviceIndex].features.splice(featureIndex, 1);
    setContent(newContent);
  };

  if (!isLoaded) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]" style={{ background: theme.bgPrimary }}>
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputStyle = { background: theme.bgInput, color: theme.textPrimary, border: `1px solid ${theme.borderColor}` };
  const labelStyle = { color: theme.textSecondary };

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ background: theme.bgPrimary }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold" style={{ color: theme.textPrimary }}>
            <PenTool className="w-5 h-5 inline mr-2 text-gold" />Edit Website
          </h1>
          <p className="text-sm font-body mt-1" style={{ color: theme.textSecondary }}>Edit every text, title, description, and button on your website</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-body font-semibold bg-gold text-charcoal hover:bg-gold-light transition-colors disabled:opacity-50">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save All
        </button>
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map(s => (
          <button key={s.key} onClick={() => setActiveSection(s.key)}
            className="px-3 py-2 rounded-lg text-xs font-body font-medium transition-colors"
            style={{
              background: activeSection === s.key ? "rgba(184,147,95,0.15)" : theme.bgHover,
              color: activeSection === s.key ? "#B8935F" : theme.textSecondary,
              border: `1px solid ${activeSection === s.key ? "#B8935F" : theme.borderColor}`,
            }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ─── HERO ────────────────────────────────────────────────── */}
      {activeSection === "hero" && (
        <div className="space-y-4 rounded-2xl p-6" style={{ background: theme.bgCard, border: `1px solid ${theme.borderColor}` }}>
          <h2 className="font-heading font-semibold" style={{ color: theme.textPrimary }}>Hero Section</h2>
          <div>
            <label className="block text-xs font-body mb-1" style={labelStyle}>Subtitle</label>
            <input className="w-full h-11 rounded-xl px-4 text-sm font-body focus:outline-none focus:border-gold" style={inputStyle} value={content.hero.subtitle} onChange={e => updateField("hero.subtitle", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-body mb-1" style={labelStyle}>Main Title</label>
            <input className="w-full h-11 rounded-xl px-4 text-sm font-body focus:outline-none focus:border-gold" style={inputStyle} value={content.hero.title} onChange={e => updateField("hero.title", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-body mb-1" style={labelStyle}>Description</label>
            <textarea className="w-full rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-gold resize-none min-h-[80px]" style={inputStyle} value={content.hero.description} onChange={e => updateField("hero.description", e.target.value)} />
          </div>
        </div>
      )}

      {/* ─── SERVICES ─────────────────────────────────────────────── */}
      {activeSection === "services" && (
        <div className="space-y-4">
          <div className="rounded-2xl p-6" style={{ background: theme.bgCard, border: `1px solid ${theme.borderColor}` }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-body mb-1" style={labelStyle}>Section Title</label>
                <input className="w-full h-11 rounded-xl px-4 text-sm font-body focus:outline-none focus:border-gold" style={inputStyle} value={content.services_title} onChange={e => setContent({...content, services_title: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-body mb-1" style={labelStyle}>Subtitle</label>
                <input className="w-full h-11 rounded-xl px-4 text-sm font-body focus:outline-none focus:border-gold" style={inputStyle} value={content.services_subtitle} onChange={e => setContent({...content, services_subtitle: e.target.value})} />
              </div>
            </div>
          </div>
          {content.services.map((service, i) => (
            <div key={i} className="rounded-2xl p-5" style={{ background: theme.bgCard, border: `1px solid ${theme.borderColor}` }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-medium text-sm capitalize" style={{ color: theme.textPrimary }}>{service.title || `Service ${i + 1}`}</h3>
                {content.services.length > 1 && (
                  <button onClick={() => removeArrayItem("services", i)} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-red-500 hover:bg-red-500/10 font-body">
                    <Trash2 className="w-3 h-3" />Remove
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-body mb-1" style={labelStyle}>Service Name</label>
                    <input className="w-full h-10 rounded-lg px-3 text-sm font-body focus:outline-none focus:border-gold" style={inputStyle} value={service.title} onChange={e => updateArrayItem("services", i, "title", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-body mb-1" style={labelStyle}>Price Range</label>
                    <input className="w-full h-10 rounded-lg px-3 text-sm font-body focus:outline-none focus:border-gold" style={inputStyle} value={service.price} onChange={e => updateArrayItem("services", i, "price", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-body mb-1" style={labelStyle}>Description</label>
                  <textarea className="w-full rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-gold resize-none min-h-[60px]" style={inputStyle} value={service.desc} onChange={e => updateArrayItem("services", i, "desc", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-body mb-1" style={labelStyle}>Features</label>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((f, fi) => (
                      <div key={fi} className="flex items-center gap-1">
                        <input className="h-8 rounded-lg px-2 text-xs font-body focus:outline-none focus:border-gold" style={{ ...inputStyle, width: `${Math.max(f.length * 8, 80)}px` }} value={f} onChange={e => updateFeature(i, fi, e.target.value)} />
                        <button onClick={() => removeFeature(i, fi)} className="w-6 h-6 rounded flex items-center justify-center text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                    <button onClick={() => addFeature(i)} className="h-8 px-2 rounded-lg text-xs text-gold hover:bg-gold/10 font-body" style={{ border: `1px solid #B8935F` }}>+ Add</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => addArrayItem("services", { id: `custom-${Date.now()}`, title: "New Service", desc: "Describe this service", features: ["Feature 1", "Feature 2"], price: "₹X — ₹Y" })}
            className="w-full py-3 rounded-xl text-sm font-body text-gold hover:bg-gold/10 transition-colors" style={{ border: `1px solid #B8935F`, background: theme.bgCard }}>
            + Add New Service
          </button>
        </div>
      )}

      {/* ─── ABOUT ───────────────────────────────────────────────── */}
      {activeSection === "about" && (
        <div className="space-y-4 rounded-2xl p-6" style={{ background: theme.bgCard, border: `1px solid ${theme.borderColor}` }}>
          <h2 className="font-heading font-semibold" style={{ color: theme.textPrimary }}>About Page</h2>
          <div>
            <label className="block text-xs font-body mb-1" style={labelStyle}>Subtitle</label>
            <input className="w-full h-11 rounded-xl px-4 text-sm font-body focus:outline-none focus:border-gold" style={inputStyle} value={content.about_subtitle} onChange={e => setContent({...content, about_subtitle: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-body mb-1" style={labelStyle}>Title</label>
            <input className="w-full h-11 rounded-xl px-4 text-sm font-body focus:outline-none focus:border-gold" style={inputStyle} value={content.about_title} onChange={e => setContent({...content, about_title: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-body mb-1" style={labelStyle}>Description</label>
            <textarea className="w-full rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-gold resize-none min-h-[100px]" style={inputStyle} value={content.about_description} onChange={e => setContent({...content, about_description: e.target.value})} />
          </div>
          <h3 className="text-sm font-heading font-medium mt-4" style={{ color: theme.textPrimary }}>Values</h3>
          {content.about_values.map((v, i) => (
            <div key={i} className="p-3 rounded-xl" style={{ background: theme.bgHover, border: `1px solid ${theme.borderColor}` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-body capitalize" style={{ color: theme.textPrimary }}>{v.title}</span>
                <button onClick={() => removeArrayItem("about_values", i)} className="text-red-400 text-xs hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
              </div>
              <input className="w-full h-9 rounded-lg px-3 text-sm font-body focus:outline-none focus:border-gold mb-2" style={inputStyle} value={v.title} onChange={e => updateArrayItem("about_values", i, "title", e.target.value)} placeholder="Value title" />
              <textarea className="w-full rounded-lg px-3 py-2 text-xs font-body focus:outline-none focus:border-gold resize-none min-h-[40px]" style={inputStyle} value={v.description} onChange={e => updateArrayItem("about_values", i, "description", e.target.value)} placeholder="Value description" />
            </div>
          ))}
          <button onClick={() => addArrayItem("about_values", { title: "New Value", description: "Describe this value" })} className="text-xs text-gold hover:bg-gold/10 px-3 py-2 rounded-lg font-body" style={{ border: `1px solid #B8935F` }}>+ Add Value</button>
        </div>
      )}

      {/* ─── WHY CHOOSE ───────────────────────────────────────────── */}
      {activeSection === "why_choose" && (
        <div className="space-y-4 rounded-2xl p-6" style={{ background: theme.bgCard, border: `1px solid ${theme.borderColor}` }}>
          <h2 className="font-heading font-semibold" style={{ color: theme.textPrimary }}>Why Choose Us</h2>
          <div>
            <label className="block text-xs font-body mb-1" style={labelStyle}>Section Title</label>
            <input className="w-full h-11 rounded-xl px-4 text-sm font-body focus:outline-none focus:border-gold" style={inputStyle} value={content.why_choose_title} onChange={e => setContent({...content, why_choose_title: e.target.value})} />
          </div>
          {content.why_choose_items.map((item, i) => (
            <div key={i} className="p-3 rounded-xl" style={{ background: theme.bgHover, border: `1px solid ${theme.borderColor}` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-body" style={{ color: theme.textPrimary }}>{item.title}</span>
                <button onClick={() => removeArrayItem("why_choose_items", i)} className="text-red-400 text-xs hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
              </div>
              <input className="w-full h-9 rounded-lg px-3 text-sm font-body focus:outline-none focus:border-gold mb-2" style={inputStyle} value={item.title} onChange={e => updateArrayItem("why_choose_items", i, "title", e.target.value)} />
              <textarea className="w-full rounded-lg px-3 py-2 text-xs font-body focus:outline-none focus:border-gold resize-none min-h-[40px]" style={inputStyle} value={item.description} onChange={e => updateArrayItem("why_choose_items", i, "description", e.target.value)} />
            </div>
          ))}
          <button onClick={() => addArrayItem("why_choose_items", { title: "New Point", description: "Describe why customers should choose you" })} className="text-xs text-gold hover:bg-gold/10 px-3 py-2 rounded-lg font-body" style={{ border: `1px solid #B8935F` }}>+ Add Point</button>
        </div>
      )}

      {/* ─── TESTIMONIALS ─────────────────────────────────────────── */}
      {activeSection === "testimonials" && (
        <div className="space-y-4 rounded-2xl p-6" style={{ background: theme.bgCard, border: `1px solid ${theme.borderColor}` }}>
          <h2 className="font-heading font-semibold" style={{ color: theme.textPrimary }}>Testimonials</h2>
          <div>
            <label className="block text-xs font-body mb-1" style={labelStyle}>Section Title</label>
            <input className="w-full h-11 rounded-xl px-4 text-sm font-body focus:outline-none focus:border-gold" style={inputStyle} value={content.testimonials_title} onChange={e => setContent({...content, testimonials_title: e.target.value})} />
          </div>
          {content.testimonials.map((t, i) => (
            <div key={i} className="p-3 rounded-xl" style={{ background: theme.bgHover, border: `1px solid ${theme.borderColor}` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-body" style={{ color: theme.textPrimary }}>{t.name}</span>
                <button onClick={() => removeArrayItem("testimonials", i)} className="text-red-400 text-xs hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <input className="h-9 rounded-lg px-3 text-sm font-body focus:outline-none focus:border-gold" style={inputStyle} value={t.name} onChange={e => updateArrayItem("testimonials", i, "name", e.target.value)} placeholder="Customer name" />
                <input className="h-9 rounded-lg px-3 text-sm font-body focus:outline-none focus:border-gold" style={inputStyle} value={t.event_type} onChange={e => updateArrayItem("testimonials", i, "event_type", e.target.value)} placeholder="Event type" />
              </div>
              <textarea className="w-full rounded-lg px-3 py-2 text-xs font-body focus:outline-none focus:border-gold resize-none min-h-[40px]" style={inputStyle} value={t.quote} onChange={e => updateArrayItem("testimonials", i, "quote", e.target.value)} placeholder="Their quote" />
            </div>
          ))}
          <button onClick={() => addArrayItem("testimonials", { name: "New Customer", event_type: "Event Type", quote: "Their testimonial quote" })} className="text-xs text-gold hover:bg-gold/10 px-3 py-2 rounded-lg font-body" style={{ border: `1px solid #B8935F` }}>+ Add Testimonial</button>
        </div>
      )}

      {/* ─── FAQ ──────────────────────────────────────────────────── */}
      {activeSection === "faq" && (
        <div className="space-y-4 rounded-2xl p-6" style={{ background: theme.bgCard, border: `1px solid ${theme.borderColor}` }}>
          <h2 className="font-heading font-semibold" style={{ color: theme.textPrimary }}>FAQ</h2>
          <div>
            <label className="block text-xs font-body mb-1" style={labelStyle}>Section Title</label>
            <input className="w-full h-11 rounded-xl px-4 text-sm font-body focus:outline-none focus:border-gold" style={inputStyle} value={content.faq_title} onChange={e => setContent({...content, faq_title: e.target.value})} />
          </div>
          {content.faq.map((q, i) => (
            <div key={i} className="p-3 rounded-xl" style={{ background: theme.bgHover, border: `1px solid ${theme.borderColor}` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-body truncate" style={{ color: theme.textPrimary }}>Q: {q.question}</span>
                <button onClick={() => removeArrayItem("faq", i)} className="text-red-400 text-xs hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
              </div>
              <input className="w-full h-9 rounded-lg px-3 text-sm font-body focus:outline-none focus:border-gold mb-2" style={inputStyle} value={q.question} onChange={e => updateArrayItem("faq", i, "question", e.target.value)} placeholder="Question" />
              <textarea className="w-full rounded-lg px-3 py-2 text-xs font-body focus:outline-none focus:border-gold resize-none min-h-[40px]" style={inputStyle} value={q.answer} onChange={e => updateArrayItem("faq", i, "answer", e.target.value)} placeholder="Answer" />
            </div>
          ))}
          <button onClick={() => addArrayItem("faq", { question: "New Question?", answer: "Answer here" })} className="text-xs text-gold hover:bg-gold/10 px-3 py-2 rounded-lg font-body" style={{ border: `1px solid #B8935F` }}>+ Add FAQ</button>
        </div>
      )}

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      {activeSection === "cta" && (
        <div className="space-y-4 rounded-2xl p-6" style={{ background: theme.bgCard, border: `1px solid ${theme.borderColor}` }}>
          <h2 className="font-heading font-semibold" style={{ color: theme.textPrimary }}>Call to Action</h2>
          <div>
            <label className="block text-xs font-body mb-1" style={labelStyle}>Title</label>
            <input className="w-full h-11 rounded-xl px-4 text-sm font-body focus:outline-none focus:border-gold" style={inputStyle} value={content.cta_title} onChange={e => setContent({...content, cta_title: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-body mb-1" style={labelStyle}>Subtitle</label>
            <textarea className="w-full rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-gold resize-none min-h-[80px]" style={inputStyle} value={content.cta_subtitle} onChange={e => setContent({...content, cta_subtitle: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-body mb-1" style={labelStyle}>Button Text</label>
            <input className="w-full h-11 rounded-xl px-4 text-sm font-body focus:outline-none focus:border-gold" style={inputStyle} value={content.cta_button_text} onChange={e => setContent({...content, cta_button_text: e.target.value})} />
          </div>
        </div>
      )}
    </div>
  );
}
