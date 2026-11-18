# ExamSidekick

A responsive exam-preparation website built with plain HTML, CSS and JavaScript. It is designed to work as a static website, so you can publish it free with **GitHub Pages**.

## Features
- Responsive dashboard for mobile, tablet and desktop
- Practice quizzes across Science, Mathematics, English and Reasoning
- Multiple-choice questions with instant feedback and explanations
- Quiz results, average score, best score and time tracking
- Search and subject filters
- Personal study planner with add, complete and delete actions
- Saves progress and tasks in the browser using `localStorage`
- No framework, build step, database or API key required

## Run locally
1. Download or clone this repository.
2. Open `index.html` in a modern browser.

For a local web server, you can also run:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

## Publish on GitHub Pages
1. Create a new repository on GitHub, for example `exam-sidekick`.
2. Upload `index.html`, `style.css`, `script.js` and this `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then click **Save**.
6. Wait for the Pages deployment. GitHub will show your public website URL in the Pages section.

## Customise the questions
Open `script.js` and edit the `quizSets` array. Each quiz has:
- `id`: unique identifier
- `title`, `subject`, `icon`, `level`, `description`
- `questions`: an array of objects with `q` (question), `o` (four options), `a` (zero-based correct option index), and `e` (explanation)

Example:
```js
{
  q: "What is 2 + 2?",
  o: ["3", "4", "5", "6"],
  a: 1,
  e: "2 + 2 = 4."
}
```

## Important notes
- This is a working **front-end starter website**. It does not include user accounts, online leaderboards, admin dashboards, cloud syncing or a server-side database.
- Data is saved in the current browser on the current device. Clearing browser storage removes that local progress.
- The included questions are sample practice content. Verify and expand them for your target exam and syllabus before publishing.
- Google Fonts are loaded from Google Fonts; the site still works with fallback fonts if unavailable.

## Suggested next upgrades
- Add a backend (for example, Supabase or Firebase) for accounts and cross-device progress.
- Add an admin question editor and import questions from CSV.
- Add exam-specific courses, timed full-length mock tests and downloadable results.
