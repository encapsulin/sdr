#include "disp.h"

LiquidCrystal_I2C lcd(0x27, 20, 4);  // set the LCD address to 0x27 for a 16 chars and 2 line display

void disp_setup() {
  lcd.init();  // initialize the lcd
  lcd.init();
  // Print a message to the LCD.
  lcd.backlight();
  lcd.setCursor(5, 0);
  lcd.print("Hello");
  // lcd.setCursor(0, 1);
  // lcd.print("Ywrobot Arduino!");
}

void disp_print(String str, int col = 0, int row = 0) {
  lcd.setCursor(col, row);
  lcd.print(str);
}

void disp_print(int i, int col = 0, int row = 0) {
  disp_print(String(i), col, row);
}

void disp_print(char c, int col = 0, int row = 0) {
    lcd.setCursor(col, row);
    lcd.print(c);
}