// Validación de RUN chileno con dígito verificador
// Usa el mismo algoritmo que el backend (RutValidator.java)
// Nota: El backend usa Integer.parseInt que elimina ceros iniciales,
// pero aquí validamos el formato y longitud, dejando la validación del DV al backend
export const validateRUN = (run: string): boolean => {
  if (!run || run.trim() === '') return false;
  
  try {
    // Limpiar el RUN: quitar puntos, guiones y convertir a mayúsculas
    let cleanRun = run.toUpperCase().replace(/\./g, '').replace(/-/g, '').replace(/\s/g, '');
    
    // Validar longitud (debe tener entre 7 y 9 caracteres: 6-8 dígitos + 1 dígito verificador)
    // Ejemplos: 123456-7 (7 chars), 12345678-5 (9 chars)
    if (cleanRun.length < 7 || cleanRun.length > 9) {
      return false;
    }
    
    // Separar el número del dígito verificador
    const rutNumber = cleanRun.substring(0, cleanRun.length - 1);
    const providedDv = cleanRun.charAt(cleanRun.length - 1);
    
    // Validar que el dígito verificador sea válido (0-9 o K)
    if (!/^[0-9K]$/.test(providedDv)) {
      return false;
    }
    
    // Validar que todos los caracteres del número sean dígitos
    if (!/^\d+$/.test(rutNumber)) {
      return false;
    }
    
    // Validar que el número no sea solo ceros
    const rutAux = parseInt(rutNumber, 10);
    if (isNaN(rutAux) || rutAux <= 0) {
      return false;
    }
    
    // Usar el mismo algoritmo que el backend (RutValidator.java)
    // Algoritmo: s = (s + rutAux % 10 * (9 - m++ % 6)) % 11
    // Nota: parseInt elimina ceros iniciales, igual que Integer.parseInt en Java
    let m = 0;
    let s = 1;
    let temp = rutAux;
    
    while (temp !== 0) {
      s = (s + (temp % 10) * (9 - (m++ % 6))) % 11;
      temp = Math.floor(temp / 10);
    }
    
    // Calcular el dígito verificador esperado
    // s != 0 ? s + 47 : 75 (47 es '0' en ASCII, 75 es 'K')
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
  return code.length >= 3 && code.length <= 20;
};

// Validar longitud de texto
export const validateTextLength = (text: string, min: number, max: number): boolean => {
  return text.trim().length >= min && text.trim().length <= max;
};

// Validar solo letras y espacios (para nombres)
export const validateOnlyLetters = (text: string): boolean => {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(text);
};

// Validar solo números
export const validateOnlyNumbers = (text: string): boolean => {
  return /^\d+$/.test(text);
};

// Formatear precio chileno
export const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null || isNaN(price)) {
    return '$0';
  }
  if (price === 0) return 'FREE';
  return `$${price.toLocaleString('es-CL')}`;
};

// Formatear RUN chileno mientras se escribe
export const formatRUN = (run: string): string => {
  // Limpiar el RUN: quitar puntos, guiones y espacios
  const cleanRun = run.replace(/\./g, '').replace(/-/g, '').replace(/\s/g, '').toUpperCase();
  
  // Si está vacío o muy corto, retornar tal cual
  if (cleanRun.length === 0) return '';
  if (cleanRun.length < 2) return cleanRun;
  
  // Separar el cuerpo del dígito verificador
  // El último carácter puede ser un dígito o K
  const lastChar = cleanRun.slice(-1);
  const isVerifier = /[0-9K]/.test(lastChar);
  
  let body: string;
  let verifier: string;
  
  if (isVerifier && cleanRun.length > 1) {
    // Si el último carácter es un dígito o K, asumimos que es el verificador
    body = cleanRun.slice(0, -1);
    verifier = lastChar;
  } else {
    // Si no, todo es cuerpo
    body = cleanRun;
    verifier = '';
  }
  
  // Formatear el cuerpo con puntos cada 3 dígitos
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Retornar con guión solo si hay verificador
  return verifier ? `${formattedBody}-${verifier}` : formattedBody;
};
