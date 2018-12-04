# FreeWayAPP

* Import the csv files from current directory to your mongodb database using the following commands:
    - mongoimport --host=127.0.0.1 --db freeway --collection freeway_stations --type csv --file freeway_stations.csv --headerline
    - mongoimport --host=127.0.0.1 --db freeway --collection freeway_loopdata --type csv --file freeway_loopdata.csv --headerline
    - mongoimport --host=127.0.0.1 --db freeway --collection freeway_detectors --type csv --file freeway_detectors.csv --headerline
    - mongoimport --host=127.0.0.1 --db freeway --collection highways --type csv --file highways.csv --headerline

* run the server using the following command:
    -node server.js

* run the client side by using the following link:
    - http://localhost:3000