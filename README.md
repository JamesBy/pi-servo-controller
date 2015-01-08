pi-servo-controller
============

## Synopsis

A way to control the <a href="http://4tronix.co.uk/blog/?p=50" target=blank>4tronix Initio</a> servos.

It works by starting a node server on the pi, then it serves a web page which contains a very simple touch pad which interacts with the pi gpio pins via node.js and socket.io. 

##IMPORTANT
**THIS PROJECT IS SET UP TO MANIPULATE GPIO PINS 18 and 22 Please change these numbers in the file start.js if needed**


## Dependancies
Im running <a href="http://www.raspbian.org/" target=blank>raspian</a> on a raspberry Pi model B.

The project needs the following to run:

<a href="http://elinux.org/Node.js_on_RPi" target=blank>node.js and npm</a>

<a href="https://github.com/richardghirst/PiBits/tree/master/ServoBlaster" target=blank>ServoBlaster</a>
<a href="http://www.raspberrypi.org/forums/viewtopic.php?p=412353#p412353" target = blank> -> Install hints</a>

The served webpage loads jQuery from the <a href="https://developers.google.com/speed/libraries/devguide#jquery" target=blank>Google Hosted Library</a> - no action needed

## Installation

Make a folder on your pi and put these files into it.
If you have git you can clone it:

    $ git clone https://github.com/JamesBy/pi-motor-controls.git .

Install the following node-modules into the project folder, probably take five minutes or so:

<a href="https://www.npmjs.com/package/pi-gpio" target=blank>**Pi-gpio**</a>

    $ npm install pi-gpio


<a href="http://socket.io/docs/" target=blank>**socket io**</a>

    $ npm install socket.io

##Usage
To start the server run:

    $ sudo node start.js

you should see this:

    Static file server running at
    => http://YOUR IP ADDRESS:3150/
    CTRL + C to shutdown`

Once this happens you should be able to connect using a browser on the same network using the ip and port mentioned. It should work on a smart phone too!

##Notes
You can make it work over the internet using port forwarding.

The interface, and module is designed to be as simple as possible to make it easy to customise.
