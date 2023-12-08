import requests
import random
import time

url = 'http://localhost:3000/API/particle_data'
for i in range(20):
    myobj = {"event":"hr",
            "HR":"%s"%random.randint(0, 150),
            "SPO2":"%s"%random.randint(0, 150),
            "coreid":"e00fce680993c866c8f5c213"}
    x = requests.post(url, json = myobj)
    time.sleep(1)