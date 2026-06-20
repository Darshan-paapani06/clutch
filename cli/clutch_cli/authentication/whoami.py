from clutch_cli.config import get_username
from clutch_cli.theme import console, ACCENT, WARNING


def whoami():
    """Show the currently logged-in user."""
    username = get_username()
    if not username:
        console.print(f"[{WARNING}]Not logged in. Run: clutch login[/{WARNING}]")
        raise SystemExit()
    console.print(f"[{ACCENT}]Logged in as @{username}[/{ACCENT}]")
