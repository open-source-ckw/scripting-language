#!/bin/bash
clear
echo ""
echo "Unzip the HDSentinel_GUI archive to /home/your user name/HDSentinel_Light/"
echo ""
##Unzip the HDSentinel_GUI archive
unzip HDSentinel_GUI.zip -d ~/
echo ""
echo "Copy icon the icon folder"
echo ""
##Copy icon the icon folder
sudo cp ~/HDSentinel_GUI/HDSentinel_GUI.ico -t /usr/share/icons
echo "Set owner and permission for icon"
echo ""
##Set owner and permission for icon
sudo chmod 444 /usr/share/icons/HDSentinel_GUI.ico
echo "Make directory 'usr/share/bin' if not present"
echo ""
##make directory usr/share/bin if not present
sudo mkdir -p /usr/share/bin
echo "Premission for folder"
echo ""
##premission for folder
sudo chmod -R a+rwx /usr/share/bin
echo "Copy to bin library"
echo ""
##Copy the bin folder
sudo cp ~/HDSentinel_GUI/HDSentinel_GUI -t /usr/share/bin
sudo cp ~/HDSentinel_GUI/HDSentinel -t /usr/share/bin
echo "Set premission for application"
echo ""
##Set premission for application
sudo chmod a+rwx /usr/share/bin/HDSentinel_GUI
sudo chmod a+rwx /usr/share/bin/HDSentinel
echo "Make directory for user menu if not present"
echo ""
##Make directory for user menu if not present
sudo mkdir -p ~/.local/share/applications
echo "Copy launcher to user menu"
echo ""
##Copy launcher to user menu
sudo cp ~/HDSentinel_GUI/Hard_Disk_Sentinel_GUI.desktop -t ~/.local/share/applications
echo "Set premission for menu launcher"
echo ""
##set premission for menu launcher
sudo chmod a+rwx ~/.local/share/applications/Hard_Disk_Sentinel_GUI.desktop
echo "Copy launcher to Asztal if present"
echo ""
##copy launcher to desktop
##sudo cp ~/HDSentinel_GUI/Hard_Disk_Sentinel_GUI.desktop -t ~/Asztal
##echo "Copy launcher to Desktop if present"
echo ""
##copy launcher to desktop eng
##sudo cp ~/HDSentinel_GUI/Hard_Disk_Sentinel_GUI.desktop -t ~/Desktop
echo ""
##echo "Set premission for launcher (Desktop)"
echo ""
##Set premission for launcher
##sudo chmod a+rwx ~/Desktop/Hard_Disk_Sentinel_GUI.desktop
echo ""
##echo "Set premission for launcher (Asztal)"
echo ""
##set premission for launcher
##sudo chmod a+rwx ~/Asztal/Hard_Disk_Sentinel_GUI.desktop
echo "Remove install temp directory (/home/your user name/HDSentinel_GUI/)"
##Remove ~/HDSentinel_GUI directory
rm -d -rf ~/HDSentinel_GUI
