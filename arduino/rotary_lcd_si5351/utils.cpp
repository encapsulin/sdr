#include "utils.h"

String formatInt(int a) {

  String str = "";
  
  if (a < 10) {
    str = "00";  
  } else if (a < 100) {
    str = "0";   
  }
  
  str += String(a);
  
  return str;
}