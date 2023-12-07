/* 
 * Project: Heart monitor 
 * Author: Spencer Kittredge
 * team: 
 * course: ECE 413 
 * For comprehensive documentation and examples, please visit:
 * https://docs.particle.io/firmware/best-practices/firmware-template/
 */



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 SYSTEM_MODE(AUTOMATIC);
SYSTEM_THREAD(ENABLED); //uncomment to use w/out wifi

#include <Wire.h>
#include "MAX30105.h"
#include "spo2_algorithm.h"     //courtsy of sparkfun
#include "heartRate.h"          //courtsy of sparkfun
//#include <Arduino.h> //does not like fails to compile with it included
#include <string>               //standard c library if you dont know this you dont deserve to look at my code
#include <stdint.h>

//Global variables
//spo2 fucntion variabls
uint32_t bufferLength ; 
int32_t spo2 ; //blood ox 
int8_t validO2; // indicator if spo2 value is valid
int32_t heartRate;    //heart rate value    
int8_t validHeartRate; //indicatir if heartRate is valid

uint32_t irBuffer[100];
uint32_t redBuffer[100];

String tdata = String(10);
String txData;

//time variables
float currentTime = 0;
float timeConstraintLow = 6;
float timeConstraintHigh = 22;
uint32_t previousRequest = 0; //time of previos measurement request
uint32_t delayTime = 60000; //ms delay between readings ( default 1800000ms or 30min) 

// from salehi's code
long lastBeat = 0; //Time at which the last beat occurred
float beatsPerMinute;
MAX30105 particleSensor;

//other global variables
String myID;
char event_data[3];   //new parameters

//storage structure
struct storage{
  String buffer[24];
  uint32_t time_stored[24];
  uint8_t amountStored = 0;
}storage;


uint8_t state = 0;

LEDStatus blinkLED(RGB_COLOR_BLUE, LED_PATTERN_BLINK, LED_SPEED_FAST, LED_PRIORITY_IMPORTANT);
//webhook Event handlers
void handle(const char *event, const char *data){

}

void read(const char *event, const char *data){//recive data handler
  Serial.println(data);

  //if we got stuff
  if(data){
    
    uint8_t i = 0;
    uint8_t data_p = 0;
    uint8_t start = 0;
    uint8_t end = 0;

  //gota iterate though cuz c stores as an array of characters
    while( *(data + i) !='\0' ){
      //we look for :
      if(*(data + i) == ':'){
        start = i;
      }
      // a , represents the end
      else if(*(data + i) == ','){
        end = i;

        if(data_p == 0){//sample rate portion of data
          return_string(start, end, data, event_data);
          delayTime = (int)(atof(event_data) * 60.0 * 1000);

         Serial.println("delay time updated via webhook to :");
          Serial.println(delayTime);
        }
        if(data_p == 1){//lower bound of time widow
          return_string(start, end, data, event_data);
          timeConstraintLow = atof(event_data);

          Serial.println("updated start range to : ");
          Serial.println(timeConstraintLow);

        }
        data_p = data_p +1;
      }
      else if(*(data + i) == '}'){//end of relevent dat so upper bound time window
          return_string(start, end, data, event_data);
          timeConstraintHigh = atof(event_data);

          Serial.println("updated end range to : ");
          Serial.println(timeConstraintHigh);


      }

      i++;
    }


  }

}
int led = D7;  // The on-board LED

//function to extract string from webhook data
void return_string(uint8_t start, uint8_t end, const char* input, char output[]){
  uint8_t index = start +1;
  while(index < end){
    output[index - (start +1)] = input[index];
    index++;
  }
  output[index - (start +1)] = '\0';

}
//********************************************************************************************************************************************************************
//SETUP
//********************************************************************************************************************************************************************

void setup()
{
    Serial.begin(9600);
    Serial.println("Initializing...");

    //subscriptions to Particle Webhooks
    Particle.subscribe("hook-response/temp", handle, MY_DEVICES);
    Particle.subscribe("hook-response/read", read,MY_DEVICES);

    // Initialize sensor
    if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) //Use default I2C port, 400kHz speed
    {
        Serial.println("MAX30105 was not found. Please check wiring/power. ");
        while (1);
    }
    // Serial.println("Place your index finger on the sensor with steady pressure.");

      //LED stuff
  blinkLED.setColor(RGB_COLOR_GREEN);
  blinkLED.setSpeed(LED_SPEED_SLOW);
  blinkLED.setPattern(LED_PATTERN_FADE);
  if(!blinkLED.isActive()){blinkLED.setActive(true);}
  blinkLED.on();

  //get device ID
  myID = System.deviceID();
  Serial.println(myID);
    particleSensor.setup(); //Configure sensor with default settings

}

//State 0 : idle
//state 1 : request measurement
//state 2 : get measurement
//state 3 : send data

//**************************************************************************************************************************************************************************
// THE LOOP
//**************************************************************************************************************************************************************************

