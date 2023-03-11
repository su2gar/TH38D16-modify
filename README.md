## Start point
I happened to buy 6 to 7 modules from old ip cameras from a local website. They have the code TH38D16 manufactured by Topsee.
## Purpose
Their Onvif protocol is compatible with most platforms like Dahua and Chinese NVR brands but except the ones I need: Home Assistant and my Hikivision XVR.

Also, after connecting the module in the ONVIF Device Manager app I can't get a URL snapshot that can be used in the Home Assistant.

So I would try to find a way to improve compatibility in one of two ways:
- Find a way to modify the Onvif profile in the original firmware.
- Install another firmware with better Onvif compatibility.
## Overview
### Hardware
SoC: HI3516EV200 (HI3516 ERNCV200)

Flash: 8MB SPI

Sensor: SC3235
### Specs
Support sub stream and main stream.

Max resolution: 2304*1296-20fps.

Protocols: Onvif, P2P, NTP, HTTP, ...
### Aplication
HTTP on port 80 (require plugin installed on Internet Explore)

Scanning with Nmap:
```bash
$ nmap 192.168.1.197 -p1-65535
Starting Nmap 7.80 ( https://nmap.org ) at 2023-03-10 18:56 +07
Nmap scan report for 192.168.1.197
Host is up (0.0012s latency).
Not shown: 65529 closed ports
PORT     STATE SERVICE
23/tcp   open  telnet
80/tcp   open  http
554/tcp  open  rtsp
555/tcp  open  dsf
3000/tcp open  ppp
8091/tcp open  jamlink
Nmap done: 1 IP address (1 host up) scanned in 7.03 seconds
```


