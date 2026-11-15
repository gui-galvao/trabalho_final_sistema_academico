// Transforma "2003-04-12" em "12/04/2003" (sem usar Date, para não errar o dia por causa do fuso horário)
export function formatarData(data) {
  if (!data) return '';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}



// Mostra a nota no formato brasileiro (8,5). Se não houver nota, mostra um traço
export function formatarNota(nota) {
  if (nota === null || nota === undefined) return '—';
  return Number(nota).toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
}


// Calcula média e situação (usado só para mostrar a prévia na tela de notas)
export function calcularMedia(nota1, nota2) {
  const media = Math.round(((nota1 + nota2) / 2) * 100) / 100;
  const situacao = media >= 7 ? 'Aprovado' : 'Reprovado';
  return { media, situacao };
}
