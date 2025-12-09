// Validación de RUN chileno con dígito verificador
export const validateRUN = (run: string): boolean => {
  if (!run || run.trim() === '') return false;
  
  try {
    // Limpiar el RUN: quitar puntos, guiones y convertir a mayúsculas
    let cleanRun = run.toUpperCase().replace(/\./g, '').replace(/-/g, '');
    
    // Validar longitud (debe tener al menos 7 caracteres: 6 dígitos + 1 dígito verificador)
    if (cleanRun.length < 7 || cleanRun.length > 9) {
      return false;
    }
    
    // Separar el número del dígito verificador
    const rutNumber = cleanRun.substring(0, cleanRun.length - 1);
    const providedDv = cleanRun.charAt(cleanRun.length - 1);
    
    // Validar que el número sea válido
    const rutAux = parseInt(rutNumber, 10);
    if (isNaN(rutAux) || rutAux <= 0) {
      return false;
    }
    
    // Calcular el dígito verificador esperado usando el algoritmo chileno
    let s = 1;
    let m = 0;
    let rutTemp = rutAux;
    
    while (rutTemp !== 0) {
      s = (s + (rutTemp % 10) * (9 - (m++ % 6))) % 11;
      rutTemp = Math.floor(rutTemp / 10);
    }
    
    // El dígito verificador esperado
    const expectedDv = s !== 0 ? String.fromCharCode(s + 47) : 'K';
    
    // Comparar con el dígito verificador proporcionado
    return providedDv === expectedDv;
  } catch (error) {
    return false;
  }
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
export const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null || isNaN(price)) {
    return '$0';
  }
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
