import httpx
from rich.table import Table
from rich import box
from clutch_cli.config import API_BASE_URL, get_token, get_username
from clutch_cli.theme import console, ACCENT, DIM, SUCCESS, ERROR, WARNING, header, footer


def status():
    """Show login status and API health."""
    username = get_username()
    token = get_token()

    header("STATUS")

    table = Table(box=box.SIMPLE, show_header=False, pad_edge=False)
    table.add_column("Check", style=DIM, width=18)
    table.add_column("Result", style="bold white")

    if not username or not token:
        table.add_row("Auth", f"[{ERROR}]Not logged in[/{ERROR}]")
        table.add_row("Hint", f"[{DIM}]Run: clutch login[/{DIM}]")
        console.print(table)
        footer()
        raise SystemExit()

    table.add_row("User", f"[{ACCENT}]@{username}[/{ACCENT}]")

    try:
        response = httpx.get(
            f"{API_BASE_URL}/users/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=8,
        )
        if response.status_code == 200:
            table.add_row("Token", f"[{SUCCESS}]Valid[/{SUCCESS}]")
            table.add_row("API", f"[{SUCCESS}]Reachable[/{SUCCESS}]  [{DIM}]{API_BASE_URL}[/{DIM}]")
        else:
            table.add_row("Token", f"[{WARNING}]Expired ({response.status_code})[/{WARNING}]")
            table.add_row("Hint", f"[{DIM}]Run: clutch login[/{DIM}]")
    except httpx.RequestError:
        table.add_row("Token", f"[{SUCCESS}]Saved[/{SUCCESS}]")
        table.add_row("API", f"[{ERROR}]Unreachable[/{ERROR}]")

    console.print(table)
    footer()
