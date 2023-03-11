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
HTTP: port 80 (require plugin installed on Internet Explore), default password of admin is 123456
RTSP URL: rtsp://192.168.1.197:554/mpeg4?username=admin&password=e10adc3949ba59abbe56e057f20f883e
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
## Trying to access the shell
##
The nmap scan result has port 23 running a telnet application. This is a good starting point for getting into the Linux system. However, even though the device accepted the incoming connection, I couldn't login successfully with trying common passwords: admin, root, hi3516, helpme, default, ...

I then scanned the board for the UART pin. Having 5 unused batteries looks very promising. Using a multimeter I can determine pins 3V3, GND and the two pins connected directly to pins 7 and 8 (in reverse order) of the SoC. I tried connecting the USB TTL in different ways but didn't see any TX data line. Is it possible that the UART was disabled by the manufacturer's software?!

Giving up on shell access I turned to flash memory extraction.
## Extracting firmware
Flash memory comes in the form of a SOP-8 but using a soldering iron I can also de-solder the chip. installed in the clamp of the CH341A programmer I read the flash memory with the command (linux):
```bash
sudo flashrom -p ch341a_spi -r fw.bin
```
flashrom can auto-detect type of flash chip and need about 2 minutes to read.

Now is time to unpack the firmware.
```
$ binwalk fw.bin

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
18016         0x4660          gzip compressed data, has original file name: "u-boot.bin", from Unix, last modified: 2019-06-06 09:11:36
262144        0x40000         uImage header, header size: 64 bytes, header CRC: 0xF4F3A81E, created: 2019-05-21 09:51:06, image size: 1550950 bytes, Data Address: 0x40008000, Entry Point: 0x40008000, data CRC: 0xB3FE1EDE, OS: Linux, CPU: ARM, image type: OS Kernel Image, compression type: none, image name: "Linux-4.9.37"
262208        0x40040         Linux kernel ARM boot executable zImage (little-endian)
287580        0x4635C         xz compressed data
287948        0x464CC         xz compressed data
1799968       0x1B7720        Flattened device tree, size: 13190 bytes, version: 17
1835008       0x1C0000        JFFS2 filesystem, little endian
2621440       0x280000        Squashfs filesystem, little endian, version 4.0, compression:xz, size: 5447342 bytes, 690 inodes, blocksize: 262144 bytes, created: 2019-10-24 12:38:34
8323072       0x7F0000        JFFS2 filesystem, little endian
```
As you can see, first 256K is U-boot partition. Unsing "strings" to read u-boot, I can get U-boot environment varables:
```
 bootcmd=sf probe 0;sf read 0x42000000 0x40000 0x180000;bootm 0x42000000
bootdelay=2
baudrate=115200
arch=arm
cpu=armv7
board=hi3516ev200
board_name=hi3516ev200
vendor=hisilicon
soc=hi3516ev200
phy_link_time=100
tftptimeoutcountmax=5
tftptimeout=2000
bootargs=mem=36M console=ttyAMA0,115200 root=/dev/mtdblock3 noinitrd rootfstype=squashfs m>ipcsn=07d2fc945ec726b4
ipcversion=TH38D16-1.0.0.16-20191024 203817
Linux-4.9.37
```
And then we have a overview of partitions:
```
MTD table:
0 256K     boot
1 1536K    kernel
2 768K     userdata
3 5504K    rootfs
4 64K      userdata_bk
5 64K      log
```
We 're going to focus to rootfs partition. Using dd to extract it from firmware:
```bash
dd if=fw.bin of=rootfs.bin bs=1k skip=2998 count=5504
```
'bootargs' above shows file system of rootfs partition is squashfs. Just unquash it!
```bash
unsquashfs -d root rootfs.bin
```
Content of rootfs was de-compressed into 'root' directory:
```bash
$ ls root
bin   dev  home  lib      lost+found  nfsroot  ppp   root  share  tmp  var
boot  etc  init  linuxrc  mnt         opt      proc  sbin  sys    usr
```
Reading scripts to understand what linux do everytime it boot:
```
$ cd root
$ ls etc/init.d
rcS  S00devs  S01udev  S80network
$ cat rcS
#! /bin/sh

/bin/mount -a

echo "
            _ _ _ _ _ _ _ _ _ _ _ _
            \  _  _   _  _ _ ___
            / /__/ \ |_/
           / __   /  -  _ ___
          / /  / /  / /
  _ _ _ _/ /  /  \_/  \_ ______
___________\___\__________________
"
for initscript in /etc/init.d/S[0-9][0-9]*
do
        if [ -x $initscript ] ;
        then
                echo "[RCS]: $initscript"
                $initscript
        fi
done

echo 128 > /proc/sys/vm/min_free_kbytes
echo 1 > /proc/sys/vm/overcommit_memory
echo 1 > /proc/sys/vm/panic_on_oom
echo 3 > /proc/sys/kernel/panic
echo 4096 > /proc/sys/kernel/msgmax
echo 32768 > /proc/sys/kernel/msgmnb
echo 64 > /proc/sys/kernel/msgmni

ifconfig lo 127.0.0.1
ifconfig eth0 mtu 1470
mkdir -p /tmp/ppp/peers

telnetd &
memsize=36
totalsize=64
/bin/mem_fix $memsize $totalsize
cd /opt/topsee/ko
./load3516ev200 -i -sensor0 sc3235 -osmem $memsize -total $totalsize
insmod hi3516ev200_wdt.ko "default_margin=30" "nodeamon=1"
sleep 1

/opt/topsee/sys_daemon &
```


