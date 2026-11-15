import { useEffect } from 'react';
import { CircleCheck, CircleAlert, X } from 'lucide-react';


// msg sucesso ou erro
export default function Aviso({ tipo, texto, aoFechar }) {
  const ehSucesso = tipo === 'sucesso';

  // Aviso de sucesso some sozinho depois de 5s
  useEffect(() => {
    if (!ehSucesso) return;
    const tempo = setTimeout(aoFechar, 5000);
    return () => clearTimeout(tempo);
  }, [tipo, texto]);

  const Icone = ehSucesso ? CircleCheck : CircleAlert;
  const cores = ehSucesso
    ? 'border-sucesso/30 bg-sucesso-claro text-sucesso'
    : 'border-perigo/30 bg-perigo-claro text-perigo';

  return (
    <div
      role={ehSucesso ? 'status' : 'alert'}
      className={`mb-6 flex items-center gap-3 rounded-md border px-4 py-3 text-sm ${cores}`}
    >
      <Icone size={18} strokeWidth={1.5} className="shrink-0" />
      <p className="flex-1">{texto}</p>
      <button type="button" onClick={aoFechar} aria-label="Fechar aviso" className="cursor-pointer">
        <X size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
}
