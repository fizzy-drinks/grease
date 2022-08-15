const MAX_BYTE = 0b11111111;

enum Flags {
  ZERO = 0b1000_0000,
  SUB = 0b0100_0000,
  HALF_CARRY = 0b0010_0000,
  FULL_CARRY = 0b0001_0000,
}

const combineRegisters = (hi: number, lo: number): number => {
  return ((hi & MAX_BYTE) << 8) + (lo & MAX_BYTE);
};

const splitRegisters = (i16: number): [number, number] => {
  return [i16 >> 8, i16 & MAX_BYTE];
};

const setFlag = (flag: number, value: boolean, flagByte: number): number =>
  value ? flagByte | flag : flagByte & ~flag;

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
    return this.f & Flags.ZERO ? true : false;
  }

  set zero(value) {
    this.f = setFlag(Flags.ZERO, value, this.f);
  }

  get sub() {
    return this.f & Flags.SUB ? true : false;
  }

  set sub(value) {
    this.f = setFlag(Flags.SUB, value, this.f);
  }

  get half() {
    return this.f & Flags.HALF_CARRY ? true : false;
  }

  set half(value) {
    this.f = setFlag(Flags.HALF_CARRY, value, this.f);
  }

  get carry() {
    return this.f & Flags.FULL_CARRY ? true : false;
  }

  set carry(value) {
    this.f = setFlag(Flags.FULL_CARRY, value, this.f);
  }
}

export default RegisterSet;
