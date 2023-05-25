# Sticky-Sessions

## I. Einführung

Sticky Sessions (auch als Session Persistence bezeichnet) sind eine Funktion, die häufig in Load Balancern zu finden ist und es einer Webanwendung ermöglicht, Benutzereinstellungen zu speichern, Benutzer authentifiziert zu halten usw. Bei Sticky Sessions kann der Load Balancer Anfragen eines bestimmten Clients identifizieren und diese immer an denselben Server weiterleiten. Bei Sticky Sessions werden alle Benutzerinformationen serverseitig gespeichert, und diese Methode wird häufig bei zustandsbehafteten Diensten verwendet.

Quelle: <https://traefik.io/glossary/what-are-sticky-sessions/>

### A. Bedeutung von Sticky-Sessions in Load Balancern

Sticky-Sessions haben in Load Balancern eine große Bedeutung, da sie es ermöglichen, dass der Load Balancer Anfragen desselben Clients immer an denselben Server weiterleitet. Dadurch kann eine Webanwendung Benutzersitzungen beibehalten, Benutzereinstellungen speichern und Benutzer authentifiziert halten. Sticky-Sessions sind besonders wichtig für zustandsbehaftete Anwendungen, bei denen der Server spezifische Informationen über den Benutzer während einer Sitzung behalten muss. Ohne Sticky-Sessions würden die Server bei jeder Anfrage eines Clients wechseln, was zu Problemen wie Verlust von Sitzungsdaten und Benutzerinkonsistenzen führen kann.

Quelle: <https://traefik.io/glossary/what-are-sticky-sessions/>

### B. Zweck der Verwendung von Sticky-Sessions in Webanwendungen

Der Zweck der Verwendung von Sticky-Sessions in Webanwendungen besteht darin, die Konsistenz und Kontinuität der Benutzersitzungen sicherzustellen. Durch das Weiterleiten von Anfragen desselben Clients an denselben Server können Webanwendungen Benutzerpräferenzen, Authentifizierungsstatus und andere zustandsbezogene Informationen beibehalten. Dies ermöglicht eine nahtlose Benutzererfahrung, da Benutzer ihre Sitzungsinformationen nicht bei jedem Serverwechsel erneut eingeben müssen. Sticky-Sessions sind besonders wichtig für Anwendungen, die Benutzerdaten und Zustände speichern müssen, um eine personalisierte Interaktion zu ermöglichen.

Quelle: <https://traefik.io/glossary/what-are-sticky-sessions/>

## II. Funktionsweise von Sticky-Sessions

### A. Identifizierung von Anfragen vom selben Client

Die Funktionsweise von Sticky-Sessions beinhaltet die Identifizierung von Anfragen vom selben Client. Dies wird in der Regel mithilfe von Session-Cookies erreicht. Ein Session-Cookie wird vom Server an den Client gesendet und enthält eine eindeutige Kennung, die den Client identifiziert. Bei jeder weiteren Anfrage des Clients sendet der Browser automatisch das Session-Cookie zurück an den Server.

Der Load Balancer liest das Session-Cookie aus und verwendet die darin enthaltene Kennung, um Anfragen desselben Clients zu identifizieren. Auf diese Weise weiß der Load Balancer, dass alle Anfragen mit dieser spezifischen Kennung an denselben Server weitergeleitet werden sollten.

Diese Funktionalität basiert auf dem Vertrauen in die Eindeutigkeit des Session-Cookies und die korrekte Übermittlung durch den Browser des Clients. Durch diese Identifizierung von Anfragen vom selben Client ermöglichen Sticky-Sessions die Aufrechterhaltung der Sitzungsinformationen und eine konsistente Benutzererfahrung.

Quelle: <https://traefik.io/glossary/what-are-sticky-sessions/>

### B. Weiterleitung von Anfragen an denselben Server

Die Funktionsweise von Sticky-Sessions beinhaltet die Weiterleitung von Anfragen an denselben Server. Sobald der Load Balancer die Anfrage eines Clients empfängt und dessen Identität anhand des Session-Cookies ermittelt hat, leitet er die Anfrage immer an denselben Server weiter, der die zugehörige Sitzung enthält. Dies stellt sicher, dass alle zugehörigen Daten und Zustände des Benutzers auf demselben Server bleiben.

