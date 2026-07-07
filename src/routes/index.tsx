import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  Quote,
  Play,
  Pause,
} from "lucide-react";
import giulianoAsset from "@/assets/giuliano.jpg.asset.json";
import logo4sAsset from "@/assets/logo-4s.png.asset.json";
import nextLevelAsset from "@/assets/next-level.mp4.asset.json";
import posterAsset from "@/assets/hero-poster.jpg.asset.json";

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
/*
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
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-flame-gradient font-semibold text-white shadow-flame transition-all hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 ${sz} ${className}`}
    >
      {children}
    </a>
  );
}
*/
/* -------- sections -------- */

function Header() {
  return (
    <header className="border-b border-white/10 bg-navy-deep/95 backdrop-blur-lg">
      <div className="bg-flame-gradient px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-white">
        Exclusivo para empresas que faturam acima de R$100mil ao mês
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <LogoMark />
        <CTAButton className="hidden sm:inline-flex">Garantir minha vaga</CTAButton>
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
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      void v.play().then(() => setPlaying(true));
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-navy-elevated shadow-elevated aspect-video group">
      <video
        ref={ref}
        src={nextLevelAsset.url}
        poster={posterAsset.url}
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
        aria-label="Vídeo de apresentação da Jornada 4S"
      />
      <button
        type="button"
        onClick={toggle}
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
          playing ? "opacity-0 group-hover:opacity-100 bg-black/20" : "opacity-100 bg-black/30"
        }`}
        aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
      >
        <div className="grid h-14 w-14 place-items-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20 transition-transform hover:scale-110 active:scale-95">
          {playing ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white ml-0.5" />}
        </div>
      </button>
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
          <div className="mt-14 rounded-2xl border border-white/10 bg-navy-elevated/50 p-6 sm:p-10">
            <h3 className="font-display text-xl font-bold text-white sm:text-2xl">O que você vai descobrir em 1 dia</h3>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {items.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-teal/30 bg-teal/10 text-teal">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <p className="pt-2 text-white/90">{text}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <CTAButton>Garantir minha vaga</CTAButton>
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
          <div className="mt-16 rounded-3xl border border-flame/30 bg-navy-elevated/40 p-8 text-center sm:p-14">
            <div className="text-sm uppercase tracking-widest text-teal">Escala do mercado</div>
            <div className="mt-4 font-display text-5xl font-black leading-none text-gradient-flame sm:text-7xl lg:text-8xl">
              + US$ 1 bilhão
            </div>
            <div className="mt-4 text-lg text-white/85 sm:text-xl">movimentados em importação pela 4S em 2026</div>
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

function TestimonialsSection() {
  const items = [
    {
      quote:
        "Sai da imersão com clareza absoluta de como estruturar a primeira compra direto da fábrica. Recuperei margem que eu achava impossível.",
      name: "Rafael M.",
      role: "Sócio-diretor, indústria de utilidades",
    },
    {
      quote:
        "O nível de networking é o que mais me marcou. Sentei em uma mesa com empresários que já operam em outro patamar.",
      name: "Carolina S.",
      role: "CEO, distribuidora de eletroeletrônicos",
    },
    {
      quote:
        "A metodologia dos 6 pilares organiza tudo o que eu tentava fazer sozinho no braço. Mudou como enxergo meu negócio.",
      name: "Eduardo P.",
      role: "Diretor comercial, e-commerce",
    },
  ];
  return (
    <section className="border-t border-white/5 bg-navy py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="max-w-3xl font-display text-3xl font-black text-white sm:text-5xl">
            Escute de quem já <span className="text-gradient-flame">trilhou a jornada.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={i}>
              <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-navy-elevated/50 p-6 transition-colors hover:border-teal/40">
                <Quote className="h-8 w-8 text-teal" />
                <blockquote className="mt-4 flex-1 text-white/90">{t.quote}</blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </figcaption>
              </figure>
            </Reveal>
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
          <div className="mt-12 grid gap-8 rounded-3xl border-2 border-flame/60 bg-gradient-to-br from-navy-elevated to-navy p-8 shadow-flame sm:p-14 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="text-sm uppercase tracking-widest text-teal">Investimento</div>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-display text-6xl font-black text-white sm:text-7xl">R$ 297</span>
                <span className="text-lg text-muted-foreground">/ vaga</span>
              </div>
              <p className="mt-4 max-w-md text-white/85">
                Condição especial para os primeiros inscritos. Vagas limitadas a 30 empresários por edição.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-3 md:items-end">
              <CTAButton size="lg" className="text-lg">
                Garantir minha vaga
              </CTAButton>
              <div className="text-center text-xs uppercase tracking-widest text-muted-foreground md:text-right">
                Pagamento seguro
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
        <ContextSection />
        <AuthoritySection />
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
