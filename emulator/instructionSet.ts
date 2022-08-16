import runInstruction from './runInstruction';
import { Instruction, InstructionSet } from './types';

type WritableRegister = 'a' | 'b' | 'c' | 'd' | 'e' | 'h' | 'l';

const i8 = (n: number) => n & 0xff;
const i4 = (n: number) => n & 0xf;

const add8 = (source: WritableRegister | 'd8' | 'hli'): Instruction => ({
  doc: `ADD a,${source}`,
  run(dmg) {
    const addNum = i8(
      source === 'hli'
        ? dmg.memory[dmg.registers.hl]
        : source === 'd8'
        ? dmg.readPc()[1]
        : dmg.registers[source]
    );

    const result = i8(dmg.registers.a) + i8(addNum);
    dmg.registers.carry = (dmg.registers.a & 0x100) > 0;
    dmg.registers.half = ((i4(dmg.registers.a) + i4(addNum)) & 0x10) > 0;
    dmg.registers.a = i8(result);
    dmg.registers.sub = false;
    dmg.registers.zero = i8(dmg.registers.a) === 0;
  },
});

const nthBit = (n: number, target: number) => target & (1 << (n - 1));

/**
 * Creates a SUB n (subtract n from A) instruction.
 */
const sub8 = (source: WritableRegister): Instruction => ({
  doc: `SUB ${source}`,
  run(dmg) {
    const result = i8(dmg.registers.a) - i8(dmg.registers[source]);
    dmg.registers.sub = true;
    dmg.registers.carry = nthBit(7, result) > nthBit(7, dmg.registers.a);
    dmg.registers.half = nthBit(4, result) > nthBit(4, dmg.registers.a);
    dmg.registers.zero = i8(dmg.registers.a) === 0;
    dmg.registers.a = i8(result);
  },
});

/**
 * Creates an 8-bit load instruction from a register or d8 to another.
 */
const load8IntoRegister = (
  target: WritableRegister,
  source: WritableRegister | 'd8'
): Instruction => ({
  doc: `LD ${target},${source}`,
  run(dmg) {
    const value = source === 'd8' ? dmg.readPc()[1] : dmg.registers[source];

    dmg.registers[target] = value;
  },
});

/**
 * Creates an 8-bit load instruction from memory into a register.
 */
const load8IntoRegisterFromMemory = (
  target: WritableRegister,
  source: 'bc' | 'de' | 'hl'
): Instruction => ({
  doc: `LD ${target},(${source})`,
  run(dmg) {
    const value = dmg.registers[source];

    dmg.registers[target] = value;
  },
});

/**
 * Creates an 8-bit load instruction from a register or d8 into memory.
 */
const load8IntoMemory = (
  targetAddress: 'bc' | 'de' | 'hl',
  source: WritableRegister | 'd8'
): Instruction => ({
  doc: `LD ${source},${targetAddress}`,
  run(dmg) {
    const value = source === 'd8' ? dmg.readPc()[1] : dmg.registers[source];

    dmg.memory[dmg.registers[targetAddress]] = value;
  },
});

const DmgPrefixedInstructionSet: InstructionSet = {
  __PREFIX: 'cb',
};

