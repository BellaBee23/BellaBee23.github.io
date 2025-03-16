import http.server
import socketserver
import os
import signal
import sys
import re


class TemplateHandler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def inject_env_vars(self, content):
        env_vars = {
            'EMAILJS_PUBLIC_KEY': os.getenv('EMAILJS_PUBLIC_KEY', ''),
            'EMAILJS_SERVICE_ID': os.getenv('EMAILJS_SERVICE_ID', ''),
            'EMAILJS_TEMPLATE_ID': os.getenv('EMAILJS_TEMPLATE_ID', '')
        }

        # Check for missing environment variables
        missing_vars = [key for key, value in env_vars.items() if not value]
        if missing_vars:
            print(
                f"Warning: Missing environment variables: {', '.join(missing_vars)}"
            )

        # Replace both ${process.env.VAR} and process.env.VAR patterns
        for key, value in env_vars.items():
            content = content.replace(f'${{process.env.{key}}}', value)
            content = content.replace(f'process.env.{key}', f"'{value}'")

        return content

    def do_GET(self):
        if self.path == '/' or self.path == '/index.html':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()

            with open('index.html', 'r') as f:
                content = f.read()

            content = self.inject_env_vars(content)
            self.wfile.write(content.encode())
            return
        elif self.path == '/js/main.js':
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript')
            self.end_headers()

            with open('js/main.js', 'r') as f:
                content = f.read()

            content = self.inject_env_vars(content)
            self.wfile.write(content.encode())
            return

        return super().do_GET()


def run_server():
    ports = [5000, 5001, 5002]  # Try these ports in order

    for port in ports:
        try:
            with socketserver.TCPServer(("0.0.0.0", port),
                                        TemplateHandler) as httpd:
                print(f"Server started on port {port}")
                httpd.serve_forever()
                break
        except OSError:
            print(f"Port {port} is in use, trying next port...")
            continue
    else:
        print("No available ports found")
        sys.exit(1)


if __name__ == "__main__":
    signal.signal(signal.SIGINT, lambda s, f: sys.exit(0))
    run_server()
