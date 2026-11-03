import json
import re
from collections import Counter
from pyscript import document

# Regular expression that extracts the IP, method, path and HTTP status code
LOG_PATTERN = re.compile(
    r'(?P<ip>\d+\.\d+\.\d+\.\d+).*?"(?P<method>GET|POST|PUT|DELETE)\s+(?P<path>\S+)\s+HTTP/.*?"\s+(?P<status>\d{3})'
)

def analyze_logs(event=None):
    raw_logs = document.querySelector("#py-log-input").value.strip()
    output_el = document.querySelector("#py-output-json")

    if not raw_logs:
        output_el.textContent = json.dumps({"error": "There are no logs to analyze"}, indent=4)
        return

    lines = raw_logs.splitlines()
    ips = []
    statuses = []
    security_alerts = []

    for line in lines:
        match = LOG_PATTERN.search(line)
        if match:
            data = match.groupdict()
            ip = data["ip"]
            status = int(data["status"])

            ips.append(ip)
            statuses.append(status)

            # Flag HTTP errors (401 Unauthorized, 403 Forbidden, 500 Server Error)
            if status >= 400:
                security_alerts.append(f"[{status}] {ip} -> {data['method']} {data['path']}")

    ip_counts = Counter(ips)
    status_counts = Counter(statuses)
    top_ip, top_ip_hits = ip_counts.most_common(1)[0] if ip_counts else ("N/A", 0)

    report = {
        "total_lines_parsed": len(lines),
        "valid_http_events": len(statuses),
        "status_code_distribution": dict(status_counts),
        "most_active_ip": {"ip": top_ip, "requests": top_ip_hits},
        "anomalies_detected": len(security_alerts),
        "brute_force_suspected": len(security_alerts) >= 3,
        "security_log_details": security_alerts
    }

    output_el.textContent = json.dumps(report, indent=4, ensure_ascii=False)

# Connect the HTML button to the Python function
run_btn = document.querySelector("#py-run-btn")
run_btn.onclick = analyze_logs

# Run a first analysis when the tab opens
analyze_logs()