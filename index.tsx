import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ChevronRight, 
  ChevronLeft, 
  Shield, 
  Gem, 
  Crown, 
  Flame, 
  AlertTriangle,
  CheckCircle2,
  Info,
  Trophy,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

// --- Types & Data ---

interface Option {
  label: string;
  xp: number;
}

interface Question {
  id: number;
  type: 'multiple' | 'scale' | 'boolean';
  text: string;
  subtext?: string;
  options?: Option[];
  minLabel?: string;
  maxLabel?: string;
}

const CHECKOUT_URL = 'https://payment.ticto.app/O4D5822B0';

const QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'multiple',
    text: 'Ao fazer um esforço (tosse, risada ou levantar peso), o que acontece com o centro da sua barriga?',
    options: [
      { label: 'Ela salta para fora ou forma uma "montanha/calombo".', xp: 0 },
      { label: 'Ela estufa inteira, como se ficasse muito inchada.', xp: 1 },
      { label: 'Não percebo nada de diferente.', xp: 2 },
      { label: 'Sinto que ela "entra" e ganho firmeza.', xp: 3 },
    ]
  },
  {
    id: 2,
    type: 'scale',
    text: 'Como você sente a firmeza do seu tronco no dia a dia?',
    subtext: '(0 = Costas "soltas" | 10 = Firme e seguro)',
    minLabel: 'Soltas',
    maxLabel: 'Firme'
  },
  {
    id: 3,
    type: 'boolean',
    text: '"Para ter a barriga reta, eu preciso sugá-la e segurá-la para dentro o dia inteiro."',
    subtext: 'Verdadeiro ou Falso?'
  },
  {
    id: 4,
    type: 'multiple',
    text: 'O que você faz com a respiração quando vai pegar seu bebê no colo ou levantar algo pesado?',
    options: [
      { label: 'Prendo o ar e faço força (apneia).', xp: 0 },
      { label: 'Nem percebo o que faço.', xp: 1 },
      { label: 'Tento murchar a barriga.', xp: 2 },
      { label: 'Solto o ar suavemente enquanto faço o esforço.', xp: 3 },
    ]
  },
  {
    id: 5,
    type: 'multiple',
    text: 'Como você sai da cama de manhã?',
    options: [
      { label: 'Levanto de frente, como se fizesse um exercício abdominal.', xp: 0 },
      { label: 'Me impulsiono com os braços, mas de frente.', xp: 1 },
      { label: 'Viro de lado e uso o apoio das mãos.', xp: 3 },
    ]
  },
  {
    id: 6,
    type: 'multiple',
    text: 'Como você se sente após as refeições ou ao final do dia?',
    options: [
      { label: 'Sempre muito estufada, barriga maior que de manhã.', xp: 0 },
      { label: 'Um pouco inchada, mas nada que incomode.', xp: 2 },
      { label: 'Normal, sem grandes alterações de volume.', xp: 3 },
    ]
  },
  {
    id: 7,
    type: 'multiple',
    text: 'Se você tentar fazer uma "Prancha" ou abdominal tradicional hoje, o que sente?',
    options: [
      { label: 'Dor nas costas ou sinto a barriga "escapar".', xp: 0 },
      { label: 'Muita dificuldade, mas tento aguentar na força.', xp: 1 },
      { label: 'Medo de machucar, prefiro não fazer nada.', xp: 2 },
      { label: 'Consigo controlar a barriga sem dor lombar.', xp: 3 },
    ]
  },
  {
    id: 8,
    type: 'boolean',
    text: '"Qualquer exercício abdominal serve para fechar a diástase."',
    subtext: 'Verdadeiro ou Falso?'
  },
  {
    id: 9,
    type: 'scale',
    text: 'Nível de dor lombar ou cansaço nas costas ao final do dia?',
    subtext: '(0 = Sem dor | 10 = Dor insuportável)',
    minLabel: 'Sem dor',
    maxLabel: 'Insuportável'
  },
  {
    id: 10,
    type: 'multiple',
    text: 'Qual a sua maior dificuldade hoje para cuidar do seu core?',
    options: [
      { label: 'Não tenho tempo nenhum.', xp: 1 },
      { label: 'Tenho tempo, mas não sei por onde começar.', xp: 2 },
      { label: 'Já sei o que fazer, mas falho na consistência.', xp: 2 },
      { label: 'Estou priorizando 5-10 min por dia para mim.', xp: 3 },
    ]
  },
  {
    id: 11,
    type: 'multiple',
    text: 'Ao se olhar no espelho, como você define sua relação com sua barriga hoje?',
    options: [
      { label: 'Insegurança total, sinto que não é minha.', xp: 1 },
      { label: 'Desconforto, mas quero entender como recuperar.', xp: 2 },
      { label: 'Aceitação e foco na funcionalidade e saúde.', xp: 3 },
    ]
  },
  {
    id: 12,
    type: 'multiple',
    text: 'Você sente escapes de xixi ao espirrar ou saltar?',
    options: [
      { label: 'Frequentemente.', xp: 0 },
      { label: 'Às vezes.', xp: 1 },
      { label: 'Nunca aconteceu.', xp: 3 },
    ]
  }
];

