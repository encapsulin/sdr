#include "eeprom.h"

void eeprom_write(int address, int valueToWrite) {
  EEPROM.write(address, (valueToWrite >> 8) & 0xFF);  // Write high byte
  EEPROM.write(address + 1, valueToWrite & 0xFF);     // Write low byte
}

void eeprom_write(int address, uint8_t valueToWrite) {
  EEPROM.write(address, valueToWrite);  // Write high byte
}

int eeprom_read_int(int address) {
  int valueRead = (EEPROM.read(address) << 8) + EEPROM.read(address + 1);
  return valueRead;
}

uint8_t eeprom_read(int address) {
  uint8_t valueRead = EEPROM.read(address);
  return valueRead;
}