"""Shared visual theme for all Clutch CLI output.

One bold, monochrome accent system — no rainbow, no gradients.
Primary: bold white. Accent: bold (terminal default bright). Dim: grey.
Status: green (positive only), red (errors only), yellow (warnings only).
"""

from rich.console import Console

console = Console()

# Text styles
PRIMARY = "bold white"
ACCENT = "bold"          # bright/bold default terminal color — reads as black/white bold
DIM = "dim"
SUCCESS = "bold green"
ERROR = "bold red"
WARNING = "bold yellow"

BRAND = "⚡ CLUTCH"


def header(title: str) -> None:
    """Print the standard Clutch section header."""
    console.print()
    console.rule(f"[{ACCENT}]{BRAND} — {title.upper()}[/{ACCENT}]")
    console.print()


def footer() -> None:
    """Print the standard Clutch section footer."""
    console.print()
    console.rule(style=DIM)
    console.print()


def bar(value: float, max_value: float, width: int = 28) -> str:
    """Render a solid/empty block bar, bold white filled + dim empty."""
    max_value = max_value or 1
    filled = int((value / max_value) * width)
    filled = max(0, min(width, filled))
    return f"[{ACCENT}]{'█' * filled}[/{ACCENT}][{DIM}]{'░' * (width - filled)}[/{DIM}]"
