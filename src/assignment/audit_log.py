"""
Assignment 11 — Audit Log starter (TODO).

Records every interaction for forensics. Never blocks by itself —
other layers catch attacks; this layer makes them reviewable.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path


def default_audit_log_path() -> str:
    """Always resolve to <repo>/outputs/… (safe when cwd is src/)."""
    repo_root = Path(__file__).resolve().parents[2]
    return str(repo_root / "outputs" / "audit_log.json")


class AuditLogPlugin:
    """Framework-agnostic audit logger (wire into ADK callbacks or your pipeline)."""

    def __init__(self):
        self.name = "audit_log"
        self.logs: list[dict] = []
        self._open: dict[str, float] = {}

    def record_input(self, *, user_id: str, text: str, request_id: str | None = None):
        import time
        req_id = request_id or f"{user_id}_{len(self.logs)}_{time.time()}"
        self._open[req_id] = {
            "start_time": time.time(),
            "timestamp": utc_now_iso(),
            "user_id": user_id,
            "text": text,
        }
        return req_id

    def record_output(
        self,
        *,
        user_id: str,
        text: str,
        blocked: bool = False,
        layer: str | None = None,
        request_id: str | None = None,
    ):
        import time
        req_id = request_id or user_id
        entry = self._open.pop(req_id, None)
        now_ts = time.time()
        start_ts = entry["start_time"] if entry else now_ts
        latency_ms = round((now_ts - start_ts) * 1000, 2)
        input_text = entry["text"] if entry else ""
        timestamp = entry["timestamp"] if entry else utc_now_iso()

        record = {
            "request_id": req_id,
            "user_id": user_id,
            "timestamp": timestamp,
            "input": input_text,
            "output": text,
            "blocked": blocked,
            "layer": layer,
            "latency_ms": latency_ms,
        }
        self.logs.append(record)
        return record

    def export_json(self, filepath: str | None = None):
        """Write logs to disk (JSON array) under repo-root ``outputs/`` by default."""
        out_path = Path(filepath or default_audit_log_path())
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(
            json.dumps(self.logs, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        return out_path


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
