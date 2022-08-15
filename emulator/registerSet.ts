const MAX_BYTE = 0b11111111;

const combineRegisters = (hi: number, lo: number): number => {
  return ((hi & MAX_BYTE) << 8) + (lo & MAX_BYTE);
};

const splitRegisters = (i16: number): [number, number] => {
  return [i16 >> 8, i16 & MAX_BYTE];
};

class RegisterSet {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  h: number;
  l: number;

  get af() {
    return combineRegisters(this.a, this.f);
  }

  set af(af: number) {
    const [a, f] = splitRegisters(af);
    this.a = a;
    this.f = f;
  }

  get bc() {
    return combineRegisters(this.b, this.c);
  }

  set bc(bc: number) {
    const [b, c] = splitRegisters(bc);
    this.b = b;
    this.c = c;
  }

  get de() {
    return combineRegisters(this.d, this.e);
  }

  set de(de: number) {
    const [d, e] = splitRegisters(de);
    this.d = d;
    this.e = e;
  }

  get hl() {
    return combineRegisters(this.h, this.l);
  }

  set hl(hl: number) {
    const [h, l] = splitRegisters(hl);
    this.h = h;
    this.l = l;
  }

  get zero() {
    return this.f & 0b1000_0000 ? true : false;
  }

  get subtraction() {
    return this.f & 0b0100_0000 ? true : false;
  }

  get halfCarry() {
    return this.f & 0b0010_0000 ? true : false;
  }

  get carry() {
    return this.f & 0b0001_0000 ? true : false;
  }
}

export default RegisterSet;
