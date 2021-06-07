from speech_recognition import *
from pyautogui import *
import clipboard
import keyboard
import pyaudio
import time

def read_voice():
  r = Recognizer()
  mic = Microphone()
  
  with mic as source:
    audio = r.listen(source)

  voice_data = r.recognize_google(audio, language = 'ko')
  return voice_data

def typing(value):
  clipboard.copy(value)
  hotkey('ctrl','v')

while True:
  if keyboard.is_pressed('ctrl+alt'):
    voice = read_voice()
    time.sleep(0.1)
    typing(voice)

voice_data = r.recogniae_google(audio, language ='ko')
print(voice_data)