Die Weiterleitung der Anfragen an denselben Server ermöglicht es der Webanwendung, die Sitzungsinformationen beizubehalten und den Zustand des Benutzers konsistent zu halten. Auf diese Weise kann die Anwendung die Benutzereinstellungen, den Authentifizierungsstatus und andere kontextbezogene Informationen speichern und verwenden.

Quelle: <https://traefik.io/glossary/what-are-sticky-sessions/>

### C. Speicherung von Benutzerinformationen auf Serverseite

Bei der Verwendung von Sticky-Sessions werden alle Benutzerinformationen serverseitig gespeichert. Das bedeutet, dass die relevanten Daten und Zustände einer Benutzersitzung auf dem Server abgelegt werden, anstatt sie beim Client zu halten. Dies ermöglicht es, Informationen wie den Anmeldestatus, den Warenkorbinhalt oder individuelle Einstellungen des Benutzers während einer Sitzung beizubehalten.

Durch die serverseitige Speicherung der Benutzerinformationen können die Anwendungslogik und der Zustand der Sitzung effizient auf dem Server verwaltet werden. Dies ist insbesondere für zustandsbehaftete Dienste wichtig, bei denen der Server spezifische Daten über den Benutzer beibehalten muss, um die gewünschte Funktionalität bereitzustellen.

Quelle: <https://traefik.io/glossary/what-are-sticky-sessions/>

## III. Probleme bei Skalierung und Sticky-Sessions

Bei der Skalierung von Webanwendungen können Probleme auftreten, wenn Sticky-Sessions verwendet werden. Eine Herausforderung besteht darin, dass die Verwendung von Sticky-Sessions zu einer ungleichmäßigen Verteilung der Last auf die Server führen kann. Wenn Anfragen desselben Clients immer an denselben Server gesendet werden, kann dies zu einer Überlastung bestimmter Server führen, während andere unterausgelastet sind.

Darüber hinaus kann die Verwendung von Sticky-Sessions die Ressourcennutzung beeinflussen. Da die Sitzungsinformationen auf dem Server gespeichert werden müssen, erfordert dies zusätzlichen Speicherplatz und Verwaltungsaufwand.

### A. Herausforderungen bei der Skalierung von Anwendungen mit Sticky-Sessions

Bei der Skalierung von Anwendungen mit Sticky-Sessions treten einige Herausforderungen auf. Eine Hauptherausforderung besteht darin, dass die Verwendung von Sticky-Sessions die Lastenausgleichsfunktion beeinträchtigen kann. Da Anfragen desselben Clients immer an denselben Server weitergeleitet werden, kann dies zu einer ungleichmäßigen Verteilung der Last führen, wenn bestimmte Server stärker belastet sind als andere.

Darüber hinaus kann die Speicherung von Sitzungsinformationen auf dem Server zu einer erhöhten Ressourcennutzung führen. Da jeder Server die Sitzungsdaten für seine zugewiesenen Clients speichern muss, können die Speicheranforderungen und der Speicherbedarf insgesamt zunehmen.

Diese Herausforderungen können die Skalierbarkeit einer Anwendung beeinträchtigen, da die Verteilung der Last und die effiziente Ressourcennutzung erschwert werden.

## IV. Rolle von Single Page Webanwendungen (SPA)

### A. Konzept und Architektur von SPAs

### B. Reduzierung der Abhängigkeit von Sitzungsinformationen

### C. Skalierungsunterstützung bei Anwendungen ohne Sticky-Sessions

## V. Visualisierungen

A. Visualisierung der Funktionsweise von Sticky-Sessions
B. Vergleich der Skalierungsprobleme mit und ohne SPAs

## VI. Fazit

### A. Zusammenfassung der Funktionsweise von Sticky-Sessions

### B. Vorteile von SPAs bei der Bewältigung von Skalierungsproblemen
