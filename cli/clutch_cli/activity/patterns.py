import typer
from rich.table import Table
from rich import box
from clutch_cli.api import get_client
from clutch_cli.theme import console, ACCENT, DIM, SUCCESS, WARNING, ERROR, header, footer, bar


def patterns():
    """Show your coding patterns and habits."""
    with get_client() as client:
        try:
            console.print()
            console.print(f"[{DIM}]Analyzing patterns...[/{DIM}]")

            response = client.get("/insights/patterns")
            if response.status_code != 200:
                console.print("[bold red]Error: Failed to fetch patterns.[/bold red]")
                raise typer.Exit(1)

            data = response.json()

            if "message" in data:
                console.print(f"[{WARNING}]{data['message']}[/{WARNING}]")
                raise typer.Exit()

            header("CODING PATTERNS")

            score = data["consistency_score"]
            score_style = SUCCESS if score >= 70 else WARNING if score >= 40 else ERROR

            summary = Table(box=box.SIMPLE, show_header=False, pad_edge=False)
            summary.add_column("Label", style=DIM, width=22)
            summary.add_column("Value", style="bold white")

            summary.add_row("Best Day", f"[{ACCENT}]{data['best_day']}[/{ACCENT}]")
            summary.add_row("Worst Day", f"[{DIM}]{data['worst_day']}[/{DIM}]")
            summary.add_row("Avg Daily Commits", str(data["avg_daily_commits"]))
            summary.add_row("Total Active Days", str(data["total_active_days"]))
            summary.add_row("Consistency Score", f"[{score_style}]{score}%[/{score_style}]")

            console.print(summary)
            console.print()
            console.rule(f"[{DIM}]Activity by Day[/{DIM}]", style=DIM)
            console.print()

            day_table = Table(box=box.SIMPLE, show_header=False, pad_edge=False)
            day_table.add_column("Day", style=DIM, width=12)
            day_table.add_column("Bar", width=32)
            day_table.add_column("Count", justify="right", style="bold white", width=6)

            max_commits = max(data["day_distribution"].values()) or 1
            for day, commits in data["day_distribution"].items():
                is_best = day == data["best_day"]
                day_label = f"[{ACCENT}]{day}[/{ACCENT}]" if is_best else day
                day_table.add_row(day_label, bar(commits, max_commits), str(commits))

            console.print(day_table)

            if data.get("top_repos"):
                console.print()
                console.rule(f"[{DIM}]Most Active Repos[/{DIM}]", style=DIM)
                console.print()

                repo_table = Table(box=box.SIMPLE, show_header=False, pad_edge=False)
                repo_table.add_column("Repo", style="bold white", width=30)
                repo_table.add_column("Active Days", justify="right", style=DIM, width=12)

                for repo in data["top_repos"]:
                    repo_table.add_row(repo["repo"], str(repo["days_active"]))

                console.print(repo_table)

            footer()

        except Exception:
            console.print("[bold red]Error: Could not connect to Clutch API.[/bold red]")
            raise typer.Exit(1)
