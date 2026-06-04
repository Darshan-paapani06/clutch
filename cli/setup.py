from setuptools import setup, find_packages

setup(
    name="clutch-dev",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "typer==0.26.7",
        "httpx==0.27.2",
        "rich==13.8.1",
    ],
    entry_points={
        "console_scripts": [
            "clutch=clutch_cli.main:app",
        ],
    },
    author="Lay Patel",
    author_email="lay.patel.1313@gmail.com",
    description="GitHub tracks your work. Clutch tracks you.",
    long_description=open("../README.md").read(),
    python_requires=">=3.11",
)