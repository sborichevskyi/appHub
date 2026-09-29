# Bug List

## BUG-001 — Users can get locked out of login and signup
Status: done
Priority: high

`isNotAuth` (`server/src/midlewares/isNotAuth.ts:7`) returns `403` whenever a `refreshToken` cookie is present, even an invalid one.

The cookie lives 30 days (`authController.ts:85,139,233`) but the JWT expires in 7 days (`jwt.service.ts:44`). After a week of inactivity the user looks logged out, yet every login attempt returns `403` until the cookie finally expires.

The cookie is `httpOnly`, so the client can't clear it.

---

## BUG-002 — Logout doesn't work in production
Status: done
Priority: high

Logout is hard-coded to `http://localhost:5000` (`client/src/components/Header/Header.tsx:15`).

In production, the request is sent to localhost instead of the production server, so the server never clears the `refreshToken` cookie.

After reloading the page, the user can be logged in again because the cookie was never removed.

---

## BUG-003 — Activation doesn't log the user in
Status: done
Priority: high

`Activate.tsx` calls `fetch` without `credentials: 'include'`, so the browser doesn't store the cookies set by the server.

After successful activation, the user is redirected to `/profile`, but the profile page sees the user as unauthenticated and asks them to log in.

In development, React StrictMode runs the effect twice. The second activation request uses the same token after it has already been consumed, so it gets a `404`.

This can make the UI show `Activation failed` even though the activation itself succeeded.

---

## BUG-004 — Signup doesn't validate confirmPassword
Status: done
Priority: medium

The signup form collects `confirmPassword`, but it never compares it with the original password.

The form can therefore be submitted with different password values.

There is also a mismatch between the client and server response handling. The client calls `setCredentials` using `response.user` and `response.accessToken`, but the server returns the user object directly and doesn't return an `accessToken`.

---

## BUG-005 — Failed activation email leaves a stuck account
Status: open
Priority: high

The user row is created before the activation email is sent (`authController.ts`).

If sending the activation email fails, the server returns `500`, but the user remains in the database.

Trying to register again with the same email then returns `User already exist`.

There is also no way for the user to request another activation email, leaving the account stuck.

---

## BUG-006 — Deleting an application deletes other users' notes
Status: open
Priority: high

Deleting an application calls:

`Comment.destroy({ where: { jobId } })`

in `application.service.ts:58`.

The query filters only by `jobId` and does not include `userId`.

Because scraped jobs are shared between users, deleting an application for one user can delete comments belonging to other users who have the same job.

---

## BUG-007 — Manual jobs collide on the unique `(source, url)` index
Status: open
Priority: high

`Job.ts:16` has a unique index on `(source, url)`.

Every manually created job uses `source = 'manual'`, while the URL field is optional and defaults to an empty string.

As a result, after one manual job without a URL exists, every later manual job without a URL violates the unique constraint.

The same problem occurs when two users add a job with the same URL.

`ModalCreateApp` doesn't catch the error, so the modal remains open with an unhandled rejection.

There is also a partial-creation problem: if `createJob` succeeds but `createApplication` fails, the job remains in the database without an application.

---

## BUG-008 — Worker doesn't store the correct job level
Status: open
Priority: medium

`jobWorker.ts:30` passes `v.titile` and `v.descdescription` to the level detector.

These properties contain typos, so `detectLevel` receives `undefined` and returns `unknown2` (`detectLevel.ts:17`).

TypeScript doesn't catch this because Adzuna results are typed as `any`.

There is also a second mismatch: even after fixing the property names, the values offered by the client use `mid`, while the server's detector returns values such as `middle` or `lead`.

---

## BUG-009 — Applications API returns incorrect status codes
Status: open
Priority: medium

The applications update, delete and create services throw errors when a resource is not found or already exists.

The controllers catch every error and return `500`.

Because of this, the controller's `if (!result) -> 404` checks can never handle these cases.

An invalid application status can also result in a database error and is returned as `500` instead of an appropriate client error.

---

## BUG-010 — GET /users exposes every user's name and email
Status: open
Priority: high

`GET /users` (`userController.ts:9`) allows any logged-in user to retrieve every user's name and email.

The endpoint does not restrict the returned users to the current user or otherwise protect this information.

There is also an empty `catch {}` block. If the database query fails, the controller doesn't send a response, so the request can remain pending indefinitely.

---

## BUG-011 — Requests fire when the user isn't logged in
Status: open
Priority: high

`Jobs.tsx` and each `JobCard` call `useGetUserApplicationsQuery()` without a `skip` condition.

`Applications.tsx` calls `useGetCommentsByJobsQuery(jobIds)` without checking whether the user is authenticated or whether `jobIds` is empty.

When `jobIds` is empty, the server returns `400`.

In demo mode or when logged out, these requests return `401`. This triggers the refresh flow, which also fails, and then `logout()` runs.

`logout()` sets `isAuthInitialized = false`, so pages waiting for this flag can stop loading their data.

---

## BUG-012 — Missing application is treated as an error
Status: open
Priority: medium

`GET /applications/:jobId` returns `404` when the user hasn't saved an application for the requested job.

However, the client types the response as `application | null`, implying that a missing application is an expected `null` result rather than an error.

The current client behavior mostly works by accident, but the API response and client type do not represent the same contract.

---