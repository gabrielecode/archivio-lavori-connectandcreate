import { Typewriter } from "@/components/ui/typewriter"
import { Footerdemo } from "@/components/ui/footer-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, MessageCircle, Zap, Leaf, Bike, MapPin, Mail, ChevronRight } from "lucide-react"

function App() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            {/* 1. HEADER */}
            <header className="fixed top-0 left-0 w-full z-50 py-6 transition-all duration-300">
                <nav className="container mx-auto px-6 flex justify-between items-center">
                    <div className="text-xl font-extrabold tracking-tighter">
                        LUGANO <span className="text-muted-foreground font-light">EXPRESS</span>
                    </div>
                    <ul className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-widest opacity-70">
                        <li><a href="#services" className="hover:opacity-100 transition-opacity">Servizi</a></li>
                        <li><a href="#ae1" className="hover:opacity-100 transition-opacity">Flotta</a></li>
                        <li><a href="#journal" className="hover:opacity-100 transition-opacity">News</a></li>
                        <li><a href="#contact-section" className="hover:opacity-100 transition-opacity">Contatti</a></li>
                    </ul>
                    <Button variant="outline" className="hidden sm:inline-flex border-muted-foreground/20 text-xs tracking-widest uppercase">
                        Prenota Ora
                    </Button>
                </nav>
            </header>

            <main>
                {/* 2. HERO SECTION WITH TYPEWRITER */}
                <section className="relative h-screen flex items-center overflow-hidden">
                    <div className="absolute inset-0 z-[-1]">
                        <img
                            src="https://images.unsplash.com/photo-1571068316344-75bc76f77891?q=80&w=2070&auto=format&fit=crop"
                            className="w-full h-full object-cover brightness-[0.4]"
                            alt="Bicycle Delivery"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                    </div>

                    <div className="container mx-auto px-6">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-primary leading-[0.9] mb-8">
                            Logistica Urbana.<br />
                            <Typewriter
                                text={[
                                    "Sostenibile.",
                                    "Puntuale.",
                                    "Agile.",
                                    "Lugano Express.",
                                ]}
                                speed={100}
                                className="text-primary"
                                waitTime={2000}
                                deleteSpeed={50}
                                cursorChar={"_"}
                            />
                        </h1>
                        <p className="max-w-xl text-xl text-muted-foreground font-light mb-12">
                            Superiamo il traffico di Lugano con corrieri in bicicletta 100% elettrici.
                            Semplifica le tue consegne urbane oggi stesso.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="h-14 px-10 text-sm tracking-widest uppercase font-bold">
                                Spedisci Ora
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-10 text-sm tracking-widest uppercase font-bold border-white/10 hover:border-white">
                                Scopri AE.1
                            </Button>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-10 flex flex-col gap-4 text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">
                        <span>Scroll to discover</span>
                        <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent"></div>
                    </div>
                </section>

                {/* 3. URGENT CALL */}
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="bg-primary p-12 md:p-20 rounded-xl flex flex-col md:flex-row justify-between items-center gap-10">
                            <div className="text-background">
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-6">
                                    Hai un'emergenza?<br />Chiama subito.
                                </h2>
                                <p className="text-lg opacity-80 max-w-md">
                                    Corriere assegnato in 2 minuti. Consegna garantita entro 20 minuti nel centro città.
                                </p>
                            </div>
                            <div className="text-center md:text-right">
                                <a href="tel:+41911234567" className="inline-flex items-center gap-4 bg-background text-primary px-10 py-6 rounded-lg text-2xl font-black tracking-tighter hover:scale-105 transition-transform">
                                    <Phone className="animate-pulse" /> +41 91 123 45 67
                                </a>
                                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-background/60">
                                    Attivo dalle 08:00 alle 19:00
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. SERVICES GRID */}
                <section id="services" className="py-32 border-t border-white/5">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-extrabold tracking-tighter mb-20 text-center">I Nostri Servizi</h2>
                        <div className="grid md:grid-cols-3 gap-10">
                            {[
                                { icon: <Zap className="w-10 h-10" />, title: "Pony Express", desc: "Documenti e piccoli pacchi in 15 minuti nel centro di Lugano." },
                                { icon: <Leaf className="w-10 h-10" />, title: "Eco-Business", desc: "Piani abbonamento per aziende a zero emissioni CO2." },
                                { icon: <Bike className="w-10 h-10" />, title: "Cargo AE.1", desc: "Trasporto merci ingombranti fino a 300kg in sicurezza." }
                            ].map((item, i) => (
                                <div key={i} className="p-12 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors border border-white/5">
                                    <div className="text-primary mb-8">{item.icon}</div>
                                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. CONTACT FORM */}
                <section id="contact-section" className="py-32 bg-secondary/20">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-20">
                            <div>
                                <h2 className="text-5xl font-black tracking-tighter mb-8 leading-none">Preventivo<br />Gratuito.</h2>
                                <p className="text-lg text-muted-foreground font-light mb-12">
                                    Compila il modulo per ricevere una quotazione immediata per le tue spedizioni a Lugano e Ticino.
                                </p>
                                <ul className="space-y-6 text-sm font-medium">
                                    <li className="flex items-center gap-4"><MapPin className="text-primary" /> Piazza della Riforma, Lugano</li>
                                    <li className="flex items-center gap-4"><Mail className="text-primary" /> info@luganoexpress.ch</li>
                                </ul>
                            </div>
                            <form className="space-y-6">
                                <Input placeholder="Nome Completo" className="h-14 bg-background border-white/10" />
                                <Input placeholder="Email Aziendale" className="h-14 bg-background border-white/10" />
                                <Textarea placeholder="Dettagli spedizione (Origine / Destinazione)" className="min-h-[150px] bg-background border-white/10" />
                                <Button className="w-full h-16 text-sm tracking-widest uppercase font-black">Invia Richiesta</Button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            {/* 9. NEW SHADCN FOOTER */}
            <Footerdemo />

            {/* MOBILE STICKY BAR */}
            <div className="md:hidden fixed bottom-0 left-0 w-full h-20 grid grid-cols-2 z-50">
                <a href="tel:+41911234567" className="bg-primary text-background flex flex-col items-center justify-center gap-1">
                    <Phone size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Chiama</span>
                </a>
                <a href="https://wa.me/41911234567" className="bg-background text-primary flex flex-col items-center justify-center gap-1 border-t border-white/10">
                    <MessageCircle size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
                </a>
            </div>
        </div>
    )
}

export default App
