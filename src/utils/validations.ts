// Validación de RUN chileno
export const validateRUN = (run: string): boolean => {
  const cleanRun = run.replace(/\./g, '').replace(/-/g, '');
  return cleanRun.length >= 7 && cleanRun.length <= 9;
};

// Validación de correo electrónico con dominios permitidos
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  const allowedDomains = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];
  const domain = email.split('@')[1];
  
  return allowedDomains.includes(domain);
};

// Validación de edad (mayor de 18 años)
export const validateAge = (birthDate: string): boolean => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= 18;
  }
  
  return age >= 18;
};

// Validación de precio
export const validatePrice = (price: number): boolean => {
  return price >= 0;
};

// Validación de stock
export const validateStock = (stock: number): boolean => {
  return Number.isInteger(stock) && stock >= 0;
};

// Validación de código de producto
export const validateProductCode = (code: string): boolean => {
  return code.length >= 3;
};

// Formatear precio chileno
export const formatPrice = (price: number): string => {
  if (price === 0) return 'FREE';
  return `$${price.toLocaleString('es-CL')}`;
};

// Formatear RUN chileno
export const formatRUN = (run: string): string => {
  const cleanRun = run.replace(/\./g, '').replace(/-/g, '');
  if (cleanRun.length < 7) return run;
  
  const body = cleanRun.slice(0, -1);
  const verifier = cleanRun.slice(-1);
  
  return `${body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${verifier}`;
};
