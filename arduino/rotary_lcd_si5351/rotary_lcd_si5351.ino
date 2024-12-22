#include "disp.h"
#include "utils.h"
#include "eeprom.h"
/////////////////
#define outputA 4
#define outputB 5
//#define interruptPin 2 // 2 or 3
const int pinK = 2;                     // Change to your interrupt pin (e.g., 2 or 3)
volatile bool pinStateChanged = false;  // Flag to indicate interrupt was triggered
#define inputFreq 12
/////////////////
int f_M = 1;
int f_K = 1;
int f_H = 1;
int f_pos = 0;
int f_step = 0;  // 0: select M/K/H; 1:change selected freq;

///////////////////
#include "si5351.h"
Si5351 si5351;
void synt_setup() {
  bool i2c_found = si5351.init(SI5351_CRYSTAL_LOAD_0PF, 0, 0);
  Serial.println("SI5351...");
  if (!i2c_found) {
    Serial.println("not found on I2C");
  } else {
    Serial.println("ok");
    synt_adjustF(f_M, f_K, f_H);
  }
}
void synt_adjustF(int fM, int fK, int fH) {

  uint64_t freq = 0ULL;
  if (fM > 0)
    freq += fM * 100000000ULL;
  if (fK > 0)
    freq += fK * 100000;
  if (fH > 0)
    freq += fH * 100;
  int32_t correction = 321000;  //27.11


  si5351.set_freq(freq, SI5351_CLK1);
  si5351.drive_strength(SI5351_CLK1, SI5351_DRIVE_8MA);
  si5351.set_correction(correction, SI5351_PLL_INPUT_XO);
  si5351.update_status();

  pinMode(LED_BUILTIN, OUTPUT);
}

void synt_enable(char enable) {
  si5351.output_enable(SI5351_CLK1, enable != '0');
}
//////////////////
void setup_rotary() {
  pinMode(outputA, INPUT);
  pinMode(outputB, INPUT);
  pinMode(pinK, INPUT);
  //aLastState = digitalRead(outputA);
  attachInterrupt(digitalPinToInterrupt(pinK), handleInterrupt, FALLING);  // Interrupt on pin going LOW (FALLING)
}

void handleInterrupt() {
  pinStateChanged = true;  // Set the flag when interrupt is triggered
}


void setup() {
  Serial.begin(9600);
  disp_setup();
  setup_rotary();

  f_M = eeprom_read_int(0);
  f_K = eeprom_read_int(2);
  f_H = eeprom_read_int(4);
  Serial.println("eeprom_read_int");
  Serial.println(f_M);
  Serial.println(f_K);
  Serial.println(f_H);

  print_freq();

  synt_setup();

  pinMode(inputFreq, INPUT_PULLUP);
}

////////////////
int counter = 0;
int aState = 0;
int aLastState = 1;

void rotary_loop() {

  //int synt_blink = 0;

  do {

    // if (pinStateChanged) {
    //   pinStateChanged = 0;
    //   while (digitalRead(pinK) == 0)
    //     delay(100);

    // }

    aState = digitalRead(outputA);
    if (aState != aLastState && digitalRead(outputB)) {
      if (digitalRead(outputB) != aState) {
        counter = 1;
      } else {
        counter = -1;
      }

      Serial.print(counter);
      if (f_step == 0) {
        f_pos += counter;
        if (f_pos > 10)
          f_pos = 0;
        if (f_pos < 0)
          f_pos = 10;

        //synt_blink = 1;
      }

      if (f_step == 1) {

        if (f_pos == 0 || f_pos == 4 || f_pos == 8)
          counter *= 100;
        if (f_pos == 1 || f_pos == 5 || f_pos == 9)
          counter *= 10;

        if (f_pos >= 0 && f_pos <= 2) {
          f_M += counter;
          if (f_M < 0) f_M = 0;
        } else if (f_pos >= 4 && f_pos <= 6) {
          f_K += counter;
          if (f_K < 0) {
            f_M--;
            f_K += 1000;
          }
          if (f_K >= 1000) {
            f_K -= 1000;
            f_M++;
          }
        } else if (f_pos >= 8 && f_pos <= 10) {
          f_H += counter;
          if (f_H < 0) f_H = 0;
          if (f_H > 300) f_H = 300;
        }
        if (f_M == 0 && f_K < 4)
          f_K = 4;

        print_freq();
        synt_adjustF(f_M, f_K, f_H);

        //synt_blink = 0;
      }
      print_freq_pos();
    }
    aLastState = aState;

    if (pinStateChanged) {
      pinStateChanged = 0;
      while (digitalRead(pinK) == 0)
        delay(100);

      if (++f_step > 1) {
        f_step = 0;
        //synt_blink = 0;
      }


      print_freq_pos();
      eeprom_write(0, f_M);
      eeprom_write(2, f_K);
      eeprom_write(4, f_H);
    }

    doProgress(f_step);

    readFromConsole();

  } while (1);
}

/////////////////
void print_freq() {
  String str = formatInt(f_M) + "." + formatInt(f_K) + "." + formatInt(f_H) + " Hz";
  disp_print(str);
}

void print_freq_pos() {
  disp_print("                ", 0, 1);
  char c = f_step == 0 ? '^' : '*';
  disp_print(c, f_pos, 1);
}

///////////////////////////
char bReadFromConsole = 1;
int iReadFromConsole = 0;
void readFromConsole() {
  if (Serial.available()) {
    String str = Serial.readString();
    iReadFromConsole = str.toInt();
  }
}

//////////////////
uint32_t i = 0;
char cFEnable = '1';
char cFCnt = 0;
void doProgress(int rotary_step) {
  if (i++ > 170000) {
    i = 0;
    if (cFCnt <= 3) cFEnable = '1';
    else if (cFCnt <= 5) cFEnable = '0';
    else cFCnt = 0;
    cFCnt++;

    if (bReadFromConsole == 1) {
      if (iReadFromConsole > 0) {
        Serial.println("iReadFromConsole");
        Serial.println(iReadFromConsole);
        cFEnable = '1';
        iReadFromConsole--;
      } else
        cFEnable = '0';
    }

    if (digitalRead(inputFreq) == 0)
      cFEnable = '1';

    if (rotary_step == 0) {
      synt_enable(cFEnable);
      Serial.println(cFEnable);
      digitalWrite(LED_BUILTIN, cFEnable == '1');
    }
  }
}

/////////////
void loop() {
  print_freq_pos();
  rotary_loop();
}
