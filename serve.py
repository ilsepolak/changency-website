#!/usr/bin/env python3
"""
Lokale development server: statische bestanden + custom 404.html bij onbekende paden.

Gebruik: python3 serve.py
(Poort via omgeving: PORT=8765 python3 serve.py)

Let op: `python3 -m http.server` toont de kale standaard-404; gebruik dit script lokaal.
Op GitHub Pages wordt 404.html automatisch gebruikt — daar geen actie nodig.
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

ROOT = os.path.dirname(os.path.abspath(__file__))


class ChangencyRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            path_404 = os.path.join(ROOT, "404.html")
            if os.path.isfile(path_404):
                try:
                    with open(path_404, "rb") as f:
                        body = f.read()
                    self.send_response(404)
                    self.send_header("Content-Type", "text/html; charset=utf-8")
                    self.send_header("Content-Length", str(len(body)))
                    self.end_headers()
                    self.wfile.write(body)
                    return
                except OSError:
                    pass
        super().send_error(code, message, explain)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8765"))
    httpd = HTTPServer(("127.0.0.1", port), ChangencyRequestHandler)
    print(f"Serving {ROOT}")
    print(f"  → http://127.0.0.1:{port}/")
    print("Onbekende URL’s tonen 404.html (niet de kale server-404).")
    httpd.serve_forever()
