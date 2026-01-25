import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import logo from '@/assets/logo.png';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user,
    profile,
    signOut,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  return <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="NEUROX Logo" className="h-8 w-auto" />
          <span className="font-display text-xl font-bold text-foreground">NEUROX</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/testes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Testes
          </Link>
          <Link to="/precos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Preços
          </Link>
          <Link to="/sobre" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sobre
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{profile?.full_name || 'Usuário'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <User className="mr-2 h-4 w-4" />
                  Minha Conta
                </DropdownMenuItem>
                {isAdmin && <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Painel Admin
                  </DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> : <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Entrar
              </Button>
              <Button variant="hero" onClick={() => navigate('/cadastro')}>
                Começar Grátis
              </Button>
            </>}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container py-4 flex flex-col gap-2">
            <Link to="/testes" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
              Testes
            </Link>
            <Link to="/precos" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
              Preços
            </Link>
            <Link to="/sobre" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
              Sobre
            </Link>
            <div className="border-t border-border my-2" />
            {user ? <>
                <Link to="/dashboard" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Minha Conta
                </Link>
                <button className="px-4 py-2 text-sm font-medium text-destructive text-left hover:bg-muted rounded-lg transition-colors" onClick={() => {
            handleSignOut();
            setIsMenuOpen(false);
          }}>
                  Sair
                </button>
              </> : <>
                <Button variant="ghost" onClick={() => {
            navigate('/login');
            setIsMenuOpen(false);
          }}>
                  Entrar
                </Button>
                <Button variant="hero" onClick={() => {
            navigate('/cadastro');
            setIsMenuOpen(false);
          }}>
                  Começar Grátis
                </Button>
              </>}
          </nav>
        </div>}
    </header>;
};
export default Header;