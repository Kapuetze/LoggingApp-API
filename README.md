### Logging API Installation

1.	Das Git Repository von https://source.ai.fh-erfurt.de/jo0756be/LoggingApp-API.git in ein beliebiges Verzeichnis klonen
2.	NodeJS von https://nodejs.org/en/download/ herunterladen und installieren
3.	`npm install` im Root Verzeichnis ausführen
4.	MongoDB von https://www.mongodb.com/download-center/community herunterladen
5.	Im `C:\Program Files\MongoDB\Server\{VERSION}\bin` die Datei `mongod.exe` starten.
6.	Im `C:\Program Files\MongoDB\Server\{VERSION}\bin` den Befehl `mongorestore.exe {PFAD ZU /mongodump IM GEKLONTEN REPO}` ausführen
7.	`npm start bin/www` ausführen, um API zu starten


### Testdaten

Test User: `places-admin@test.de` <br>
Test Passwort: `jonastest`

