import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Ship,
  Package,
  Plane,
  TrendingUp,
  Map,
  BarChart3,
  Check,
  Users,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Play,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import giulianoAsset from "@/assets/giuliano.jpg.asset.json";
import logo4sAsset from "@/assets/logo-4s.png.asset.json";
import nextLevelAsset from "@/assets/Video_HeadLine.mp4.asset.json";
import posterAsset from "@/assets/hero-poster.jpg.asset.json";
import depoimentoVitorVideo from "@/assets/depoimento-vitor.mp4.asset.json";
import depoimentoVitorPoster from "@/assets/poster-vitor.jpg.asset.json";
import depoimentoComunixVideo from "@/assets/depoimento-comunix.mp4.asset.json";
import depoimentoComunixPoster from "@/assets/poster-comunix.jpg.asset.json";
import cantonFairVideo from "@/assets/canton-fair-dia1.mp4.asset.json";
import cantonFairPoster from "@/assets/poster-canton-fair.jpg.asset.json";
import plateiaAsset from "@/assets/plateia-evento.jpg.asset.json";
import cantonFairEquipeAsset from "@/assets/canton-fair-equipe.jpg.asset.json";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const EVENT_DATE = new Date("2026-07-29T09:00:00-03:00");
const CTA_HREF = "#inscricao";

/* -------- utilities -------- */

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("animate-fade-up");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
}

/* -------- brand mark -------- */

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-navy-deep ring-1 ring-white/10">
        <img src={logo4sAsset.url} alt="Logo Jornada 4S" className="h-full w-full object-cover" />
      </div>
      <div className="leading-tight">
        <div className="font-display font-extrabold text-white text-sm tracking-wide">JORNADA 4S</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-teal">Grupo Now</div>
      </div>
    </div>
  );
}