const DmgMainInstructionSet: InstructionSet = {
  0x00: { doc: 'NOP', run: () => 0 },

  0x02: load8IntoMemory('bc', 'a'),
  0x06: load8IntoRegister('b', 'd8'),
  0x0a: load8IntoRegisterFromMemory('a', 'bc'),

  0x12: load8IntoMemory('de', 'a'),
  0x16: load8IntoRegister('d', 'd8'),
  0x1a: load8IntoRegisterFromMemory('a', 'de'),

  0x26: load8IntoRegister('h', 'd8'),

  0x36: load8IntoMemory('hl', 'd8'),

  0x40: load8IntoRegister('b', 'b'),
  0x41: load8IntoRegister('b', 'c'),
  0x42: load8IntoRegister('b', 'd'),
  0x43: load8IntoRegister('b', 'e'),
  0x44: load8IntoRegister('b', 'h'),
  0x45: load8IntoRegister('b', 'l'),
  0x46: load8IntoRegisterFromMemory('b', 'hl'),
  0x47: load8IntoRegister('b', 'a'),
  0x48: load8IntoRegister('c', 'b'),
  0x49: load8IntoRegister('c', 'c'),
  0x4a: load8IntoRegister('c', 'd'),
  0x4b: load8IntoRegister('c', 'e'),
  0x4c: load8IntoRegister('c', 'h'),
  0x4d: load8IntoRegister('c', 'l'),
  0x4e: load8IntoRegisterFromMemory('c', 'hl'),
  0x4f: load8IntoRegister('c', 'a'),

  0x50: load8IntoRegister('d', 'b'),
  0x51: load8IntoRegister('d', 'c'),
  0x52: load8IntoRegister('d', 'd'),
  0x53: load8IntoRegister('d', 'e'),
  0x54: load8IntoRegister('d', 'h'),
  0x55: load8IntoRegister('d', 'l'),
  0x56: load8IntoRegisterFromMemory('d', 'hl'),
  0x57: load8IntoRegister('d', 'a'),
  0x58: load8IntoRegister('e', 'b'),
  0x59: load8IntoRegister('e', 'c'),
  0x5a: load8IntoRegister('e', 'd'),
  0x5b: load8IntoRegister('e', 'e'),
  0x5c: load8IntoRegister('e', 'h'),
  0x5d: load8IntoRegister('e', 'l'),
  0x5e: load8IntoRegisterFromMemory('e', 'hl'),
  0x5f: load8IntoRegister('e', 'a'),

  0x60: load8IntoRegister('h', 'b'),
  0x61: load8IntoRegister('h', 'c'),
  0x62: load8IntoRegister('h', 'd'),
  0x63: load8IntoRegister('h', 'e'),
  0x64: load8IntoRegister('h', 'h'),
  0x65: load8IntoRegister('h', 'l'),
  0x66: load8IntoRegisterFromMemory('h', 'hl'),
  0x67: load8IntoRegister('h', 'a'),
  0x68: load8IntoRegister('l', 'b'),
  0x69: load8IntoRegister('l', 'c'),
  0x6a: load8IntoRegister('l', 'd'),
  0x6b: load8IntoRegister('l', 'e'),
  0x6c: load8IntoRegister('l', 'h'),
  0x6d: load8IntoRegister('l', 'l'),
  0x6e: load8IntoRegisterFromMemory('l', 'hl'),
  0x6f: load8IntoRegister('l', 'a'),

  0x70: load8IntoMemory('hl', 'b'),
  0x71: load8IntoMemory('hl', 'c'),
  0x72: load8IntoMemory('hl', 'd'),
  0x73: load8IntoMemory('hl', 'e'),
  0x74: load8IntoMemory('hl', 'h'),
  0x75: load8IntoMemory('hl', 'l'),
  // TODO: HALT
  0x77: load8IntoMemory('hl', 'a'),
  0x78: load8IntoRegister('a', 'b'),
  0x79: load8IntoRegister('a', 'c'),
  0x7a: load8IntoRegister('a', 'd'),
  0x7b: load8IntoRegister('a', 'e'),
  0x7c: load8IntoRegister('a', 'h'),
  0x7d: load8IntoRegister('a', 'l'),
  0x7e: load8IntoRegisterFromMemory('a', 'hl'),
  0x7f: load8IntoRegister('a', 'a'),

  0x80: add8('b'),
  0x81: add8('c'),
  0x82: add8('d'),
  0x83: add8('e'),
  0x84: add8('h'),
  0x85: add8('l'),
  0x86: add8('hli'),
  0x87: add8('a'),

  0x90: sub8('b'),
  0x91: sub8('c'),
  0x92: sub8('d'),
  0x93: sub8('e'),
  0x94: sub8('h'),
  0x95: sub8('l'),

  0xc6: add8('d8'),
  0xcb: {
    doc: `PREFIX CB`,
    run(dmg) {
      const [addr, opcode] = dmg.readPc();
      runInstruction(dmg, addr, opcode, DmgPrefixedInstructionSet);
    },
  },
};

export default DmgMainInstructionSet;
