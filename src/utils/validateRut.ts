
export function validateRut(rut: string): boolean {
  const clean = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
  if (!/^[0-9]+[0-9K]$/.test(clean)) return false;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);

  let sum = 0, mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const rest = 11 - (sum % 11);
  const dvCalc = rest === 11 ? "0" : rest === 10 ? "K" : String(rest);
  return dvCalc === dv;
}
