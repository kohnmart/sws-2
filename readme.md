## Inbetriebnahme

### Hinweis

Lösung im ./dist Verzeichnis

### Erklärung zur ColorPicker/ColorMenu Funktionsweise

ColorMenu:

Das ColorMenu besteht aus fünf Funktionen ("Entfernen", "Hintergrund-Palette", "Outline-Palette", "Shape nach vorne" und "Shape nach hinten"). Zu Beginn wird für die beiden Paletten die jeweilige Default-Farbe gesetzt. Aktuell (transparent/black). Jeder neu-angelegte Shape wird mit diesen Farben initialisert. Diese default-Farben sind fix und sollen aktuell nicht dynamisch geändert werden können.

Shape-Selektion und ColorPicker:

Durch das klicken auf einen Shape und anschließendes öffnen des Menus, werden die Farben auf die entsprechenden
Color-Picker gesetzt. Sind mehrere Shapes ausgewählt, so wird überprüft ob deren Hintergrund/Outline Farben übereinstimmen. Ist dies nicht der Fall bzw. es gibt Differenz, wird für die jeweilige Palette die ColorPicker-Checker ausgesetzt. Bei Menu-Öffnung ohne ausgewählten Shape wird die default oder letzte gesetzt Farb-Konfiguration angezeigt.

## Production

### Install required node_modules

``` npm install ```

### Install live-server (globally)

``` npm install -g live-server ```

### Start Live-Server

``` npm start ```
