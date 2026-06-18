import httpx
import typer
from rich.console import Console
from rich.panel import Panel

from clutch_cli.config import API_BASE_URL, get_token, get_username

console = Console()


def status():
    """Show login status and API health."""
    username = get_username()
    token = get_token()

    if not username or not token:
        console.print(Panel(
            "[red]✗[/red] Not logged in\n"
            "[dim]Run: clutch auth login[/dim]",
            title="[bold]Clutch — Status[/bold]",
            border_style="red",
        ))
        raise typer.Exit()

    # Check API health
    try:
        response = httpx.get(
            f"{API_BASE_URL}/users/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=8,
        )
        if response.status_code == 200:
            console.print(Panel(
                f"[green]✓[/green] Logged in as [bold]@{username}[/bold]\n"
                f"[green]✓[/green] API reachable at [dim]{API_BASE_URL}[/dim]",
                title="[bold]Clutch — Status[/bold]",
                border_style="green",
            ))
        else:
            console.print(Panel(
                f"[yellow]~[/yellow] Logged in as [bold]@{username}[/bold] (token may be expired)\n"
                f"[red]✗[/red] API returned {response.status_code}\n"
                f"[dim]Try: clutch auth login[/dim]",
                title="[bold]Clutch — Status[/bold]",
                border_style="yellow",
            ))
    except httpx.RequestError:
        console.print(Panel(
            f"[green]✓[/green] Logged in as [bold]@{username}[/bold]\n"
            f"[red]✗[/red] API unreachable — check your connection",
            title="[bold]Clutch — Status[/bold]",
            border_style="yellow",
        ))
