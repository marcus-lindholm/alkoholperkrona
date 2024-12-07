#!/bin/bash
chromium-browser &  # Launch Chromium in the background
sleep 5             # Wait for 5 seconds to allow the browser to fully launch

chromium-browser http://localhost:3000/api/scrapeProducts &

# Wait for  6 hours (6 hours * 60 min/hour * 60 sec/min = 21600 seconds)
sleep 21600

# Close the Chromium browser by killing its process
killall chromium
