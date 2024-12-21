#include <EEPROM.h>
#ifndef eeprom_h
#define eeprom_h

void eeprom_write(int address, int valueToWrite);
void eeprom_write(int address, uint8_t valueToWrite);
int eeprom_read_int(int address);
uint8_t eeprom_read(int address);

#endif