const PROFILES = [
  {
    id: 'p1',
    name: 'Priorize Avaliação Profissional',
    range: [0, 10],
    icon: <Shield className="w-12 h-12 text-red-500" />,
    description: 'Seu sistema de suporte (core) está sobrecarregado. A pressão está "vencendo" a musculatura.',
    errors: ['Abdominais intensos agora', 'Prender o ar em esforços', 'Ignorar escapes de xixi'],
    actions: ['Sopre o ar ao pegar o bebê', 'Levante da cama sempre de lado', 'Busque um especialista'],
    cta: 'Desbloquear Guia de Recuperação',
    badge: { name: 'Badge Proteção', icon: <Shield className="w-6 h-6" /> }
  },
  {
    id: 'p2',
    name: 'Instabilidade do Core',
    range: [11, 20],
    icon: <Gem className="w-12 h-12 text-blue-500" />,
    description: 'Você já tem percepção, mas a "engrenagem" ainda falha sob fadiga. A lombar está compensando.',
    errors: ['Má postura ao amamentar', 'Carregar peso de um lado só', 'Falta de hidratação'],
    actions: ['Apoie as costas ao amamentar', 'Respire consciente 2min 3x/dia', 'Evite impacto agora'],
    cta: 'Garantir meu Core Consciente',
    badge: { name: 'Badge Core Consciente', icon: <Gem className="w-6 h-6" /> }
  },
  {
    id: 'p3',
    name: 'Atenção com a Pressão',
    range: [21, 30],
    icon: <Crown className="w-12 h-12 text-yellow-500" />,
    description: 'Você está no caminho certo! Já tem força, mas pequenos hábitos impedem o resultado final.',
    errors: ['Ficar sentada sem apoio', 'Não ativar core em treinos gerais', 'Intestino preguiçoso'],
    actions: ['Use banquinho nos pés no banheiro', 'Inclua mobilidade de coluna', 'Aumente as fibras'],
    cta: 'Alcançar Postura de Rainha',
    badge: { name: 'Badge Postura de Rainha', icon: <Crown className="w-6 h-6" /> }
  },
  {
    id: 'p4',
    name: 'Base Boa',
    range: [31, 36],
    icon: <Flame className="w-12 h-12 text-orange-500" />,
    description: 'Excelente! Consciência corporal acima da média. O foco agora é a progressão segura.',
    errors: ['Apressar volta a cargas máximas', 'Pular o aquecimento específico', 'Ignorar pequenos sinais'],
    actions: ['Teste pranchas curtas de 10s', 'Mantenha o ritual de aquecimento', 'Compartilhe sua evolução'],
    cta: 'Módulo de Retomada Avançada',
    badge: { name: 'Badge Respira e Vai', icon: <Flame className="w-6 h-6" /> }
  }
];

