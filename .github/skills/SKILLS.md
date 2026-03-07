---
name: security-scanner
description: >
  Perform comprehensive security vulnerability detection and scanning across codebases and projects,
  with specialized support for Next.js applications. Use this skill whenever the user asks to scan
  for security issues, audit code for vulnerabilities, check for CVEs, detect insecure patterns,
  find secrets/credentials in code, analyze dependencies for known vulnerabilities, or produce a
  security report. Trigger aggressively for any request involving: "security scan",
  "vulnerability check", "audit my code", "find security issues", "check for secrets",
  "dependency vulnerabilities", "OWASP", "CVE", "pentest prep", "Next.js security",
  "API routes security", "server actions", or any mention of wanting to make their Next.js
  or React codebase more secure.
---

# Security Vulnerability Scanner (Next.js Edition)

A comprehensive skill for detecting and reporting security vulnerabilities in Next.js applications
and general codebases. Includes Next.js-specific checks for App Router, API Routes, Server Actions,
middleware, and environment variable handling.

## Overview

This skill guides Claude through a structured multi-phase security audit:

1. **Discovery** — Map the project, Next.js version, and router type (App/Pages)
2. **Next.js-Specific Checks** — API routes, Server Actions, middleware, env vars, SSR/SSG
3. **Static Analysis** — Scan code for insecure patterns (SAST)
4. **Dependency Audit** — Check packages for known CVEs via `npm audit`
5. **Secret Detection** — Find hardcoded credentials, keys, tokens
6. **Configuration Review** — `next.config.js`, security headers, CORS, CSP
7. **Reporting** — Generate a structured vulnerability report with remediations

---

## Phase 1: Project Discovery

```bash
# Map directory structure
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \
  -o -name "*.env*" -o -name "*.yml" -o -name "*.yaml" -o -name "*.json" \
  -o -name "Dockerfile*" \) \
  -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.next/*" \
  2>/dev/null | head -200

# Detect Next.js version, auth, DB, and validation libraries
cat package.json | python3 -c "
import json,sys
d=json.load(sys.stdin)
deps={**d.get('dependencies',{}),**d.get('devDependencies',{})}
print('Next.js:', deps.get('next','not found'))
print('React:', deps.get('react','not found'))
print('Auth:', [k for k in deps if any(x in k for x in ['auth','next-auth','clerk','supabase','lucia','better-auth'])])
print('DB/ORM:', [k for k in deps if any(x in k for x in ['prisma','drizzle','mongoose','sequelize','pg','mysql','sqlite'])])
print('Validation:', [k for k in deps if any(x in k for x in ['zod','yup','joi','valibot'])])
print('Rate limiting:', [k for k in deps if any(x in k for x in ['rate','limiter','upstash'])])
"

# Detect router type
echo "=== Router Type ==="
[ -d "app" ] && echo "App Router (app/)"
[ -d "src/app" ] && echo "App Router (src/app/)"
[ -d "pages" ] && echo "Pages Router (pages/)"
[ -d "src/pages" ] && echo "Pages Router (src/pages/)"

# List all API routes
echo "=== API Routes ==="
find . \( -path "*/pages/api/*" -o -path "*/app/api/*" \) \
  \( -name "*.ts" -o -name "*.js" -o -name "route.ts" -o -name "route.js" \) \
  2>/dev/null | grep -v node_modules | grep -v .next

# List Server Actions
echo "=== Server Actions ==="
grep -rn '"use server"\|'"'"'use server'"'" . \
  --include="*.ts" --include="*.tsx" --exclude-dir={node_modules,.git,.next} 2>/dev/null

# List middleware
echo "=== Middleware files ==="
find . -name "middleware.ts" -o -name "middleware.js" 2>/dev/null | grep -v node_modules
```

---

## Phase 2: Next.js-Specific Security Checks

### 2a. API Route Authentication

