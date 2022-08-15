import { Instruction, InstructionSet } from './types';

type Register = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'h' | 'l';

const i8 = (n: number) => n & 0xff;
const i4 = (n: number) => n & 0xf;

const add8 = (source: Register | 'd8' | 'hli'): Instruction => ({
  doc: `ADD a,${source}`,
  run(dmg) {
    const addNum = i8(
      source === 'hli'
        ? dmg.memory[dmg.registers.hl]
        : source === 'd8'
        ? dmg.readPc()
        : dmg.registers[source]
    );

    const result = i8(dmg.registers.a) + i8(addNum);
    dmg.registers.carry = (dmg.registers.a & 0x100) > 0;
    dmg.registers.half = ((i4(dmg.registers.a) + i4(addNum)) & 0x10) > 0;
    dmg.registers.zero = i8(dmg.registers.a) === 0;
    dmg.registers.a = i8(result);
  },
});

const ld8 = (
  source: Register | 'hli' | 'd8',
  target: Register | 'hli'
): Instruction => ({
  doc: `LD ${source},${target}`,
  run(dmg) {
    const value =
      source === 'd8'
        ? dmg.readPc()
        : source === 'hli'
        ? dmg.memory[dmg.registers.hl]
        : dmg.registers[source];

    if (target === 'hli') {
      dmg.memory[dmg.registers.hl] = value;
    } else {
      dmg.registers[target] = value;
    }
  },
});

const DmgPrefixedInstructionSet: InstructionSet = {};

const DmgMainInstructionSet: InstructionSet = {
  0x00: { doc: 'NOP', run: () => 0 },

  0x40: ld8('b', 'b'),
  0x41: ld8('b', 'c'),
  0x42: ld8('b', 'd'),
  0x43: ld8('b', 'e'),
  0x44: ld8('b', 'h'),
  0x45: ld8('b', 'l'),
  0x46: ld8('b', 'hli'),
  0x47: ld8('b', 'a'),
  0x48: ld8('c', 'b'),
  0x49: ld8('c', 'c'),
  0x4a: ld8('c', 'd'),
  0x4b: ld8('c', 'e'),
  0x4c: ld8('c', 'h'),
  0x4d: ld8('c', 'l'),
  0x4e: ld8('c', 'hli'),
  0x4f: ld8('c', 'a'),

  0x50: ld8('d', 'b'),
  0x51: ld8('d', 'c'),
  0x52: ld8('d', 'd'),
  0x53: ld8('d', 'e'),
  0x54: ld8('d', 'h'),
  0x55: ld8('d', 'l'),
  0x56: ld8('d', 'hli'),
  0x57: ld8('d', 'a'),
  0x58: ld8('e', 'b'),
  0x59: ld8('e', 'c'),
  0x5a: ld8('e', 'd'),
  0x5b: ld8('e', 'e'),
  0x5c: ld8('e', 'h'),
  0x5d: ld8('e', 'l'),
  0x5e: ld8('e', 'hli'),
  0x5f: ld8('e', 'a'),

  0x60: ld8('h', 'b'),
  0x61: ld8('h', 'c'),
  0x62: ld8('h', 'd'),
  0x63: ld8('h', 'e'),
  0x64: ld8('h', 'h'),
  0x65: ld8('h', 'l'),
  0x66: ld8('h', 'hli'),
  0x67: ld8('h', 'a'),
  0x68: ld8('l', 'b'),
  0x69: ld8('l', 'c'),
  0x6a: ld8('l', 'd'),
  0x6b: ld8('l', 'e'),
  0x6c: ld8('l', 'h'),
  0x6d: ld8('l', 'l'),
  0x6e: ld8('l', 'hli'),
  0x6f: ld8('l', 'a'),

  0x70: ld8('hli', 'b'),
  0x71: ld8('hli', 'c'),
  0x72: ld8('hli', 'd'),
  0x73: ld8('hli', 'e'),
  0x74: ld8('hli', 'h'),
  0x75: ld8('hli', 'l'),
  // TODO: HALT
  0x77: ld8('hli', 'a'),
  0x78: ld8('a', 'b'),
  0x79: ld8('a', 'c'),
  0x7a: ld8('a', 'd'),
  0x7b: ld8('a', 'e'),
  0x7c: ld8('a', 'h'),
  0x7d: ld8('a', 'l'),
  0x7e: ld8('a', 'hli'),
  0x7f: ld8('a', 'a'),

  0x80: add8('b'),
  0x81: add8('c'),
  0x82: add8('d'),
  0x83: add8('e'),
  0x84: add8('h'),
  0x85: add8('l'),
  0x86: add8('hli'),
  0x87: add8('a'),
  0xc6: add8('d8'),
  0xcb: {
    doc: `PREFIX CB`,
    run(dmg) {
      const opcode = dmg.readPc();
      const instr = DmgPrefixedInstructionSet[opcode];
      instr?.run(dmg);
      console.log(instr?.doc);
    },
  },
};

export default DmgMainInstructionSet;