// --- Components ---

const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  const progress = (current / total) * 100;
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-xs font-semibold mb-1 uppercase tracking-wider opacity-70">
        <span>Progresso</span>
        <span>{Math.round(progress)}% Concluído</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const QuizApp = () => {
  const [step, setStep] = useState<'welcome' | 'quiz' | 'result'>('welcome');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [totalXP, setTotalXP] = useState(0);

  const startQuiz = () => {
    setStep('quiz');
    setCurrentQuestionIdx(0);
    setAnswers({});
  };

  const handleAnswer = (xp: number) => {
    const newAnswers = { ...answers, [QUESTIONS[currentQuestionIdx].id]: xp };
    setAnswers(newAnswers);

    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      const finalXP = Object.values(newAnswers).reduce((a: number, b: number) => a + b, 0);
      setTotalXP(finalXP);
      setStep('result');
    }
  };

  const goBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    } else {
      setStep('welcome');
    }
  };

  const getProfile = (xp: number) => {
    return PROFILES.find(p => xp >= p.range[0] && xp <= p.range[1]) || PROFILES[0];
  };

  const renderQuestion = () => {
    const q = QUESTIONS[currentQuestionIdx];

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-xl font-bold mb-2 leading-tight">{q.text}</h2>
        {q.subtext && <p className="text-sm opacity-80 mb-6 italic">{q.subtext}</p>}

        <div className="space-y-3">
          {q.type === 'multiple' && q.options?.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt.xp)}
              className="w-full text-left p-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-primary hover:bg-teal-50 transition-all card-shadow group"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium group-hover:text-primary">{opt.label}</span>
                <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:text-primary" />
              </div>
            </button>
          ))}

          {q.type === 'scale' && (
            <div className="py-8">
              <input 
                type="range" 
                min="0" max="10" 
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  let xp = 0;
                  if (q.id === 2) {
                    if (val <= 3) xp = 0;
                    else if (val <= 6) xp = 1;
                    else if (val <= 8) xp = 2;
                    else xp = 3;
                  } else { 
                    if (val >= 7) xp = 0;
                    else if (val >= 4) xp = 1;
                    else if (val >= 1) xp = 2;
                    else xp = 3;
                  }
                  handleAnswer(xp);
                }}
              />
              <div className="flex justify-between mt-4 text-xs font-bold text-charcoal opacity-60">
                <span>{q.minLabel}</span>
                <span>{q.maxLabel}</span>
              </div>
            </div>
          )}

          {q.type === 'boolean' && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(0)}
                className="p-6 rounded-2xl border-2 border-gray-100 bg-white hover:border-red-400 transition-all card-shadow flex flex-col items-center gap-2"
              >
                <AlertTriangle className="text-red-400" />
                <span className="font-bold">Verdadeiro</span>
              </button>
              <button
                onClick={() => handleAnswer(3)}
                className="p-6 rounded-2xl border-2 border-gray-100 bg-white hover:border-green-400 transition-all card-shadow flex flex-col items-center gap-2"
              >
                <CheckCircle2 className="text-green-400" />
                <span className="font-bold">Falso</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">C</div>
          <span className="font-bold text-sm tracking-tighter uppercase">Código do Core</span>
        </div>
        {step === 'quiz' && (
          <button onClick={goBack} className="p-2 rounded-full hover:bg-white/50 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
      </header>

      {step === 'welcome' && (
        <main className="flex-1 flex flex-col justify-center text-center animate-in fade-in zoom-in-95 duration-700">
          <h1 className="text-3xl font-bold mb-4 leading-tight">O Código do Core Pós-Parto</h1>
          <p className="text-lg opacity-80 mb-8">Descubra o estado atual da sua recuperação e libere seu primeiro Badge de Conquista!</p>
          
          <div className="bg-white/50 p-6 rounded-3xl mb-8 border border-white/40">
            <h3 className="font-bold mb-4 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-coral" /> Como Jogar:
            </h3>
            <ul className="text-left space-y-4 text-sm font-medium">
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 bg-primary/20 text-primary rounded-full flex-shrink-0 flex items-center justify-center text-xs">1</div>
                <span>Responda 12 perguntas rápidas sobre sua rotina e corpo.</span>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 bg-primary/20 text-primary rounded-full flex-shrink-0 flex items-center justify-center text-xs">2</div>
                <span>Ganhe pontos de XP em cada etapa.</span>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 bg-primary/20 text-primary rounded-full flex-shrink-0 flex items-center justify-center text-xs">3</div>
                <span>Desbloqueie seu microplano e sua insígnia de domínio.</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded-2xl border border-yellow-200 mb-8 text-xs text-yellow-800">
            <Info className="w-8 h-8 opacity-50" />
            <p className="text-left">Este quiz é educativo e não substitui avaliação de um(a) fisioterapeuta e/ou médico(a).</p>
          </div>

          <button 
            onClick={startQuiz}
            className="w-full bg-primary text-white py-5 rounded-3xl font-bold text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            Iniciar Jornada <ChevronRight className="w-6 h-6" />
          </button>
        </main>
      )}

      {step === 'quiz' && (
        <main className="flex-1">
          <ProgressBar current={currentQuestionIdx} total={QUESTIONS.length} />
          {renderQuestion()}
        </main>
      )}

      {step === 'result' && (
        <main className="flex-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-white rounded-full card-shadow mb-4">
              {getProfile(totalXP).icon}
            </div>
            <h2 className="text-sm uppercase font-bold text-primary tracking-widest mb-1 text-center">Resultado Alcançado</h2>
            <h1 className="text-2xl font-bold text-charcoal text-center">{getProfile(totalXP).name}</h1>
            <div className="mt-2 text-coral font-bold text-xl text-center">{totalXP} XP</div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl card-shadow">
              <h3 className="font-bold flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-primary" /> O que isso sugere:
              </h3>
              <p className="text-sm opacity-80 leading-relaxed">{getProfile(totalXP).description}</p>
            </div>

            <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
              <h3 className="font-bold text-red-800 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5" /> Erros para evitar:
              </h3>
              <ul className="space-y-2">
                {getProfile(totalXP).errors.map((e, i) => (
                  <li key={i} className="flex gap-2 items-center text-sm text-red-700 font-medium">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full" /> {e}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
              <h3 className="font-bold text-green-800 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5" /> Microplano Seguro:
              </h3>
              <ul className="space-y-3">
                {getProfile(totalXP).actions.map((a, i) => (
                  <li key={i} className="flex gap-3 items-center text-sm text-green-700 font-semibold bg-white/50 p-3 rounded-xl border border-white">
                    <span className="w-5 h-5 bg-green-200 text-green-800 rounded-full flex items-center justify-center text-[10px]">{i+1}</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl card-shadow flex items-center justify-between border-2 border-primary/20">
              <div>
                <p className="text-[10px] uppercase font-bold text-primary tracking-tighter">Insignia Desbloqueada</p>
                <h4 className="font-bold text-lg">{getProfile(totalXP).badge.name}</h4>
              </div>
              <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                {getProfile(totalXP).badge.icon}
              </div>
            </div>

            <div className="py-6 space-y-4">
              <h3 className="font-bold text-center mb-2 italic opacity-70">"Complete seu domínio e recupere seu corpo."</h3>
              
              <button 
                onClick={() => window.location.href = CHECKOUT_URL}
                className="w-full bg-primary text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl text-lg animate-bounce"
              >
                {getProfile(totalXP).cta} <ArrowRight className="w-6 h-6" />
              </button>

              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-transparent text-charcoal/50 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-white/30 transition-all text-xs"
              >
                <RotateCcw className="w-4 h-4" /> Refazer Quiz
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="mt-8 text-center text-[10px] opacity-40 font-semibold uppercase tracking-[0.2em] py-4">
        © Código do Core Pós-Parto
      </footer>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<QuizApp />);
}