function CTAButton({
  children,
  className = "",
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "md" | "lg";
}) {
  const sz = size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm";
  return (
    <a
      href={CTA_HREF}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-flame font-semibold text-white shadow-lg shadow-flame/30 transition-all hover:bg-flame/90 hover:-translate-y-0.5 active:translate-y-0 ${sz} ${className}`}
    >
      {children}
    </a>
  );
}

/* -------- sections -------- */

function Header() {
  return (
    <header className="border-b border-white/10 bg-navy-deep/95 backdrop-blur-lg">
      <div className="bg-flame-gradient px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-white">
        Exclusivo para empresas que faturam acima de R$100mil ao mês
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-3 sm:px-6">
        <LogoMark />
      </div>
    </header>
  );
}

function MobileStickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-navy-deep/95 p-3 backdrop-blur-lg sm:hidden">
      <CTAButton className="w-full" size="lg">
        Garantir minha vaga
      </CTAButton>
    </div>
  );
}

function Countdown() {
  const { d, h, m, s } = useCountdown(EVENT_DATE);
  const Item = ({ v, l }: { v: number; l: string }) => (
    <div className="flex flex-col items-center rounded-lg border border-white/10 bg-navy-elevated/60 px-3 py-2 min-w-[64px]">
      <div className="font-display text-2xl font-black text-white tabular-nums sm:text-3xl">
        {String(v).padStart(2, "0")}
      </div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{l}</div>
    </div>
  );
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Item v={d} l="dias" />
      <Item v={h} l="hrs" />
      <Item v={m} l="min" />
      <Item v={s} l="seg" />
    </div>
  );
}

function Hero() {
  const tags = ["Networking", "Margem real", "Experiência", "Mercado internacional", "Cortar atravessadores"];
  return (
    <section className="relative overflow-hidden bg-hero py-20 sm:py-28">
      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />
      <div
        className="absolute top-1/3 -right-32 h-96 w-96 rounded-full blur-3xl opacity-30"
        style={{ background: "var(--flame)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-teal">
            <Sparkles className="h-3.5 w-3.5" /> Imersão Jornada 4S
          </span>
        </Reveal>

        <Reveal>
          <h1 className="mx-auto mt-4 font-display text-3xl font-black leading-[1.05] text-white sm:text-4xl lg:text-5xl">
            Domine o mercado <br className="hidden sm:block" />
            mais <span className="text-gradient-flame">lucrativo do mundo</span>
            <br className="hidden sm:block" /> em apenas 1 dia.
          </h1>
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-6 max-w-3xl">
            <HeroVideo />
          </div>
        </Reveal>

        <Reveal>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Um dia de imersão presencial em <span className="text-white">Santos/SP</span> para empresários que querem
            aumentar margem, reduzir custos e descobrir oportunidades importando da China, ensinado por quem opera há
            mais de 20 anos no mercado.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-6 flex flex-col items-center gap-4">
            <CTAButton size="lg" className="animate-pulse-glow">
              Garantir minha vaga
            </CTAButton>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-teal" />
              Vagas limitadas, apenas <span className="font-semibold text-white">30 empresários</span> nesta edição
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-8 flex justify-center">
            <Countdown />
          </div>
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2 border-t border-white/10 pt-6">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/80"
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HeroVideo() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-navy-elevated shadow-elevated aspect-video">
      <video
        src={nextLevelAsset.url}
        poster={posterAsset.url}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
        aria-label="Vídeo de apresentação da Jornada 4S"
      />
    </div>
  );
}

function ContextSection() {
  const items = [
    { icon: Ship, text: "Como empresários brasileiros compram direto das fábricas chinesas" },
    { icon: BarChart3, text: "Como avaliar se importar faz sentido para sua empresa" },
    { icon: TrendingUp, text: "Como reduzir riscos e aumentar margens" },
    { icon: Package, text: "Como funciona a Canton Fair e por que é a maior feira multissetorial do mundo" },
    { icon: Plane, text: "Como transformar uma viagem em estratégia de crescimento" },
  ];
  return (
    <section className="border-t border-white/5 bg-navy py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="max-w-3xl font-display text-3xl font-black text-white sm:text-5xl">
            O caminho fácil parou de <br className="hidden sm:block" />
            ser o caminho <span className="text-gradient-flame">competitivo.</span>
          </h2>
        </Reveal>
        <Reveal>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
            Por anos, comprar de distribuidores nacionais foi o caminho simples. Hoje, empresas competitivas buscam a
            origem dos produtos para recuperar margem e reduzir a dependência nacional. A China deixou de ser só baixo
            custo, virou centro global de inovação e oportunidade.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2 md:items-stretch">
            <figure className="overflow-hidden rounded-2xl border border-white/10">
              <img
                src={plateiaAsset.url}
                alt="Plateia acompanhando uma palestra da Jornada 4S"
                className="h-64 w-full object-cover md:h-full"
                loading="lazy"
              />
            </figure>

            <div className="rounded-2xl border border-white/10 bg-navy-elevated/50 p-6 sm:p-10">
              <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                O que você vai descobrir em 1 dia
              </h3>
              <ul className="mt-8 grid gap-6">
                {items.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-teal/30 bg-teal/10 text-teal">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </div>
                    <p className="pt-2 text-white/90">{text}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex justify-center">
                <CTAButton>Garantir minha vaga</CTAButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AuthoritySection() {
  return (
    <section className="border-t border-white/5 bg-navy-deep py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 md:grid-cols-[auto_1fr]">
        <Reveal>
          <div className="relative mx-auto md:mx-0">
            <div
              className="absolute inset-0 -m-4 rounded-3xl opacity-40 blur-3xl"
              style={{ background: "var(--flame)" }}
              aria-hidden
            />
            <figure className="relative overflow-hidden rounded-3xl border border-white/10 bg-navy-elevated shadow-2xl w-72 sm:w-80">
              <img
                src={giulianoAsset.url}
                alt="Giuliano Rédua, mentor da Jornada 4S"
                className="block h-96 w-full object-cover sm:h-[420px]"
                loading="lazy"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep via-navy-deep/85 to-transparent px-6 pb-6 pt-16">
                <h3 className="font-display text-2xl font-black text-white sm:text-3xl">Giuliano Rédua</h3>
              </figcaption>
            </figure>
          </div>
        </Reveal>
        <Reveal>
          <div>
            <h2 className="font-display text-3xl font-black text-white sm:text-5xl">Quem está à frente da jornada</h2>
            <p className="mt-6 text-lg text-white/85">
              <span className="font-semibold text-white">Giuliano Rédua</span> lidera a Jornada 4S dentro do{" "}
              <span className="font-semibold text-white">Grupo Now</span>, com mais de{" "}
              <span className="text-gradient-flame font-bold">30 anos</span> em comércio exterior.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              A metodologia é a base da Jornada 4S, abrir os olhos para um novo mercado, muito além de importação:
              liberdade, acesso e margem real em cada operação.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PainSection() {
  return (
    <section className="border-t border-white/5 bg-navy py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-flame/40 bg-flame/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-flame">
            O que ninguém te conta
          </span>
        </Reveal>
        <Reveal>
          <h2 className="mt-6 max-w-4xl font-display text-3xl font-black text-white sm:text-5xl">
            Existe uma margem inteira sendo paga para{" "}
            <span className="text-gradient-flame">alguém no meio do caminho.</span>
          </h2>
        </Reveal>
        <Reveal>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
            Dependência de fornecedor nacional, margens cada vez menores, pouca previsibilidade e dificuldade de
            diferenciação da concorrência são as dores de quem ainda não negocia direto com a indústria chinesa.
          </p>
        </Reveal>

        <Reveal>
          <figure className="mt-16 overflow-hidden rounded-2xl border border-white/10">
            <img
              src={cantonFairEquipeAsset.url}
              alt="Equipe do Grupo Now na Canton Fair, na China"
              className="h-64 w-full object-cover sm:h-96"
              loading="lazy"
            />
          </figure>
        </Reveal>

        <Reveal>
          <div className="mt-6 rounded-3xl border border-flame/30 bg-navy-elevated/40 p-8 text-center sm:p-14">
            <div className="text-sm uppercase tracking-widest text-teal">Escala do mercado</div>
            <div className="mt-4 font-display text-5xl font-black leading-none text-gradient-flame sm:text-7xl lg:text-8xl">
              + US$ 1 bilhão
            </div>
            <div className="mt-4 text-lg text-white/85 sm:text-xl">
              movimentados em importação pelo <span className="font-semibold text-white">Grupo Now</span> em 2026
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ForWhomSection() {
  const items = [
    "É empresário, sócio ou diretor com autonomia para decidir",
    "Sente a margem apertar comprando de distribuidor nacional",
    "Quer começar a importar direto da China, mesmo sem nunca ter feito isso",
    "Já pesquisou fornecedores lá fora, mas não teve segurança pra avançar sozinho",
    "Quer conhecer o mercado com maior margem de lucro do mundo",
    "Busca networking com outros empresários da área",
  ];
  return (
    <section className="border-t border-white/5 bg-navy-deep py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-teal">
            Para quem é
          </span>
        </Reveal>
        <Reveal>
          <h2 className="mt-6 max-w-3xl font-display text-3xl font-black text-white sm:text-5xl">
            Essa Jornada foi construída para um{" "}
            <span className="text-gradient-flame">tipo específico de empresário.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {items.map((t) => (
            <Reveal key={t}>
              <div className="flex h-full items-start gap-4 rounded-xl border border-white/10 bg-navy-elevated/40 p-5 transition-colors hover:border-teal/40">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-teal/40 bg-teal/10 text-teal">
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                </div>
                <p className="pt-1 text-white/90">{t}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

type VideoTestimonial = {
  video: string;
  poster: string;
  name: string;
  role: string;
};

function VideoTestimonialCard({ item }: { item: VideoTestimonial }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <div className="group relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/10 bg-navy-elevated shadow-elevated">
      <video
        ref={videoRef}
        src={item.video}
        poster={item.poster}
        playsInline
        muted={muted}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        className="h-full w-full object-cover"
      />

      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Pausar depoimento" : "Reproduzir depoimento"}
        className="absolute inset-0 flex items-center justify-center bg-navy-deep/10 transition-colors hover:bg-navy-deep/25"
      >
        {!playing && (
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-navy-deep shadow-lg transition-transform group-hover:scale-105">
            <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
          </span>
        )}
      </button>

      {playing && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Ativar som" : "Silenciar"}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-navy-deep/70 text-white backdrop-blur transition-colors hover:bg-navy-deep/90"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep via-navy-deep/80 to-transparent p-5 pt-14">
        <div className="font-display font-bold text-white">{item.name}</div>
        <div className="text-sm text-white/70">{item.role}</div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const items: VideoTestimonial[] = [
    {
      video: depoimentoVitorVideo.url,
      poster: depoimentoVitorPoster.url,
      name: "Vitor",
      // TODO: ajuste o cargo/empresa do Vitor aqui
      role: "Participante da Jornada 4S",
    },
    {
      video: depoimentoComunixVideo.url,
      poster: depoimentoComunixPoster.url,
      name: "Comunix",
      // TODO: ajuste o cargo/nome de quem fala pela Comunix aqui
      role: "Empresa participante",
    },
    {
      video: cantonFairVideo.url,
      poster: cantonFairPoster.url,
      name: "Direto da Canton Fair",
      role: "1º dia da maior feira multissetorial do mundo",
    },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="border-t border-white/5 bg-navy py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-3xl font-display text-3xl font-black text-white sm:text-5xl">
              Escute de quem já <span className="text-gradient-flame">trilhou a jornada.</span>
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                aria-label="Depoimento anterior"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-teal/50 hover:text-teal"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                aria-label="Próximo depoimento"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-teal/50 hover:text-teal"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-14 overflow-hidden" ref={emblaRef}>
            <div className="-ml-4 flex sm:-ml-6">
              {items.map((item) => (
                <div
                  key={item.name}
                  className="min-w-0 flex-[0_0_78%] pl-4 sm:flex-[0_0_38%] sm:pl-6 lg:flex-[0_0_29%]"
                >
                  <VideoTestimonialCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-6 flex justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.name}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Ir para depoimento ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === selectedIndex ? "w-6 bg-teal" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingSection() {
  const included = [
    { icon: Calendar, text: "1 dia de imersão presencial" },
    { icon: BarChart3, text: "Metodologia completa dos 6 pilares da Jornada 4S" },
    { icon: TrendingUp, text: "Diagnóstico express da operação" },
    { icon: Users, text: "Sessão de perguntas e respostas" },
    { icon: Map, text: "Networking com empresários" },
    { icon: ShieldCheck, text: "Apenas 30 participantes" },
  ];

  return (
    <section id="inscricao" className="relative overflow-hidden border-t border-white/5 bg-navy-deep py-20 sm:py-28">
      <div
        className="absolute inset-0 opacity-40"
        style={{ background: "radial-gradient(circle at 50% 0%, oklch(0.28 0.08 275) 0%, transparent 60%)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-teal">
            Onde será
          </span>
        </Reveal>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="font-display text-3xl font-black text-white sm:text-5xl">
                Connect Boqueirão, <span className="text-gradient-flame">Santos/SP</span>
              </h2>
              <div className="mt-6 space-y-3 text-white/85">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  <span>Rua Dr. Acácio Nogueira, 14, Boqueirão, Santos/SP</span>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  <span>29 de julho, quarta-feira</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  <span>Um dia inteiro de imersão presencial</span>
                </div>
              </div>
              <p className="mt-6 text-muted-foreground">
                Você sai enxergando a importação como estratégia de crescimento, não como risco.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="Mapa Connect Boqueirão"
                src="https://www.google.com/maps?q=Rua+Dr.+Acácio+Nogueira+14+Boqueirão+Santos+SP&output=embed"
                className="h-72 w-full sm:h-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>

        {/* included */}
        <Reveal>
          <div className="mt-16 rounded-2xl border border-white/10 bg-navy-elevated/50 p-6 sm:p-10">
            <h3 className="font-display text-xl font-bold text-white sm:text-2xl">O que está incluso</h3>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {included.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-teal/30 bg-teal/10 text-teal">
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
                  </div>
                  <span className="pt-2 text-white/90">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* investment */}
        <Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="grid gap-8 rounded-3xl border-2 border-flame/60 bg-gradient-to-br from-navy-elevated to-navy p-8 shadow-flame sm:p-10">
              <div>
                <div className="text-sm uppercase tracking-widest text-teal">Ingresso individual</div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-display text-6xl font-black text-white sm:text-7xl">R$ 297</span>
                  <span className="text-lg text-muted-foreground">/ vaga</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">ou 12x de R$ 24,75</div>
                <p className="mt-4 max-w-md text-white/85">
                  Condição especial para os primeiros inscritos. Vagas limitadas a 30 empresários por edição.
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-3">
                <CTAButton size="lg" className="text-lg">
                  Garantir minha vaga
                </CTAButton>
                <div className="text-center text-xs uppercase tracking-widest text-muted-foreground">
                  Pagamento seguro
                </div>
              </div>
            </div>

            <div className="grid gap-8 rounded-3xl border-2 border-teal/60 bg-gradient-to-br from-navy-elevated to-navy p-8 sm:p-10">
              <div>
                <div className="text-sm uppercase tracking-widest text-teal">Ingresso duplo</div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-display text-6xl font-black text-white sm:text-7xl">R$ 497</span>
                  <span className="text-lg text-muted-foreground">/ 2 vagas</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">ou 12x de R$ 41,42</div>
                <p className="mt-4 max-w-md text-white/85">
                  Leve um sócio ou parceiro de negócio e economize levando os dois para a imersão.
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-3">
                <CTAButton size="lg" className="text-lg">
                  Garantir as 2 vagas
                </CTAButton>
                <div className="text-center text-xs uppercase tracking-widest text-muted-foreground">
                  Pagamento seguro
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-deep py-10 pb-24 sm:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <LogoMark />
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Grupo Now, Jornada 4S. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-deep text-white">
      <Header />
      <main>
        <Hero />
        <AuthoritySection />
        <ContextSection />
        <PainSection />
        <ForWhomSection />
        <TestimonialsSection />
        <ClosingSection />
      </main>
      <Footer />
      <MobileStickyCTA />
    </div>
  );
}
