import httpx
import typer
from rich.console import Console
from rich.table import Table
from rich import box
from clutch_cli.config import API_BASE_URL, get_token, get_username

console = Console()


def status():
    """Show login status and API health."""
    username = get_username()
    token = get_token()

    console.print()
    console.rule("[bold blue]⚡ CLUTCH — STATUS[/bold blue]")
    console.print()

    table = Table(box=box.SIMPLE, show_header=False, pad_edge=False)
    table.add_column("Check", style="dim", width=18)
    table.add_column("Result", style="bold white")

    if not username or not token:
        table.add_row("Auth", "[red]Not logged in[/red]")
        table.add_row("Hint", "[dim]Run: clutch auth login[/dim]")
        console.print(table)
        console.print()
        console.rule(style="dim")
        console.print()
        raise typer.Exit()

    table.add_row("User", f"[blue]@{username}[/blue]")

    try:
        response = httpx.get(
            f"{API_BASE_URL}/users/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=8,
        )
        if response.status_code == 200:
            table.add_row("Token", "[green]Valid[/green]")
            table.add_row("API", f"[green]Reachable[/green]  [dim]{API_BASE_URL}[/dim]")
        else:
            table.add_row("Token", f"[yellow]Expired ({response.status_code})[/yellow]")
            table.add_row("Hint", "[dim]Run: clutch auth login[/dim]")
    except httpx.RequestError:
        table.add_row("Token", "[green]Saved[/green]")
        table.add_row("API", "[red]Unreachable[/red]")

    console.print(table)
    console.print()
    console.rule(style="dim")
    console.print()
