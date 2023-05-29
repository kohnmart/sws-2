# Sticky-Sessions

## I. Einführung

Sticky-Sessions werden in Webanwendungen eingesetzt, um die Konsistenz und Kontinuität von Benutzersitzungen sicherzustellen. Durch das gezielte Weiterleiten von Anfragen desselben Clients an denselben Server ermöglichen sie Webanwendungen, Benutzerpräferenzen, Authentifizierungsstatus und andere zustandsbezogene Informationen beizubehalten. Dadurch wird eine nahtlose Benutzererfahrung gewährleistet, da Benutzer ihre Sitzungsinformationen nicht bei jedem Serverwechsel erneut eingeben müssen. Insbesondere für Anwendungen, die Benutzerdaten und -zustände speichern müssen, um personalisierte Interaktionen zu ermöglichen, spielen Sticky-Sessions eine wichtige Rolle.

Quelle: <https://traefik.io/glossary/what-are-sticky-sessions/>

## II. Funktionsweise von Sticky-Sessions

Die Funktionsweise von Sticky-Sessions besteht darin, sicherzustellen, dass Anfragen eines bestimmten Clients immer an denselben Server weitergeleitet werden. Dadurch können die Sitzungsinformationen des Benutzers beibehalten werden.

**1. Client-Anfrage**: Ein Client stellt eine Anfrage an den Load Balancer, der als Vermittler zwischen dem Client und den Servern fungiert.

**2. Load-Balancing-Entscheidung**: Der Load Balancer entscheidet, an welchen Server die Anfrage weitergeleitet wird. Bei Verwendung von Sticky-Sessions berücksichtigt der Load Balancer das Session-Cookie, das der Client bei vorherigen Anfragen erhalten hat.

**3. Überprüfung des Session-Cookies**: Der Load Balancer überprüft das Session-Cookie in der Anfrage des Clients. Das Session-Cookie enthält eine eindeutige Kennung, die den Client identifiziert.

**4. Weiterleitung an den entsprechenden Server**: Basierend auf dem Session-Cookie leitet der Load Balancer die Anfrage an den Server weiter, der mit dem identifizierten Client verknüpft ist. Dadurch wird sichergestellt, dass alle zukünftigen Anfragen desselben Clients an denselben Server gesendet werden.

**5. Beibehaltung der Sitzungsinformationen**: Da alle Anfragen desselben Clients an denselben Server gesendet werden, kann der Server die Sitzungsinformationen beibehalten. Dies ermöglicht beispielsweise die Aufrechterhaltung der Benutzeranmeldung oder das Speichern von benutzerspezifischen Einstellungen.

Quelle: <https://traefik.io/glossary/what-are-sticky-sessions/>

Quelle: <https://www.youtube.com/watch?v=LEBjs0aqZQc/>

### Visualisierung der Funktionsweise

![Sticky-Sessions-Vergleich](sticky-sessions-compare.svg)

## III. Probleme bei Skalierung und Sticky-Sessions

Die Skalierung von Anwendungen mit Sticky-Sessions kann zu Herausforderungen bei der Lastverteilung führen. Die persistente Speicherung von Sitzungsinformationen beeinträchtigt die gleichmäßige Verteilung der Last auf die Server und kann die Skalierbarkeit der Anwendung beeinträchtigen. Zudem erhöht sich der Ressourcenbedarf durch die Speicherung der Sitzungsdaten auf den Servern.

Eine Lösung zur Bewältigung dieser Skalierungsprobleme liegt in der Verwendung von Single-Page-Anwendungen. Diese Anwendungen werden in der Regel clientseitig ausgeführt und sind zustandslos (stateless). Das bedeutet, dass alle benötigten Daten für die Ausführung der Anwendung auf dem Client gespeichert werden und nicht auf dem Server. Dadurch entfällt die Notwendigkeit, Sitzungsinformationen zwischen verschiedenen Servern zu synchronisieren oder zu persistieren.

Der Einsatz einer Single-Page-Anwendung reduziert oder eliminiert die Abhängigkeit von Sticky-Sessions. Jeder Server kann Anfragen unabhängig voneinander bearbeiten, da der Zustand auf dem Client gespeichert wird. Dies führt zu einer verbesserten Lastverteilung und Skalierbarkeit der Anwendung.

Quelle: <https://traefik.io/glossary/what-are-sticky-sessions/>
