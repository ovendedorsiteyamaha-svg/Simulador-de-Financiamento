import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, RefreshCw, Share2 } from 'lucide-react';

// Types
type Category = 'Moto' | 'Motor de Popa';

interface Product {
  name: string;
  category: Category;
}

const PRODUCTS: Product[] = [
  // Motos
  { name: 'Fluo ABS Hybrid', category: 'Moto' },
  { name: 'Aerox 160 ABS', category: 'Moto' },
  { name: 'NMAX 160 ABS', category: 'Moto' },
  { name: 'XMAX 300 ABS', category: 'Moto' },
  { name: 'Factor 150 ED', category: 'Moto' },
  { name: 'Factor 150 DX', category: 'Moto' },
  { name: 'FZ15 ABS', category: 'Moto' },
  { name: 'FZ25 ABS', category: 'Moto' },
  { name: 'Crosser 150 S', category: 'Moto' },
  { name: 'Crosser 150 Z', category: 'Moto' },
  { name: 'Lander 250', category: 'Moto' },
  { name: 'Ténéré 700', category: 'Moto' },
  { name: 'R15 ABS', category: 'Moto' },
  { name: 'R3 ABS', category: 'Moto' },
  { name: 'MT‑03 ABS', category: 'Moto' },
  { name: 'MT‑07 ABS', category: 'Moto' },
  { name: 'TTR‑230', category: 'Moto' },
  { name: 'Neo\'s Elétrica', category: 'Moto' },
  // Motores de Popa
  { name: '4 CMHS 2T', category: 'Motor de Popa' },
  { name: 'F6 CMHS 4T', category: 'Motor de Popa' },
  { name: '15HP 2T', category: 'Motor de Popa' },
  { name: 'F20 BMHS 4T', category: 'Motor de Popa' },
  { name: 'F25 GMHS 4T', category: 'Motor de Popa' },
  { name: 'F25 GWHS 4T', category: 'Motor de Popa' },
  { name: '30 HMHS 2T', category: 'Motor de Popa' },
  { name: '30 HWHS 2T', category: 'Motor de Popa' },
  { name: '40 AMHS 2T', category: 'Motor de Popa' },
  { name: '40 AWHS 2T', category: 'Motor de Popa' },
  { name: '40 AWS 2T', category: 'Motor de Popa' },
  { name: 'F40 FETL 4T', category: 'Motor de Popa' },
  { name: 'F60 FETL 4T', category: 'Motor de Popa' },
  { name: 'F90 CETL 4T', category: 'Motor de Popa' },
  { name: 'F115 BET 4T', category: 'Motor de Popa' },
  { name: 'F150 LET 4T', category: 'Motor de Popa' },
];

