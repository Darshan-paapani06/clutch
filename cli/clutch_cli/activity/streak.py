import typer
from rich.table import Table
from rich import box
from clutch_cli.api import get_client
from clutch_cli.theme import console, ACCENT, DIM, SUCCESS, WARNING, header, footer, bar


def streak():
    """Show your current and longest commit streak."""
    with get_client() as client:
        try:
            response = client.get("/github/streak")
            if response.status_code != 200:
                console.print("[bold red]Error: Failed to fetch streak data.[/bold red]")
                raise typer.Exit(1)

            data = response.json()
            current = data["current_streak"]
            longest = data["longest_streak"]
            total_active = data["total_active_days"]

            if current >= 14:
                status = "STRONG"
                status_style = SUCCESS
            elif current >= 7:
                status = "BUILDING"
                status_style = ACCENT
            elif current > 0:
                status = "ACTIVE"
                status_style = WARNING
            else:
                status = "INACTIVE"
                status_style = DIM

            header("STREAK")

            table = Table(box=box.SIMPLE, show_header=False, pad_edge=False)
            table.add_column("Label", style=DIM, width=22)
            table.add_column("Value", style="bold white")
            table.add_column("Badge", justify="right")

            table.add_row("Current Streak", f"[{ACCENT}]{current} days[/{ACCENT}]", f"[{status_style}]{status}[/{status_style}]")
            table.add_row("Longest Streak", f"{longest} days", "")
            table.add_row("Total Active Days", f"{total_active} days", "")

            console.print(table)
            if longest > 0:
                console.print(f"  [{DIM}]Progress to longest[/{DIM}]  {bar(current, longest)}  [{DIM}]{current}/{longest}[/{DIM}]")

            footer()

        except Exception:
            console.print("[bold red]Error: Could not connect to Clutch API.[/bold red]")
            raise typer.Exit(1)
