// Atiqueta colorida: Aprovado, Reprovado ou Sem notas
export default function EtiquetaSituacao({ situacao }) {
  if (situacao === 'Aprovado') return <span className="etiqueta etiqueta-sucesso">Aprovado</span>;
  if (situacao === 'Reprovado') return <span className="etiqueta etiqueta-perigo">Reprovado</span>;
  return <span className="etiqueta etiqueta-neutra">Sem notas</span>;
}
