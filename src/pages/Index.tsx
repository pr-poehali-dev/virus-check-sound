import { useState, useRef, useCallback } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  emoji?: string;
}

const EMOJIS = ["💥", "🦠", "☠️", "🔥", "💀", "🐛", "⚡", "🤯", "😱", "🧨"];
const COLORS = ["#FF3E00", "#FFD600", "#FF007A", "#00FF88", "#00CFFF", "#FF6B00", "#FFFFFF"];

function playGroanSound() {
  const AudioCtx = (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)!;
  const ctx = new AudioCtx();

  const playNote = (freq: number, startTime: number, duration: number, type: OscillatorType = "sine") => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, startTime + duration);
    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const now = ctx.currentTime;
  playNote(400, now, 0.4, "sawtooth");
  playNote(320, now + 0.1, 0.5, "sine");
  playNote(280, now + 0.3, 0.6, "triangle");
  playNote(200, now + 0.5, 0.8, "sawtooth");
  playNote(150, now + 0.7, 1.0, "sine");
  playNote(100, now + 0.9, 1.2, "triangle");
}

const Index = () => {
  const [exploding, setExploding] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [scanText, setScanText] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [infected, setInfected] = useState<boolean | null>(null);
  const particleIdRef = useRef(0);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (exploding || scanning) return;

    playGroanSound();
    setShake(true);
    setScanning(true);
    setInfected(null);
    setScanText("СКАНИРОВАНИЕ...");
    setScanProgress(0);

    setTimeout(() => setShake(false), 600);

    // Прогресс бар
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setScanProgress(Math.min(progress, 100));
    }, 150);

    // Взрыв и результат через 2 секунды
    setTimeout(() => {
      setScanning(false);
      setExploding(true);
      setScanText("ОБНАРУЖЕНО: ВИРУС СТОНАНИЯ v2.0");
      setInfected(true);

      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const newParticles: Particle[] = Array.from({ length: 60 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 60 + Math.random() * 0.3;
        const speed = 4 + Math.random() * 8;
        return {
          id: particleIdRef.current++,
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 6 + Math.random() * 14,
          emoji: Math.random() > 0.5 ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : undefined,
        };
      });

      setParticles(newParticles);

      setTimeout(() => {
        setParticles([]);
        setExploding(false);
        setScanText(null);
        setInfected(null);
        setScanProgress(0);
      }, 3000);
    }, 2000);
  }, [exploding, scanning]);

  return (
    <div className="antivirus-bg min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Фоновые полосы */}
      <div className="scanlines" />

      {/* Заголовок */}
      <div className="text-center mb-8 z-10 relative">
        <div className="text-xs font-mono text-green-400 mb-2 tracking-widest animate-pulse">
          ██ АНТИВИРУС ПРОФЕССИОНАЛЬНЫЙ v9.99 ██
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_0_20px_#ff0000] mb-2 font-oswald">
          🛡️ ВИРУС-ДЕТЕКТОР 3000
        </h1>
        <p className="text-green-300 font-mono text-sm tracking-wider">
          ЗАЩИТА WINDOWS XP ОТ ОПАСНЫХ УГРОЗ
        </p>
      </div>

      {/* Главная кнопка */}
      <div
        className={`relative cursor-pointer z-10 ${shake ? "animate-shake" : ""} ${exploding ? "animate-pulse" : ""}`}
        onClick={handleClick}
        style={{ filter: exploding ? "brightness(2) saturate(3)" : "none", transition: "filter 0.3s" }}
      >
        <div className="relative group">
          {/* Свечение вокруг */}
          <div className={`absolute inset-0 rounded-2xl blur-2xl opacity-70 transition-all duration-300 ${exploding ? "bg-red-500 scale-150" : "bg-red-700 group-hover:scale-110 group-hover:opacity-100"}`} />

          {/* Рамка кнопки */}
          <div className="relative border-4 border-red-500 rounded-2xl overflow-hidden shadow-[0_0_40px_#ff0000,inset_0_0_20px_#ff000033]">
            {/* Картинка */}
            <img
              src="https://cdn.poehali.dev/projects/26e0f92b-f7ad-4b67-8412-d4369f015ad3/files/1a5acb75-d8e2-4e31-ad46-05aba63931e9.jpg"
              alt="ПРОВЕРКА НА ВИРУСЫ"
              className="w-72 h-72 md:w-96 md:h-96 object-cover block"
              draggable={false}
            />

            {/* Оверлей текста */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <div className="bg-red-600 border-2 border-yellow-400 px-4 py-2 rounded-lg shadow-lg">
                <span className="text-white font-black text-xl md:text-2xl font-oswald tracking-wider drop-shadow-[0_2px_4px_#000]">
                  ⚠️ ПРОВЕРКА НА ВИРУСЫ
                </span>
              </div>
            </div>

            {/* Блик при наведении */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
          </div>
        </div>

        {/* Стрелка-подсказка */}
        {!scanning && !exploding && (
          <div className="text-center mt-4 text-yellow-400 font-mono text-sm animate-bounce">
            👆 НАЖМИ СЮДА ДЛЯ СКАНИРОВАНИЯ
          </div>
        )}
      </div>

      {/* Прогресс бар сканирования */}
      {scanning && (
        <div className="z-10 mt-6 w-72 md:w-96">
          <div className="text-green-400 font-mono text-xs mb-2 text-center animate-pulse">
            АНАЛИЗИРУЮ СИСТЕМУ... {Math.round(scanProgress)}%
          </div>
          <div className="w-full bg-gray-800 border border-green-500 h-4 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-150"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <div className="text-gray-500 font-mono text-xs mt-1 text-center">
            {scanProgress < 30 && "Проверяю реестр..."}
            {scanProgress >= 30 && scanProgress < 60 && "Ищу подозрительные файлы..."}
            {scanProgress >= 60 && scanProgress < 90 && "Анализирую поведение системы..."}
            {scanProgress >= 90 && "Формирую отчёт..."}
          </div>
        </div>
      )}

      {/* Результат */}
      {scanText && !scanning && (
        <div className={`z-10 mt-6 border-4 px-6 py-3 rounded-xl font-mono font-black text-lg md:text-xl text-center animate-pulse ${infected ? "border-red-500 bg-red-950/80 text-red-400" : "border-green-500 bg-green-950/80 text-green-400"}`}>
          {infected ? "☠️" : "✅"} {scanText}
        </div>
      )}

      {/* Частицы взрыва */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-50 font-bold"
          style={{
            left: p.x,
            top: p.y,
            fontSize: p.emoji ? `${p.size * 2}px` : `${p.size}px`,
            color: p.color,
            width: p.emoji ? "auto" : p.size,
            height: p.emoji ? "auto" : p.size,
            borderRadius: "50%",
            backgroundColor: p.emoji ? "transparent" : p.color,
            transform: "translate(-50%, -50%)",
            animation: `explode-particle 2s ease-out forwards`,
            "--vx": `${p.vx * 30}px`,
            "--vy": `${p.vy * 30}px`,
          } as React.CSSProperties}
        >
          {p.emoji || ""}
        </div>
      ))}

      {/* Нижняя плашка */}
      <div className="absolute bottom-4 text-center text-gray-600 font-mono text-xs z-10">
        © 2003 АНТИВИРУС ПРОФЕССИОНАЛЬНЫЙ | НЕ НЕСЁМ ОТВЕТСТВЕННОСТИ ЗА ПОТЕРЮ ДАННЫХ
      </div>
    </div>
  );
};

export default Index;