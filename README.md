## Installieren

1. Dependencies installieren
   ```shell
   npm install
   ```
2. Umgebungsvariablen setzen

   ```
   PRODUCTION=<true|false>
   APPLICATION=<NAME>
   FCM_SERVER_KEY=<KEY>
   DAG_SERVER_KEY=<KEY>
   DB_HOST=<HOST>
   DB_USER=<USER>
   DB_PASSWORD=<PASSWORD>
   DB_DATABASE=<DATABASE>
   ```

3. Anwendung starten
   ```shell
   npm run
   ```

## Release

|  Typ  |                  Befehl                   |
| :---: | :---------------------------------------: |
| Patch | `npx standard-version --release-as patch` |
| Minor | `npx standard-version --release-as minor` |
| Major | `npx standard-version --release-as major` |
