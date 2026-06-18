import typer
from rich.console import Console
from rich.table import Table
from rich import box
from clutch_cli.api import get_client

console = Console()


def streak():
    """Show your current and longest commit streak."""
    with get_client() as client:
        try:
            response = client.get("/github/streak")
            if response.status_code != 200:
                console.print("[red]Error: Failed to fetch streak data.[/red]")
                raise typer.Exit(1)

            data = response.json()
            current = data["current_streak"]
            longest = data["longest_streak"]
            total_active = data["total_active_days"]

            if current >= 30:
                streak_color = "bold green"
                status = "ON FIRE"
            elif current >= 14:
                streak_color = "bold green"
                status = "STRONG"
            elif current >= 7:
                streak_color = "bold blue"
                status = "BUILDING"
            elif current > 0:
                streak_color = "bold yellow"
                status = "ACTIVE"
            else:
                streak_color = "dim"
                status = "INACTIVE"

            console.print()
            console.rule("[bold blue]⚡ CLUTCH — STREAK[/bold blue]")
            console.print()

            table = Table(box=box.SIMPLE, show_header=False, pad_edge=False)
            table.add_column("Label", style="dim", width=22)
            table.add_column("Value", style="bold white")
            table.add_column("Badge", justify="right")

            table.add_row(
                "Current Streak",
                f"[{streak_color}]{current} DAY'S[/{streak_color}]",
                f"[blue]{status}[/blue]",
            )
            table.add_row(
                "Longest Streak",
                f"{longest} DAY'S",
                "",
            )
            table.add_row(
                "Total Active Days",
                f"{total_active} DAY'S",
                "",
            )

            # Visual bar: current vs longest
            if longest > 0:
                filled = int((current / longest) * 30)
                bar = "█" * filled + "░" * (30 - filled)
                console.print(table)
                console.print(f"  [dim]Progress to longest[/dim]  [blue]{bar}[/blue]  [dim]{current}/{longest}[/dim]")
            else:
                console.print(table)

            console.print()
            console.rule(style="dim")
            console.print()

        except Exception:
            console.print("[red]Error: Could not connect to Clutch API.[/red]")
            raise typer.Exit(1)