```bash
echo "=== API Routes missing auth checks ==="
for f in $(find . \( -path "*/pages/api/*" -o -path "*/app/api/*" \) \
           \( -name "*.ts" -o -name "*.js" \) 2>/dev/null | grep -v node_modules | grep -v .next); do
    has_auth=$(grep -lE "getSession|getServerSession|auth\(\)|verifyToken|authorization|cookies|jwt|clerk|session" "$f" 2>/dev/null)
    [ -z "$has_auth" ] && echo "  WARN: No auth check detected in $f"
done

# HTTP method validation in Pages Router API routes
echo "=== Pages API routes missing method checks ==="
for f in $(find . -path "*/pages/api/*" \( -name "*.ts" -o -name "*.js" \) 2>/dev/null | grep -v node_modules); do
    grep -q "req\.method" "$f" || echo "  WARN: No HTTP method check in $f"
done

# Rate limiting
echo "=== Rate limiting presence ==="
count=$(grep -rn "rateLimit\|rate-limit\|upstash\|Ratelimit" . \
  --include="*.ts" --include="*.js" --exclude-dir={node_modules,.git,.next} 2>/dev/null | wc -l)
[ "$count" -eq 0 ] && echo "  MEDIUM: No rate limiting found on API routes" || echo "  OK: Rate limiting found ($count references)"
```

### 2b. Server Actions Security

```bash
echo "=== Server Actions without input validation ==="
for f in $(grep -rl '"use server"\|'"'"'use server'"'" . \
           --include="*.ts" --include="*.tsx" --exclude-dir={node_modules,.next,.git} 2>/dev/null); do
    has_validation=$(grep -lE "z\.object|\.safeParse|\.parse\(|yup|joi|valibot" "$f" 2>/dev/null)
    [ -z "$has_validation" ] && echo "  HIGH: No input validation in server action: $f"
done

echo "=== Unvalidated formData usage in Server Actions ==="
grep -rn "formData\.get\b" . \
  --include="*.ts" --include="*.tsx" \
  --exclude-dir={node_modules,.git,.next} 2>/dev/null | head -20
```

### 2c. Environment Variable Exposure

```bash
echo "=== NEXT_PUBLIC_ variables (sent to browser) ==="
grep -rn "NEXT_PUBLIC_SECRET\|NEXT_PUBLIC_.*KEY\|NEXT_PUBLIC_.*TOKEN\|NEXT_PUBLIC_.*PASSWORD" . \
  --include=".env*" --exclude-dir={node_modules,.git,.next} 2>/dev/null | head -20

echo "=== Server-only env vars in 'use client' files ==="
for f in $(grep -rl '"use client"\|'"'"'use client'"'" . \
           --include="*.ts" --include="*.tsx" --include="*.jsx" \
           --exclude-dir={node_modules,.next,.git} 2>/dev/null); do
    matches=$(grep -n "process\.env\." "$f" 2>/dev/null | grep -v "NEXT_PUBLIC_")
    [ -n "$matches" ] && echo "  HIGH: Server env in client component $f:" && echo "$matches" | head -5
done

echo "=== .env files committed to repo ==="
find . \( -name ".env" -o -name ".env.local" -o -name ".env.production" -o -name ".env.development" \) \
  2>/dev/null | grep -v ".git"
grep -qE "^\.env" .gitignore 2>/dev/null || echo "  WARN: .env may not be in .gitignore"
```

### 2d. Middleware Security Review

```bash
echo "=== Middleware files ==="
for f in $(find . -name "middleware.ts" -o -name "middleware.js" 2>/dev/null | grep -v node_modules); do
    echo "--- $f ---"
    cat "$f"
    echo ""
    grep -q "NextResponse.redirect\|NextResponse.rewrite\|auth\|session" "$f" \
      || echo "  WARN: Middleware may not enforce auth — no redirect/auth logic found"
    grep -q "matcher\|config" "$f" \
      || echo "  INFO: No matcher config — middleware applies to all routes"
done
```

### 2e. XSS — React/Next.js Patterns

```bash
echo "=== dangerouslySetInnerHTML usage ==="
grep -rn "dangerouslySetInnerHTML" . \
  --include="*.tsx" --include="*.jsx" --include="*.ts" --include="*.js" \
  --exclude-dir={node_modules,.git,.next} 2>/dev/null | head -20

echo "=== __html object spread (XSS vector) ==="
grep -rn "__html\s*:" . \
  --include="*.tsx" --include="*.jsx" \
  --exclude-dir={node_modules,.git,.next} 2>/dev/null | head -10

echo "=== Open redirect via router.push with user input ==="
grep -rn "router\.push\|redirect(" . \
  --include="*.ts" --include="*.tsx" \
  --exclude-dir={node_modules,.git,.next} 2>/dev/null | \
  grep -E "req\.|params\.|searchParams\.|query\." | head -20
```

### 2f. SSRF via fetch in Server Components

