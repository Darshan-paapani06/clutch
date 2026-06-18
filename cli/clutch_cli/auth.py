import webbrowser
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

import httpx
import typer
from rich.console import Console

from clutch_cli.config import API_BASE_URL, clear_config, get_username, save_token

app = typer.Typer(help="Authentication commands.")
console = Console()

CLI_CALLBACK_PORT = 9876
_captured_token: dict = {}


class _CallbackHandler(BaseHTTPRequestHandler):
    """Minimal HTTP handler that captures the JWT from the OAuth redirect."""

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/callback":
            params = parse_qs(parsed.query)
            token = params.get("token", [None])[0]
            if token:
                _captured_token["value"] = token
                self._respond(200, _success_page())
            else:
                self._respond(400, _error_page("No token received."))
        else:
            self._respond(404, b"Not found")

    def _respond(self, status: int, body: bytes) -> None:
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):
        pass  # silence default request logging


def _success_page() -> bytes:
    return b"""<!DOCTYPE html>
<html>
<head><title>Clutch Login</title></head>
<body style="font-family:sans-serif;text-align:center;padding:60px;background:#0d1117;color:#58a6ff">
  <h1>&#9889; Clutch</h1>
  <p style="color:#3fb950;font-size:1.2rem">&#10003; Login successful! You can close this tab.</p>
</body>
</html>"""


def _error_page(msg: str) -> bytes:
    return f"""<!DOCTYPE html>
<html>
<head><title>Clutch Login Error</title></head>
<body style="font-family:sans-serif;text-align:center;padding:60px;background:#0d1117;color:#f85149">
  <h1>&#9889; Clutch</h1>
  <p>Login failed: {msg}</p>
</body>
</html>""".encode()


@app.command()
def login():
    """Login to Clutch via GitHub OAuth (browser-based, fully automatic)."""
    console.print("\n[bold green]⚡ Clutch Login[/bold green]")
    console.print("[dim]Starting local callback listener...[/dim]")

    _captured_token.clear()
    server = HTTPServer(("localhost", CLI_CALLBACK_PORT), _CallbackHandler)

    login_url = f"{API_BASE_URL}/auth/github?cli=true"
    console.print("[dim]Opening GitHub in your browser...[/dim]\n")
    webbrowser.open(login_url)

    console.print("[yellow]Waiting for GitHub authorization...[/yellow]")
    console.print("[dim](If your browser didn't open, visit:)[/dim]")
    console.print(f"[dim]{login_url}[/dim]\n")

    # Block on main thread until the OAuth callback hits localhost:9876/callback
    server.handle_request()
    server.server_close()

    token = _captured_token.get("value")
    if not token:
        console.print("[red]❌ Login failed — no token received.[/red]")
        raise typer.Exit(1)

    # Verify token and fetch user info
    try:
        response = httpx.get(
            f"{API_BASE_URL}/users/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=10,
        )
        if response.status_code != 200:
            console.print("[red]❌ Token validation failed.[/red]")
            raise typer.Exit(1)

        user = response.json()
        save_token(token, user["username"])
        console.print(f"[bold green]✅ Logged in as @{user['username']}[/bold green]")
        console.print(f"[dim]Welcome to Clutch, {user.get('name') or user['username']}![/dim]\n")

    except httpx.RequestError:
        console.print("[red]❌ Could not connect to Clutch API.[/red]")
        raise typer.Exit(1)


@app.command()
def logout():
    """Logout from Clutch."""
    username = get_username()
    if not username:
        console.print("[yellow]You are not logged in.[/yellow]")
        raise typer.Exit()

    clear_config()
    console.print("[bold green]✅ Logged out successfully.[/bold green]")


@app.command()
def whoami():
    """Show the currently logged-in user."""
    username = get_username()
    if not username:
        console.print("[yellow]Not logged in. Run: clutch auth login[/yellow]")
        raise typer.Exit()
    console.print(f"[bold green]Logged in as @{username}[/bold green]")
