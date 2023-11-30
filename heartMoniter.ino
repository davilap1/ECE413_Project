/* 
 * Project myProject
 * Author: Your Name
 * Date: 
 * For comprehensive documentation and examples, please visit:
 * https://docs.particle.io/firmware/best-practices/firmware-template/
 */

// Include Particle Device OS APIs
#include "Particle.h"
#include "MAX30105.h"
#include "spo2_algorithm.h"


// // Let Device OS manage the connection to the Particle Cloud
// SYSTEM_MODE(AUTOMATIC);

// // Run the application and system concurrently in separate threads
// SYSTEM_THREAD(ENABLED);

// // Show system, cloud connectivity, and application logs over USB
// // View logs with CLI using 'particle serial monitor --follow'
// SerialLogHandler logHandler(LOG_LEVEL_INFO);

// // setup() runs once, when the device is first turned on
// void setup() {
//   // Put initialization like pinMode and begin functions here
// }

// // loop() runs over and over again, as quickly as it can execute.
// void loop() {
//   // The core of your code will likely live here.

//   // Example: Publish event to cloud every 10 seconds. Uncomment the next 3 lines to try it!
//   // Log.info("Sending Hello World to the cloud!");
//   // Particle.publish("Hello world!");
//   // delay( 10 * 1000 ); // milliseconds and blocking - see docs for more info!
// }


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SYSTEM_MODE(AUTOMATIC);
SYSTEM_THREAD(ENABLED); //uncomment to use w/out wifi

#include <Wire.h>
#include "MAX30105.h"
long lastBeat = 0; //Time at which the last beat occurred
float beatsPerMinute;
MAX30105 particleSensor;

void handle(const char *event, const char *data){

}
int led = D7;  // The on-board LED

void setup()
{
    Serial.begin(9600);
    Serial.println("Initializing...");

    //subscriptions to Particle Webhooks
    Particle.subscribe("hook-response/temp", handle, MY_DEVICES);

    // Initialize sensor
    if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) //Use default I2C port, 400kHz speed
    {
        Serial.println("MAX30105 was not found. Please check wiring/power. ");
        while (1);
    }
    // Serial.println("Place your index finger on the sensor with steady pressure.");

    particleSensor.setup(); //Configure sensor with default settings

}


void loop() {
    
    digitalWrite(led, HIGH);   // Turn ON the LED
  
    long irValue = particleSensor.getIR();
    delay(2000);
    
   // if(irValue > 10000){
        // long delta = millis() - lastBeat;
        // lastBeat = millis();
        // beatsPerMinute = 60 / (delta / 1000.0);        
        beatsPerMinute = irValue/1831.0;
        Particle.publish("temp", String(beatsPerMinute), PRIVATE);
   // }
   
}



