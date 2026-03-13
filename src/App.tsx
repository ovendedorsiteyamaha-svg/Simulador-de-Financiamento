import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, RefreshCw, ChevronRight, Smartphone, Share2 } from 'lucide-react';

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
  24: 0.0182,
  36: 0.0235,
  48: 0.0287,
};

export default function App() {
  const [product, setProduct] = useState<string>('');
  const [productValue, setProductValue] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [installments, setInstallments] = useState<number>(48);

  // Split products for the two dropdowns
  const motorcycles = PRODUCTS.filter(p => p.category === 'Moto');
  const outboardMotors = PRODUCTS.filter(p => p.category === 'Motor de Popa');

  const handleMotorcycleChange = (val: string) => {
    setProduct(val);
  };

  const handleOutboardChange = (val: string) => {
    setProduct(val);
  };

  // Function to clean BRL values before calculation
  const limparNumero = (valor: any): number => {
    if (!valor) return 0;
    
    // Convert to string and remove dots (thousands separator), then replace comma with dot
    const cleanValue = valor.toString()
      .replace(/\./g, '')
      .replace(',', '.');
    
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Simple change handler
  const handleCurrencyChange = (val: string, setter: (v: string) => void) => {
    setter(val);
  };

  // Calculation logic
  const calculation = useMemo(() => {
    const valorProduto = limparNumero(productValue);
    const entrada = limparNumero(downPayment);
    const valorFinanciado = valorProduto - entrada;

    if (valorFinanciado <= 0 || !installments) return null;

    const rate = RATES[installments];
    const n = installments;

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
    setProductValue('');
    setDownPayment('');
    setInstallments(48);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans p-4 md:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2 mb-4">
          <div className="inline-flex items-center justify-center p-3 bg-yamaha-blue rounded-2xl shadow-lg shadow-blue-200 mb-2">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-800">
            Simulador de Financiamento Yamaha
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form Section */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Two Dropdowns for Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 ml-1">
                  Motocicletas
                </label>
                <select
                  value={motorcycles.some(m => m.name === product) ? product : ''}
                  onChange={(e) => handleMotorcycleChange(e.target.value)}
                  className={`w-full h-14 px-4 border-none rounded-2xl text-lg focus:ring-2 focus:ring-yamaha-blue transition-all appearance-none cursor-pointer ${
                    motorcycles.some(m => m.name === product) ? 'bg-blue-50 text-blue-800 font-semibold' : 'bg-neutral-50 text-neutral-500'
                  }`}
                >
                  <option value="">Selecione Moto</option>
                  {motorcycles.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 ml-1">
                  Motores de Popa
                </label>
                <select
                  value={outboardMotors.some(m => m.name === product) ? product : ''}
                  onChange={(e) => handleOutboardChange(e.target.value)}
                  className={`w-full h-14 px-4 border-none rounded-2xl text-lg focus:ring-2 focus:ring-yamaha-blue transition-all appearance-none cursor-pointer ${
                    outboardMotors.some(m => m.name === product) ? 'bg-blue-50 text-blue-800 font-semibold' : 'bg-neutral-50 text-neutral-500'
                  }`}
                >
                  <option value="">Selecione Motor</option>
                  {outboardMotors.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 ml-1">
                  Valor do Produto (R$)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 19.950,00"
                  value={productValue}
                  onChange={(e) => handleCurrencyChange(e.target.value, setProductValue)}
                  className="w-full h-14 px-4 bg-neutral-50 border-none rounded-2xl text-lg focus:ring-2 focus:ring-yamaha-blue transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 ml-1">
                  Entrada (R$)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 1.500,00"
                  value={downPayment}
                  onChange={(e) => handleCurrencyChange(e.target.value, setDownPayment)}
                  className="w-full h-14 px-4 bg-neutral-50 border-none rounded-2xl text-lg focus:ring-2 focus:ring-yamaha-blue transition-all"
                />
              </div>
            </div>

            {/* Installments */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 ml-1">
                Parcelamento
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[24, 36, 48].map((n) => (
                  <button
                    key={n}
                    onClick={() => setInstallments(n)}
                    className={`h-14 rounded-2xl font-bold transition-all ${
                      installments === n
                        ? 'bg-yamaha-blue text-white shadow-md shadow-blue-200'
                        : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {n}x
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-neutral-400 text-center mt-2">
                Taxas Banco Yamaha: 24x (1.82%) • 36x (2.35%) • 48x (2.87%)
              </p>
            </div>
          </div>
          </section>

          {/* Result Column */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {calculation && product ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div 
                    id="simulation-card"
                    className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-neutral-100 overflow-hidden relative"
                  >
                    {/* Header Section */}
                    <div className="bg-yamaha-blue p-6 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                      <div className="relative z-10 space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-200 opacity-80">
                          Simulação
                        </p>
                        <h2 className="text-4xl font-black tracking-tighter leading-[0.9]">
                          {product}
                        </h2>
                      </div>
                    </div>

                    {/* Body Section */}
                    <div className="p-6 space-y-4">
                      <div className="bg-blue-50/50 rounded-3xl p-4 border border-blue-100 text-center space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-yamaha-blue opacity-70">
                          Entrada
                        </p>
                        <p className="text-2xl font-black text-neutral-900 tracking-tight">
                          {formatCurrency(limparNumero(downPayment))}
                        </p>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-dashed border-neutral-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-4 text-[10px] font-bold uppercase tracking-widest text-neutral-300">
                            Plano Sugerido
                          </span>
                        </div>
                      </div>

                      <div className="text-center space-y-0">
                        <div className="inline-flex items-baseline gap-2">
                          <span className="text-4xl font-black text-neutral-900 tracking-tighter">
                            {installments}x
                          </span>
                          <span className="text-base font-bold text-yamaha-blue">de</span>
                        </div>
                        <div className="text-3xl font-black text-yamaha-blue tracking-tight">
                          {formatCurrency(calculation.pmt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={reset}
                      className="w-full h-16 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Fazer nova simulação
                    </button>
                    
                    <p className="text-center text-[10px] text-neutral-400 px-8">
                      *Valores sujeitos a alteração conforme análise de crédito e tabela vigente.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/50 border-2 border-dashed border-neutral-200 rounded-[2.5rem] p-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-neutral-100 rounded-full mx-auto flex items-center justify-center">
                    <Share2 className="w-6 h-6 text-neutral-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
                      Aguardando Dados
                    </p>
                    <p className="text-xs text-neutral-400 max-w-[200px] mx-auto">
                      Selecione um produto e insira os valores para gerar o resumo.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