```bash
echo "=== User-controlled URLs passed to fetch (SSRF risk) ==="
grep -rn "fetch(" . \
  --include="*.ts" --include="*.tsx" --include="*.js" \
  --exclude-dir={node_modules,.git,.next} 2>/dev/null | \
  grep -E "fetch\(.*\$\{|fetch\(.*req\.|fetch\(.*params\.|fetch\(.*query\." | head -20

echo "=== Cookie/header forwarding (token leakage risk) ==="
grep -rn "cookies()\.get\|headers()\.get" . \
  --include="*.ts" --include="*.tsx" \
  --exclude-dir={node_modules,.git,.next} 2>/dev/null | head -20
```

### 2g. next.config.js Audit

```bash
echo "=== next.config contents ==="
cat next.config.js 2>/dev/null || cat next.config.ts 2>/dev/null || cat next.config.mjs 2>/dev/null

echo "=== Wildcard image domains (hotlinking any source) ==="
grep -A5 "images:" next.config.* 2>/dev/null | grep -E '"\*"|remotePatterns.*\*'

echo "=== Security headers configured ==="
grep -l "Content-Security-Policy\|X-Frame-Options\|Strict-Transport-Security" next.config.* 2>/dev/null \
  || echo "  HIGH: No security headers found in next.config"

echo "=== reactStrictMode ==="
grep "reactStrictMode" next.config.* 2>/dev/null || echo "  INFO: reactStrictMode not set (recommended: true)"
```

### 2h. Security Headers Check

```bash
echo "=== Missing HTTP Security Headers ==="
for header in "Content-Security-Policy" "X-Frame-Options" "X-Content-Type-Options" \
              "Strict-Transport-Security" "Referrer-Policy" "Permissions-Policy"; do
    count=$(grep -rn "$header" . \
      --include="*.ts" --include="*.js" --include="*.tsx" \
      --exclude-dir={node_modules,.git,.next} 2>/dev/null | wc -l)
    [ "$count" -eq 0 ] && echo "  MEDIUM: $header not configured" || echo "  OK: $header found"
done
```

---

## Phase 3: Static Analysis (SAST)

### Semgrep (preferred — covers Next.js rules)

```bash
pip install semgrep --break-system-packages -q 2>/dev/null
semgrep --config=p/nextjs . --json 2>/dev/null > /tmp/semgrep_nextjs.json
semgrep --config=p/owasp-top-ten . --json 2>/dev/null > /tmp/semgrep_owasp.json
semgrep --config=p/typescript . --json 2>/dev/null > /tmp/semgrep_ts.json

python3 -c "
import json, glob
for fname in ['/tmp/semgrep_nextjs.json','/tmp/semgrep_owasp.json','/tmp/semgrep_ts.json']:
    try:
        d=json.load(open(fname))
        findings=d.get('results',[])
        label=fname.split('_')[1].replace('.json','')
        print(f'{label} findings: {len(findings)}')
        for f in findings[:15]:
            sev=f.get('extra',{}).get('severity','?')
            msg=f.get('extra',{}).get('message','')[:100]
            print(f\"  [{sev}] {f['check_id']} — {f['path']}:{f['start']['line']}\")
            print(f\"    {msg}\")
    except: pass
"
```

### Manual Next.js/JS Pattern Scanning

