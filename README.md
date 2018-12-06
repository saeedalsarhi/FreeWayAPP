# FreeWayAPP

*** if countering any issues when importing the csv file open the csv file and resave it, this will resolve it. ***
* Import the csv files from current directory to your mongodb database using the following commands:
    - mongoimport --host=127.0.0.1 --db freeway --collection freeway_stations --type csv --file freeway_stations.csv --headerline
    - mongoimport --host=127.0.0.1 --db freeway --collection freeway_loopdata --type csv --file freeway_loopdata.csv --headerline
    - mongoimport --host=127.0.0.1 --db freeway --collection freeway_detectors --type csv --file freeway_detectors.csv --headerline
    - mongoimport --host=127.0.0.1 --db freeway --collection highways --type csv --file highways.csv --headerline

* run the server using the following command:
    -node server.js

* run the client side by using the following link:
    - http://localhost:3000
    
 Test Examples:
 
    Calculation Page
    -----------------
    Select a start date, end date, and the station in which the user wants to query the data for 
        Dates: September 15th, 2011 - November 15th, 2011
        (Start date and end date must be within the specified timeline)
        Output: Drive time in seconds and volume of cars within time period
    
    Update Page
    -----------
        Select a station and rename it whatever you like
        *Please refresh the page to see the station renamed
    
