import { useEffect } from 'react';

// Tela de confirmação antes de excluir um aluno
export default function ModalConfirmar({ titulo, texto, textoConfirmar, aoConfirmar, aoCancelar }) {
  // ESC FECHA
  useEffect(() => {
    function aoApertarTecla(evento) {
      if (evento.key === 'Escape') aoCancelar();
    }
    window.addEventListener('keydown', aoApertarTecla);
    return () => window.removeEventListener('keydown', aoApertarTecla);
  }, [aoCancelar]);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-tinta/30 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal"
        className="w-full max-w-sm rounded-lg border border-linha bg-papel p-6"
      >
        <h2 id="titulo-modal" className="mb-2 text-xl">{titulo}</h2>
        <p className="mb-6 text-sm text-tinta-suave">{texto}</p>
        <div className="flex justify-end gap-2">
          <button type="button" autoFocus onClick={aoCancelar} className="botao botao-simples">
            Cancelar
          </button>
          <button type="button" onClick={aoConfirmar} className="botao botao-excluir">
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
