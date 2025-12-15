#!/bin/bash
echo "Remove the icon (/usr/share/icons/HDSentinel_GUI.ico)"
sudo rm /usr/share/icons/HDSentinel_GUI.ico
echo "Remove the desktop application (/usr/bin/HDSentinel_GUI)"
sudo rm /usr/share/bin/HDSentinel_GUI
echo "Remove the console application (/usr/bin/HDSentinel)"
sudo rm /usr/share/bin/HDSentinel
echo "Remove the 'report.xml' file if present (usr/share/bin/report.xml)" 
sudo rm /usr/share/bin/report.xml
echo "Remove the 'report.html' file if present (usr/share/bin/report.html)"
sudo rm /usr/share/bin/report.html
echo "Remove the 'report.xml.bak' file if present (usr/share/bin/report.xml.bak)"
sudo rm /usr/share/bin/report.xml.bak
echo "Delete directory (/usr/share/bin)"
sudo rm -d /usr/share/bin
echo "Delete the launcher from menu"
sudo rm ~/.local/share/applications/Hard_Disk_Sentinel_GUI.desktop
echo "Delete the launcher from 'Asztal' if present"
sudo rm ~/Asztal/Hard_Disk_Sentinel_GUI.desktop
echo "Delete the launcher from 'Desktop' if present"
sudo rm ~/Desktop/Hard_Disk_Sentinel_GUI.desktop
