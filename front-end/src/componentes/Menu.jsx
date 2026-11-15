import { Link, NavLink } from 'react-router-dom';
import { GraduationCap, Users, UserPlus, ClipboardList } from 'lucide-react';

// Links do menu, caminho da pagina, texto e icone
const links = [
  { caminho: '/', texto: 'Listar alunos', Icone: Users },
  { caminho: '/cadastro', texto: 'Cadastrar aluno', Icone: UserPlus },
  { caminho: '/listar-notas', texto: 'Listar notas', Icone: ClipboardList },
];



export default function Menu() {
  return (
    <header className="border-b border-linha bg-papel">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <GraduationCap size={24} strokeWidth={1.25} />
          <span className="font-titulo text-xl font-semibold">Sistema Acadêmico</span>
        </Link>

        <nav className="flex flex-wrap gap-x-6 gap-y-1">
          {links.map(({ caminho, texto, Icone }) => (
            <NavLink
              key={caminho}
              to={caminho}
              end
              className={({ isActive }) =>
                `flex items-center gap-2 border-b py-1 text-sm transition-colors ${
                  isActive
                    ? 'border-tinta text-tinta'
                    : 'border-transparent text-tinta-suave hover:text-tinta'
                }`
              }
            >
              <Icone size={17} strokeWidth={1.5} />
              {texto}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
