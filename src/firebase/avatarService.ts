// Servicio para generar avatares con DiceBear
export interface AvatarStyle {
  name: string;
  displayName: string;
  description: string;
}

// Estilos disponibles de DiceBear - cambiar de array a objeto
export const AVATAR_STYLES: Record<string, AvatarStyle> = {
  'avataaars': {
    name: 'avataaars',
    displayName: 'Avataaars',
    description: 'Estilo cartoon colorido'
  },
  'big-smile': {
    name: 'big-smile',
    displayName: 'Big Smile',
    description: 'Caras sonrientes simples'
  },
  'bottts': {
    name: 'bottts',
    displayName: 'Bottts',
    description: 'Robots coloridos'
  },
  'pixel-art': {
    name: 'pixel-art',
    displayName: 'Pixel Art',
    description: 'Estilo retro 8-bit'
  },
  'personas': {
    name: 'personas',
    displayName: 'Personas',
    description: 'Personas realistas'
  },
  'fun-emoji': {
    name: 'fun-emoji',
    displayName: 'Fun Emoji',
    description: 'Emojis divertidos'
  }
};

// Generar URL del avatar
export const generateAvatarUrl = (
  seed: string,
  style: string = 'avataaars',
  size: number = 200
): string => {
  const baseUrl = 'https://api.dicebear.com/7.x';
  const params = new URLSearchParams({
    seed: seed,
    size: size.toString(),
    backgroundColor: 'transparent'
  });
  
  return `${baseUrl}/${style}/svg?${params.toString()}`;
};

// Generar semilla única para el usuario
export const generateUserSeed = (userId: string, customSeed?: string): string => {
  return customSeed || `user-${userId}-${Date.now()}`;
};

// Obtener avatar por defecto
export const getDefaultAvatar = (userId: string): string => {
  return generateAvatarUrl(generateUserSeed(userId), 'avataaars');
};