import typer
from rich.console import Console
from rich.table import Table
from rich import box
from clutch_cli.api import get_client

console = Console()


def patterns():
    """Show your coding patterns and habits."""
    with get_client() as client:
        try:
            console.print()
            console.print("[dim]Analyzing patterns...[/dim]")

            response = client.get("/insights/patterns")
            if response.status_code != 200:
                console.print("[red]Error: Failed to fetch patterns.[/red]")
                raise typer.Exit(1)

            data = response.json()

            if "message" in data:
                console.print(f"[yellow]{data['message']}[/yellow]")
                raise typer.Exit()

            console.print()
            console.rule("[bold blue]⚡ CLUTCH — CODING PATTERNS[/bold blue]")
            console.print()

            # Summary table
            score = data["consistency_score"]
            score_color = "green" if score >= 70 else "yellow" if score >= 40 else "red"

            summary = Table(box=box.SIMPLE, show_header=False, pad_edge=False)
            summary.add_column("Label", style="dim", width=22)
            summary.add_column("Value", style="bold white")

            summary.add_row("Best Day", f"[green]{data['best_day']}[/green]")
            summary.add_row("Worst Day", f"[dim]{data['worst_day']}[/dim]")
            summary.add_row("Avg Daily Commits", str(data["avg_daily_commits"]))
            summary.add_row("Total Active Days", str(data["total_active_days"]))
            summary.add_row(
                "Consistency Score",
                f"[{score_color}]{score}%[/{score_color}]",
            )

            console.print(summary)
            console.print()
            console.rule("[dim]Activity by Day[/dim]", style="dim")
            console.print()

            # Day distribution bar chart
            day_table = Table(box=box.SIMPLE, show_header=False, pad_edge=False)
            day_table.add_column("Day", style="dim", width=12)
            day_table.add_column("Bar", width=32)
            day_table.add_column("Count", justify="right", style="bold white", width=6)

            max_commits = max(data["day_distribution"].values()) or 1
            for day, commits in data["day_distribution"].items():
                filled = int((commits / max_commits) * 28)
                is_best = day == data["best_day"]
                bar_color = "blue" if is_best else "white"
                bar = f"[{bar_color}]{'█' * filled}[/{bar_color}][dim]{'░' * (28 - filled)}[/dim]"
                day_label = f"[blue]{day}[/blue]" if is_best else day
                day_table.add_row(day_label, bar, str(commits))

            console.print(day_table)

            # Top repos
            if data.get("top_repos"):
                console.print()
                console.rule("[dim]Most Active Repos[/dim]", style="dim")
                console.print()

                repo_table = Table(box=box.SIMPLE, show_header=False, pad_edge=False)
                repo_table.add_column("Repo", style="bold white", width=30)
                repo_table.add_column("Active Days", justify="right", style="dim", width=12)

                for repo in data["top_repos"]:
                    repo_table.add_row(repo["repo"], str(repo["days_active"]))

                console.print(repo_table)

            console.print()
            console.rule(style="dim")
            console.print()

        except Exception:
            console.print("[red]Error: Could not connect to Clutch API.[/red]")
            raise typer.Exit(1)
