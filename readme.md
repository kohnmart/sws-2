## Umsetzung des dritten Teils für Softwaresysteme 2

### Hinweis

Features welche zusätzlich implementiert wurden aber nicht ausdrücklich im Aufgabentext gefordert wurden:

#### Backend

- Datenmanagement mit SQLite

- Middleware (Host- und Canvas-Abfragen)

- Rest API

#### Frontend

Overview:

- Der Host kann bei der Canvas-Erstellung einen individuellen Namen vergeben (sowie Validierung auf leeres Input-Feld)

- Der Host kann sein Canvas jederzeit wieder entfernen. Dadurch werden die Clients, welche sich zu dem Zeitpunkt auf dem Canvas befinden disconnected und auf die Overview-Page redirected.

Canvas:

- Shapes werden durch das Selektieren blockiert und können währenddessen nicht von anderen Nutzern verwendet werden
    Dies gilt auch für die Multiselektion wie auch Alt-Klick-Iteration, dabei werden selektierte Shapesn übersprungen bzw. ignoriert.

- Auflösen der Shape-Selektion wenn ein User das Canvas verlässt oder das Browser-Fenster schließt.

## Production

### Install required node_modules

``` npm install ```

### Start server

``` npm run dev ```
