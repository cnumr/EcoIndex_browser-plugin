# USER PRIVACY POLICY

## 1. Purpose

These Terms of Use govern the use of the **Ecoindex Browser Extension** (hereinafter “the Extension”).

The Extension provides the Ecoindex score of a web page by querying a dedicated backend service ([Ecoindex BFF](https://github.com/cnumr/EcoIndex_BFF) which is a Ecoindex official API middleware).

---

## 2. Service Operation

When the Extension is active on a web page:

- The current page URL is sent to the Ecoindex BFF backend service.
- The service checks whether an Ecoindex score already exists:
  - in the database, or
  - in cache.

- If a score exists, it is returned immediately.
- If no score is available:
  - it may be computed,
  - and then securely stored.

### Result Storage

Results are stored in an encrypted manner using the following scheme:

- Key: `ecoindex_sha1(url)`
- Value: associated Ecoindex data result

No plain-text URL is stored in this caching mechanism.

### 2.1 Browser permissions (transparency)

The extension manifest may include the following declarations and use them only as described here:

```json
{
  "permissions": ["activeTab", "storage"],
  "host_permissions": ["<all_urls>"]
}
```

- **`activeTab`** — Grants **temporary** access to the active tab when you interact with the extension (for example when you open the toolbar popup). The extension uses this to read the **URL of the page you are viewing** so it can request the corresponding Ecoindex result from the backend. It does **not** give ongoing read access to all tabs in the background.

- **`storage`** — Used to keep **local data on your device**: extension preferences and short-lived UI state (for example toolbar badge information tied to the current tab). This storage is not used to build a browsing history for third parties.

- **`host_permissions`: `<all_urls>`** — Declares that the extension may **run in the context of web pages on any site** you visit. This pattern is required when the extension uses **content scripts** injected on all pages (for example to share helpers with the popup) or when the browser ties injection to broad host permissions. **This is not used for behavioural tracking**: the goal remains to obtain the current page URL for the Ecoindex query described above. Where store policies allow, **network** access to the backend is kept to the official Ecoindex API host (`https://bff.ecoindex.fr/`) rather than arbitrary sites.

Some builds may also request **`tabs`** so the background logic can react when you switch tabs or load a page, still in line with the same purpose (updating the badge for the active tab).

---

## 3. Data Collection

### 3.1 IP Address

- The user’s IP address may be collected **only within backend technical logs**.
- These logs are strictly used for security, maintenance, and diagnostic purposes.

### 3.2 Visited URLs

- The visited page URL is transmitted to retrieve or compute the Ecoindex score.
- This URL may be used to generate a cache key (SHA1 hash).

---

## 4. Privacy and Data Protection

The Extension follows strict privacy principles:

- **No data correlation**:
  - IP addresses and visited URLs are not linked or stored together.

- **No tracking**:
  - No behavioral analysis is performed.
  - No user tracking mechanisms are implemented.

- **No commercial use**:
  - Data is not used for marketing or advertising purposes.

- **No third-party sharing**:
  - Collected data is never shared with third-party services.

---

## 5. Security

- Cached data is stored in an encrypted format.
- Irreversible hashing mechanisms are used to minimize URL exposure.

---

## 6. Acceptance of Terms

By installing and activating the Extension, users fully accept these Terms of Use, including the privacy policy described herein.

---

## 7. Changes to Terms

These Terms may be updated at any time. Users are encouraged to review them regularly.

---

## 8. Contact

For any questions regarding these Terms or data handling, please contact the project maintainers.