```bash
EXCL="--exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next"

echo "=== eval() usage ==="
grep -rn "eval(" . --include="*.ts" --include="*.tsx" --include="*.js" $EXCL 2>/dev/null | head -20

echo "=== SQL Injection patterns ==="
grep -rn -E '(`SELECT|"SELECT|'"'"'SELECT).*\$\{' . \
  --include="*.ts" --include="*.js" $EXCL 2>/dev/null | head -20

echo "=== Insecure Math.random (use for security tokens) ==="
grep -rn "Math\.random()" . --include="*.ts" --include="*.js" $EXCL 2>/dev/null | head -15

echo "=== Weak crypto (MD5/SHA1) ==="
grep -rn -iE "(createHash\(['\"]md5|createHash\(['\"]sha1)" . \
  --include="*.ts" --include="*.js" $EXCL 2>/dev/null | head -10

echo "=== Prototype pollution risk ==="
grep -rn -E "__proto__|constructor\[|prototype\[" . \
  --include="*.ts" --include="*.js" $EXCL 2>/dev/null | head -10
```

---

## Phase 4: Dependency Vulnerability Audit

```bash
echo "=== npm audit ==="
npm audit --json 2>/dev/null > /tmp/npm_audit.json
python3 -c "
import json
try:
    data=json.load(open('/tmp/npm_audit.json'))
    vulns=data.get('vulnerabilities',{})
    by_sev={}
    for name,v in vulns.items():
        s=v.get('severity','?')
        by_sev[s]=by_sev.get(s,[])+[name]
    for sev in ['critical','high','moderate','low']:
        pkgs=by_sev.get(sev,[])
        if pkgs: print(f'[{sev.upper()}] {len(pkgs)} packages: {pkgs[:5]}')
    # Detail top 10
    for name,v in list(vulns.items())[:10]:
        sev=v.get('severity','?')
        via=[x.get('title','?') if isinstance(x,dict) else str(x) for x in v.get('via',[])]
        fix=v.get('fixAvailable',False)
        print(f'  [{sev.upper()}] {name}: {via[0] if via else \"?\"}  (fix: {fix})')
except Exception as e: print(f'Error: {e}')
"

# Check for known Next.js CVEs
echo "=== Known Next.js CVE checks ==="
NEXT_VER=$(cat package.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('dependencies',{}).get('next','0'))" 2>/dev/null)
echo "Next.js version in use: $NEXT_VER"
echo "Check https://github.com/vercel/next.js/security/advisories for known advisories"
```

---

## Phase 5: Secret & Credential Detection

```bash
pip install detect-secrets --break-system-packages -q 2>/dev/null
detect-secrets scan . --exclude-files "node_modules|\.next|\.git" 2>/dev/null > /tmp/secrets_scan.json
python3 -c "
import json
try:
    data=json.load(open('/tmp/secrets_scan.json'))
    results=data.get('results',{})
    total=sum(len(v) for v in results.values())
    print(f'Potential secrets found: {total}')
    for filepath, secrets in list(results.items())[:15]:
        for s in secrets:
            print(f\"  [{s.get('type','?')}] {filepath}:{s.get('line_number','?')}\")
except Exception as e: print(f'Error: {e}')
"

echo "=== Hardcoded secrets grep ==="
grep -rn --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
  --include=".env*" --include="*.json" \
  -iE "(api_key|apikey|secret_key|password|auth_token|access_token|private_key)\s*[=:]\s*['\"][^'\"]{8,}" . \
  --exclude-dir={node_modules,.git,.next} 2>/dev/null | \
  grep -iv "example\|placeholder\|your_\|changeme\|xxx\|test\|fake\|dummy\|process\.env" | head -30

echo "=== AWS credentials ==="
grep -rn "AKIA[0-9A-Z]{16}" . --exclude-dir={node_modules,.git,.next} 2>/dev/null | head -10

echo "=== Private keys ==="
grep -rn "BEGIN.*PRIVATE KEY\|BEGIN RSA\|BEGIN EC" . --exclude-dir={node_modules,.git,.next} 2>/dev/null | head -10

echo "=== NextAuth secret check ==="
grep -rn "NEXTAUTH_SECRET\|AUTH_SECRET" . --include=".env*" 2>/dev/null | \
  grep -qv "your_\|changeme\|example" && echo "  OK: NextAuth secret set" || \
  echo "  CRITICAL: NEXTAUTH_SECRET not set or is placeholder"
```

---

## Phase 6: Configuration Review

```bash
echo "=== .gitignore coverage ==="
for sensitive in ".env" ".env.local" ".env.production" ".env.development" ".next"; do
    grep -q "$sensitive" .gitignore 2>/dev/null && echo "  OK: $sensitive in .gitignore" \
      || echo "  WARN: $sensitive not in .gitignore"
done

echo "=== Dockerfile security (if present) ==="
for f in $(find . -name "Dockerfile*" 2>/dev/null | grep -v node_modules); do
    grep -q "^USER " "$f" || echo "  WARN: No USER directive in $f (runs as root)"
    grep -qiE "^ARG.*SECRET|^ARG.*KEY|^ARG.*PASSWORD" "$f" && echo "  HIGH: Build-time secrets as ARG in $f"
    grep -n "^FROM" "$f" && grep -q ":latest" "$f" && echo "  INFO: Using :latest tag (pin to digest)"
done

echo "=== CORS configuration ==="
grep -rn -E "Access-Control-Allow-Origin.*\*|cors.*origin.*\*" . \
  --include="*.ts" --include="*.js" \
  --exclude-dir={node_modules,.git,.next} 2>/dev/null | head -20

echo "=== Vercel config ==="
cat vercel.json 2>/dev/null | python3 -c "
import json,sys
try:
    d=json.load(sys.stdin)
    print('Headers:', d.get('headers','none'))
    print('Rewrites:', len(d.get('rewrites',[])), 'rules')
    print('Functions:', list(d.get('functions',{}).keys())[:5])
except: pass
" 2>/dev/null
```

---

## Phase 7: Generate Security Report

After all phases, synthesize findings into this report:

```
# Next.js Security Vulnerability Report
Generated: [date]
Project: [name from package.json]
Next.js Version: [version]
Router Type: App Router / Pages Router
Scanner: Claude Security Scanner

## Executive Summary
[2-3 sentence security posture summary]

## Severity Summary
| Severity | Count |
|----------|-------|
| CRITICAL | N     |
| HIGH     | N     |
| MEDIUM   | N     |
| LOW      | N     |

## Critical & High Findings

### [VULN-001] [Title]
- **Severity**: CRITICAL/HIGH
- **Category**: [OWASP A0X / Next.js-specific]
- **Location**: `path/to/file.tsx:line`
- **Description**: What it is and why it's dangerous
- **Evidence**: [grep match or code pattern — NEVER expose actual secrets]
- **Remediation**: Exact fix with code example where possible

## Medium Findings
[condensed format]

## Low / Informational
[list format]

## Dependency Vulnerabilities
| Package | Severity | CVE | Fix Version |
|---------|----------|-----|-------------|

## Secrets Detected
[Locations only — REDACT all actual values]

## Next.js-Specific Checklist
- [ ] All API routes require authentication
- [ ] Server Actions validate input (Zod/Yup)
- [ ] No server-side env vars in 'use client' components
- [ ] NEXT_PUBLIC_ vars contain no secrets
- [ ] Middleware enforces auth on protected routes
- [ ] Security headers configured in next.config
- [ ] Content-Security-Policy set
- [ ] Rate limiting on API routes
- [ ] .env files in .gitignore
- [ ] NEXTAUTH_SECRET / AUTH_SECRET is set and strong
- [ ] npm audit clean (0 critical/high)

## Recommended Next Steps
1. [Priority 1]
2. [Priority 2]
...

## Tools Used
[list of tools that ran successfully]
```

---

## Severity Classification

| Severity     | Examples                                                                              |
| ------------ | ------------------------------------------------------------------------------------- |
| **CRITICAL** | RCE, SQLi, hardcoded prod credentials, auth bypass, NEXTAUTH_SECRET missing           |
| **HIGH**     | XSS, SSRF, server env in client component, unvalidated Server Actions, path traversal |
| **MEDIUM**   | Missing rate limiting, no security headers, wildcard CORS, weak crypto                |
| **LOW**      | reactStrictMode off, :latest Docker tag, missing .gitignore entries                   |
| **INFO**     | Best practices, performance-adjacent security suggestions                             |

---

## OWASP Top 10 — Next.js Mapping

| OWASP                         | Next.js Attack Surface                                   |
| ----------------------------- | -------------------------------------------------------- |
| A01 Broken Access Control     | Unprotected API routes, missing middleware auth          |
| A02 Cryptographic Failures    | Weak secrets, NEXT*PUBLIC* leaking sensitive data        |
| A03 Injection                 | SQLi in DB queries, eval(), template injection           |
| A04 Insecure Design           | No rate limiting, no input validation on Server Actions  |
| A05 Security Misconfiguration | Missing headers in next.config, wildcard image domains   |
| A06 Vulnerable Components     | Outdated Next.js with CVEs, vulnerable npm packages      |
| A07 Auth Failures             | Missing NEXTAUTH_SECRET, no session checks in API routes |
| A08 Data Integrity Failures   | No CSRF protection, unsafe deserialization               |
| A09 Logging Failures          | console.log of sensitive data, no error boundaries       |
| A10 SSRF                      | User-controlled URLs in server-side fetch() calls        |

---

## Tips

- **Always run all phases** — different phases catch different things.
- **Save report to** `/mnt/user-data/outputs/nextjs-security-report.md`.
- **Never expose actual secret values** in the report — redact them.
- If semgrep/npm can't install (network restrictions), rely on manual grep patterns.
- For monorepos, scan each `apps/*` package separately.
