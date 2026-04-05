# USER PRIVACY POLICY

## 1. Purpose

These Terms of Use govern the use of the **Ecoindex Browser Extension** (hereinafter “the Extension”).

The Extension provides the Ecoindex score of a web page by querying a dedicated backend service ([Ecoindex BFF](https://github.com/cnumr/EcoIndex_BFF) which is a Ecoindex official API middleware).

---

## 2. Service Operation

When the Extension is active on a web page:

* The current page URL is sent to the Ecoindex BFF backend service.
* The service checks whether an Ecoindex score already exists:

  * in the database, or
  * in cache.
* If a score exists, it is returned immediately.
* If no score is available:

  * it may be computed,
  * and then securely stored.

### Result Storage

Results are stored in an encrypted manner using the following scheme:

* Key: `ecoindex_sha1(url)`
* Value: associated Ecoindex score

No plain-text URL is stored in this caching mechanism.

---

## 3. Data Collection

### 3.1 IP Address

* The user’s IP address may be collected **only within backend technical logs**.
* These logs are strictly used for security, maintenance, and diagnostic purposes.

### 3.2 Visited URLs

* The visited page URL is transmitted to retrieve or compute the Ecoindex score.
* This URL may be used to generate a cache key (SHA1 hash).

---

## 4. Privacy and Data Protection

The Extension follows strict privacy principles:

* **No data correlation**:

  * IP addresses and visited URLs are not linked or stored together.

* **No tracking**:

  * No behavioral analysis is performed.
  * No user tracking mechanisms are implemented.

* **No commercial use**:

  * Data is not used for marketing or advertising purposes.

* **No third-party sharing**:

  * Collected data is never shared with third-party services.

---

## 5. Security

* Cached data is stored in an encrypted format.
* Irreversible hashing mechanisms are used to minimize URL exposure.

---

## 6. Acceptance of Terms

By installing and activating the Extension, users fully accept these Terms of Use, including the privacy policy described herein.

---

## 7. Changes to Terms

These Terms may be updated at any time. Users are encouraged to review them regularly.

---

## 8. Contact

For any questions regarding these Terms or data handling, please contact the project maintainers.
