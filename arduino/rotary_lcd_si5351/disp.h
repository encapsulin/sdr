#include <Wire.h>
#include <LiquidCrystal_I2C.h>

void disp_setup() ;
void disp_print(String str, int col = 0, int row = 0);
void disp_print(int i,  int col = 0, int row = 0) ;
void disp_print(char c, int col = 0, int row = 0);
