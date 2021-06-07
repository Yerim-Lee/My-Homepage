import pyautogui as pag 
import keyboard
from winsound import Beep

while True:
  if keyboard.is_pressed('F3'):
    Beep(524, 200)
    Beep(659, 200)
    Beep(784, 200)
    break

while True:
  if keyboard.is_pressed('F6'):
    Beep(784, 200)
    Beep(698, 200)
    while True:
      if keyboard.is_pressed('F3'):
        Beep(524, 200)
        Beep(659, 200)
        Beep(784, 200)
        break
  pag.click()
  if keyboard.is_pressed('F4'):
    Beep(784, 200)
    Beep(698, 200)
    Beep(659, 200)
    Beep(587, 200)
    Beep(524, 200)
    break
  