const RATES: Record<number, number> = {
  24: 0.0300,
  36: 0.0350,
  48: 0.0400,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'Motocicletas' | 'Motores'>('Motocicletas');
  const [product, setProduct] = useState<string>('');
  const [productValue, setProductValue] = useState<string>('R$ 0,00');
  const [downPayment, setDownPayment] = useState<string>('R$ 0,00');
  const [installments, setInstallments] = useState<number>(48);

  // Split products for the tabs
  const motorcycles = PRODUCTS.filter(p => p.category === 'Moto');
  const outboardMotors = PRODUCTS.filter(p => p.category === 'Motor de Popa');

  const currentProducts = activeTab === 'Motocicletas' ? motorcycles : outboardMotors;

  // Function to clean BRL values before calculation
  const limparNumero = (valor: string): number => {
    if (!valor) return 0;
    // Rule: remover R$, pontos, vírgulas, espaços e dividir por 100 
    // para compensar as casas decimais exibidas na máscara
    const limpo = valor.replace(/\D/g, '');
    return (parseInt(limpo) / 100) || 0;
  };

  // Function to format number to BRL currency (for results)
  const formatarReal = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };

  // Function to capture only digits
  const somenteNumero = (valor: string) => {
    return valor.replace(/\D/g, '');
  };

  // Stable mask application for inputs (showing decimals like in the image)
  const aplicarMascara = (val: string) => {
    const numeroStr = somenteNumero(val);
    if (numeroStr === "") return "";
    const numero = parseInt(numeroStr) / 100;
    // Format with decimals to match the image
    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Handler with masking
  const handleCurrencyChange = (val: string, setter: (v: string) => void) => {
    const masked = aplicarMascara(val);
    setter(masked);
  };

  // Calculation logic (Price Table Formula)
  const calculation = useMemo(() => {
    const valorProduto = limparNumero(productValue);
    const entrada = limparNumero(downPayment);
    const valorFinanciado = valorProduto - entrada;

    // Rule: O cálculo deve usar apenas os números digitados
    if (!product || valorFinanciado <= 0 || !installments) return null;

    const rate = RATES[installments]; // Taxa mensal
    const n = installments;           // Parcelas

    // Price Table Formula: PMT = PV * (i * (1 + i)^n) / ((1 + i)^n - 1)
    const pmt = valorFinanciado * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);

    return {
      financed: valorFinanciado,
      pmt,
      total: pmt * n,
    };
  }, [productValue, downPayment, installments]);

  const reset = () => {
    setProduct('');
    setProductValue('R$ 0,00');
    setDownPayment('R$ 0,00');
    setInstallments(48);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans p-4 md:p-8">
      <div className="max-w-md md:max-w-2xl lg:max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#003B8E] rounded-xl shadow-lg">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#003B8E] leading-tight">
              Simulador de Financiamento<br />Yamaha
            </h1>
            <p className="text-sm text-neutral-500">
              Simulação de parcelamento em tempo real
            </p>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Card (Inputs) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 space-y-8">
            {/* Tabs */}
          <div className="bg-[#F1F5F9] p-1 rounded-xl flex">
            <button
              onClick={() => {
                setActiveTab('Motocicletas');
                setProduct('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'Motocicletas' ? 'bg-white text-[#003B8E] shadow-sm' : 'text-neutral-500'
              }`}
            >
              <span className="text-lg">🏍️</span> Motocicletas
            </button>
            <button
              onClick={() => {
                setActiveTab('Motores');
                setProduct('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'Motores' ? 'bg-white text-[#003B8E] shadow-sm' : 'text-neutral-500'
              }`}
            >
              <span className="text-lg">⚓</span> Motores
            </button>
          </div>

          <div className="space-y-6">
            {/* Modelo */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">
                MODELO
              </label>
              <div className="relative">
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full h-14 px-4 bg-white border border-neutral-200 rounded-xl text-base font-medium focus:ring-2 focus:ring-[#003B8E] focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Escolher Produto</option>
                  {currentProducts.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Valor e Entrada em Grid no Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Valor do Produto */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">
                  VALOR DO PRODUTO
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={productValue}
                  onChange={(e) => handleCurrencyChange(e.target.value, setProductValue)}
                  className="w-full h-14 px-4 bg-white border border-neutral-200 rounded-xl text-base font-medium focus:ring-2 focus:ring-[#003B8E] focus:border-transparent transition-all"
                />
              </div>

              {/* Entrada */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">
                  ENTRADA
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={downPayment}
                  onChange={(e) => handleCurrencyChange(e.target.value, setDownPayment)}
                  className="w-full h-14 px-4 bg-white border border-neutral-200 rounded-xl text-base font-medium focus:ring-2 focus:ring-[#003B8E] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Plano de Parcelamento */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">
                PLANO DE PARCELAMENTO
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[24, 36, 48].map((n) => (
                  <button
                    key={n}
                    onClick={() => setInstallments(n)}
                    className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all active:scale-95 ${
                      installments === n
                        ? 'border-[#003B8E] bg-white'
                        : 'border-neutral-100 bg-[#F8FAFC]'
                    }`}
                  >
                    <span className={`text-lg font-bold ${installments === n ? 'text-[#003B8E]' : 'text-neutral-600'}`}>
                      {n}x
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

          {/* Result Card Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <AnimatePresence mode="wait">
              {calculation ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#003B8E] rounded-3xl p-8 text-white shadow-xl space-y-8"
                >
                  <div className="space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                      SIMULAÇÃO
                    </p>
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-medium opacity-60">Modelo Selecionado</p>
                        <p className="text-2xl font-bold leading-tight">{product}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-medium opacity-60">Entrada</p>
                        <p className="text-2xl font-bold">{formatCurrency(limparNumero(downPayment))}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0D47A1] rounded-2xl p-6 text-center space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                      PLANO SUGERIDO
                    </p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-3xl font-bold">{installments}x</span>
                      <span className="text-sm font-medium opacity-60">de</span>
                      <span className="text-3xl font-bold">{formatCurrency(calculation.pmt)}</span>
                    </div>
                  </div>

                  <button
                    onClick={reset}
                    className="w-full h-14 bg-white text-[#003B8E] rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Nova Simulação
                  </button>
                </motion.div>
              ) : (
                <div className="bg-white border-2 border-dashed border-neutral-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                    <Calculator className="w-8 h-8 text-neutral-300" />
                  </div>
                  <h3 className="text-neutral-900 font-bold text-lg">Aguardando dados</h3>
                  <p className="text-neutral-400 text-sm">Selecione um produto para ver o resultado.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center space-y-1 pb-8">
          <p className="text-[10px] text-neutral-400">
            © 2026 Yamaha Motor do Brasil. Simulação sujeita a análise de crédito.
          </p>
        </footer>
      </div>
    </div>
  );
}
