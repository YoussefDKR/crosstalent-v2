# Domain setup (www as primary)

Canonical site: **https://www.crosstalent.io**  
Bare **https://crosstalent.io** redirects to www (Vercel + app middleware).

## 1. Vercel → Project → Settings → Domains

1. Click **Add** → enter `www.crosstalent.io` → follow DNS instructions until valid.
2. On `www.crosstalent.io`, open **⋯** → **Set as Primary Domain** (or “Make primary”).
3. On `crosstalent.io`, enable **Redirect to www.crosstalent.io** (Vercel shows this when both domains are added).

Keep `crosstalent-v2.vercel.app` as a preview URL only if you want.

## 2. Dynadot DNS

Use what Vercel shows after adding each domain. Typical setup:

| Type  | Name | Value                    |
|-------|------|--------------------------|
| CNAME | www  | `cname.vercel-dns.com`   |
| A     | @    | `216.198.79.1`           |

Remove old/conflicting A or CNAME records for `@` and `www`.  
Wait up to 24–48h for DNS; Vercel should turn green when records match.

## 3. Environment variables (Vercel → Settings → Environment Variables)

**Edit** (do not duplicate) for **Production**:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://www.crosstalent.io` |

Redeploy after saving.

## 4. Supabase → Authentication → URL configuration

| Field | Value |
|-------|--------|
| Site URL | `https://www.crosstalent.io` |
| Redirect URLs | `https://www.crosstalent.io/auth/callback` |

Optional: keep `https://crosstalent.io/auth/callback` during transition.

## 5. Google Cloud OAuth client

**Authorized JavaScript origins:**

- `https://www.crosstalent.io`
- `https://crosstalent.io` (optional, during transition)

Redirect URI stays the Supabase URL (`https://….supabase.co/auth/v1/callback`).