void loop() {
    
    //Serial.println(myID);
    digitalWrite(led, HIGH);   // Turn ON the LED


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Synchronous state machine below

  //state 0
  if(state == 0){//idle state
    Serial.println("Curent state = " + String(state));

    // current time
    currentTime = float (Time.hour()) + float(Time.minute()) /60.00;
    Serial.println("CurrentTime = " + String(currentTime));
    if(currentTime < 0 ){
      currentTime += 24.0;
    }  

    //check acceptible time frame
    if(currentTime > timeConstraintLow && currentTime < timeConstraintHigh){

      //if enough time has passed between measurements
      if(millis() - previousRequest >= delayTime){

        //move to state 1
        state = 1;
        previousRequest = millis();
        Serial.println("Moving to state 1");
      }else{
        Serial.println("Idle, not enough time has passed from previous request");
      }
    }
    else{
      Serial.println("it is not within acceptible time frame");
    }

    delay(2000);
    

  }

  if(state == 1){// request mesurement
    Serial.println("Curent state = " + String(state));

    Serial.println("Requesting Measurement Place your index finger on the sensor with steady pressure.");

    //LED CHANGE
    blinkLED.setColor(RGB_COLOR_BLUE);
    blinkLED.setPattern(LED_PATTERN_BLINK);
    blinkLED.setSpeed(LED_SPEED_FAST);
    if(blinkLED.isActive())blinkLED.setActive(true);
    blinkLED.on();

    //detect finger

    
    //move to state 2
    state = 2;
    Serial.println("Moving to state 2");

  }

  if (state == 2){// get measurement
    Serial.println("Curent state = " + String(state));
    
    bufferLength = 100;
    //loop to gather 100 samples
    for(byte i = 0; i < bufferLength; ++i){
      while (particleSensor.available() == false)//check if sensor avalibe
      particleSensor.check();

      redBuffer[i] = particleSensor.getRed();
      irBuffer[i] = particleSensor.getIR();
      particleSensor.nextSample();
      Serial.println(i);
    }

    maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validO2, &heartRate,  &validHeartRate);

    //check if measurements are valid
    //if(validO2 == 1 && validHeartRate ==1){
      if( (80 < spo2) && (spo2 <= 100) && (40 < heartRate) && (heartRate <= 250)){// bounds of blood oxegenation and heart rate to help filter bad data
        Serial.println("Moving to state 3");
        state = 3;
      }

    //}
    //check if 5min or 300000ms have passed and has not transitioned yet 
    else if(millis() - previousRequest > 60000){// check if 5min have passed since request for measurement
      //reset LED and go back to idle
      blinkLED.setColor(RGB_COLOR_GREEN);
      blinkLED.setSpeed(LED_SPEED_SLOW);
      blinkLED.setPattern(LED_PATTERN_FADE);

      state = 0;

    }else{//invalid measurement & time out has not occured
      Serial.println("Invalid measurement");
      Serial.println("Moving to state 1");
      state = 1; // get new measurement 
    }

  }

  if( state == 3){// send data via webhook
    Serial.println("Curent state = " + String(state));

    txData = "{ \"heartRate\": " + String(heartRate) + ", \"spO2\": " + String(spo2) + ", \"time\": " + String(Time.format(Time.now(), TIME_FORMAT_ISO8601_FULL)) + ", \"deviceID\" :" + myID +"}";
    bool sucsess = Particle.publish("temp",txData,PRIVATE);
    Serial.println(txData);

    //check if data sent
    if(sucsess){
      //go back to idle state
      state = 0;

      //reset LED 
      blinkLED.setColor(RGB_COLOR_GREEN);
      blinkLED.setSpeed(LED_SPEED_FAST);
      blinkLED.setPattern(LED_PATTERN_BLINK);
      delay(2000);

      blinkLED.setColor(RGB_COLOR_GREEN);
      blinkLED.setSpeed(LED_SPEED_SLOW);
      blinkLED.setPattern(LED_PATTERN_FADE);

      Serial.println("Data send Suceeded");

      //try to send any stored data
      uint8_t temp = storage.amountStored;
      for(uint8_t i = 0; i < temp; i++ ){

        //data less than 24hrs old
        if((millis() - storage.time_stored[i]) < 24 *60 *60 *1000){//24 hrs convert to ms

          sucsess = Particle.publish("temp",storage.buffer[i],PRIVATE);

          if(sucsess){
            Serial.println("Stored data sent");
            Serial.println(storage.buffer[i]);
          }
        }
        else{
          Serial.println("Data out of date, not sent");
        }

      }
      if(sucsess){
        //reset storage position 
        storage.amountStored = 0;
        Serial.println("All stored data snet");
      }


      


    }
    else{//failed to send data


      //store data for later
      Serial.println("No internet Data will be stored");
      storage.buffer[storage.amountStored] = txData;
      storage.time_stored[storage.amountStored] = millis();
      storage.amountStored ++;
      state = 0;

      //reset LED
      blinkLED.setColor(RGB_COLOR_YELLOW); // flashes yellow
      blinkLED.setSpeed(LED_SPEED_FAST);
      blinkLED.setPattern(LED_PATTERN_BLINK);
      delay(2000);

      blinkLED.setColor(RGB_COLOR_GREEN); // resets to stand by
      blinkLED.setSpeed(LED_SPEED_SLOW);
      blinkLED.setPattern(LED_PATTERN_FADE);
    }

  }
    
   
   
}



