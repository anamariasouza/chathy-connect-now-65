
export interface ContactProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  joinDate: string;
  followers: number;
  following: number;
  posts: number;
  avatar: string;
  username: string;
  isOnline: boolean;
}

export const contactProfiles: ContactProfile[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '+55 11 98765-4321',
    location: 'Rio de Janeiro, RJ',
    bio: 'Designer gráfica apaixonada por arte e criatividade. Amo compartilhar momentos especiais!',
    joinDate: '2023',
    followers: 2340,
    following: 567,
    posts: 89,
    avatar: 'M',
    username: 'mariasilva',
    isOnline: true
  },
  {
    id: '2',
    name: 'Pedro Santos',
    email: 'pedro.santos@email.com',
    phone: '+55 11 97654-3210',
    location: 'São Paulo, SP',
    bio: 'Engenheiro de software e entusiasta de tecnologia. Sempre em busca de novos desafios.',
    joinDate: '2022',
    followers: 1890,
    following: 423,
    posts: 67,
    avatar: 'P',
    username: 'pedrosantos',
    isOnline: false
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '+55 11 96543-2109',
    location: 'Belo Horizonte, MG',
    bio: 'Fotógrafa profissional e amante da natureza. Capturando momentos únicos há 10 anos.',
    joinDate: '2021',
    followers: 3456,
    following: 789,
    posts: 156,
    avatar: 'A',
    username: 'anacosta',
    isOnline: true
  },
  {
    id: '4',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '+55 11 95432-1098',
    location: 'Brasília, DF',
    bio: 'Músico e produtor musical. Criando sons únicos e compartilhando minha paixão pela música.',
    joinDate: '2023',
    followers: 4567,
    following: 234,
    posts: 123,
    avatar: 'J',
    username: 'joaosilva',
    isOnline: true
  }
];
