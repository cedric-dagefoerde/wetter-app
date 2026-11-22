Nachdem ich den Ordner Aufgabe 4 erstellt habe und die Datein kopiert habe ohne die Ordner, hatte ich das Problem, dass er die CSS und JS Datein nicht finden konnte was man in der Konsole sehen konnte wegen der Fehlermeldung. Da im HTML bei den Links noch der Ordner mit angeben war. Nachdem ich die Ordnernamen aus dem Pfad entfernt habe, lief die Seite wieder.

Bei MDN herausgefunden, dass man mit response.ok einen boolschen Wert erhält also true oder false, der angibt ob die Antwort vom Server erfolgreich war oder nicht.

Bei Stack Overflow gelernt wie man einen Button sperrt und wieder freigibt mit der .disabled Eigenschaft.

Also wenn ich mit encodeURIComponent Bad & Gut eingebe kommt die Fehlermeldung "Stadt nicht gefunden", aber wenn ich encodeURIComponent entferne und dann Bad & Gut eingebe, sucht er irgendeine Stadt heraus die mit Bad anfängt z.B. Bade, Taiwan.
Die encodeURIComponent wandelt Sonderzeichen wie & und leerzeichen in URL-sicheren Code wie %26, %20 um, damit sie nicht als Trennzeichen der URL missverstanden werden. Das bedeutet wenn man ohne encodeURIComponent Bad & Gut eingibt trennt das & den Suchbegriff ab und es wird nur nach Bad gesucht und liefert falsche Treffer, anstatt die Fehlermedung "Stadt nicht gefunden" anzuzeigen.